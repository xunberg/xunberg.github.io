eval_fraction = 0.1


# 从 Action 描述到 Command 的小模型 SFT 全流程实战

> 背景：最近在公司 Agent 项目中负责“实验操作描述 → 机器人命令”指令转化能力的调研与落地。这篇文章记录了我如何把 Qwen3-4B-Instruct 打造成稳定的指令模型，涵盖数据分析、LoRA 训练、推理上线以及踩坑复盘，目标是让具备基础 PyTorch / Hugging Face 经验的同学能够在两天内复现。


layout: post
title: "从 Action 描述到 Command 的小模型 SFT 全流程实战"
date: 2025-10-09
category: "LLM"
tags: ["SFT", "Qwen3-4B-Instruct", "LoRA", "指令模型", "Hugging Face", "PyTorch", "Agent"]
excerpt: "记录如何将 Qwen3-4B-Instruct 打造成稳定的指令模型，涵盖数据分析、LoRA 训练、推理上线与踩坑复盘，适合有基础的 AI 工程师快速复现。"
author: "Xunberg"
permalink: /llm/text_2_code_sft/
---
## 1. 项目动机与目标

- **业务诉求**：Agent 需要把实验 SOP 文本（action desc）转换为机器人控制命令（command）。命令格式严格，任何自然语言噪声都会让机器人拒绝执行。
- **技术路线**：使用通用大模型 Qwen3-4B-Instruct 作为基座，配合 LoRA + SFT 进行轻量定制。
- **交付目标**：一套可复现的 Notebook / Python 脚本、合并 LoRA 后的推理流程、以及覆盖数据、调参、监控的技术报告。

整条链路拆解为：**数据准备 → 特征工程 → 模型训练 → 推理验证 → 迭代调优与监控**。

---

## 2. 环境与代码结构

代码位于 `text_code_sft/`，核心组件如下：

| 模块 | 关键文件 | 职责 |
| --- | --- | --- |
| 数据处理与训练 | `text_2_code_sft.ipynb` / `sft_gpt.py` | 清洗数据、构建数据集、配置并运行 `SFTTrainer` |
| 推理与验证 | `text_2_code_inference.ipynb` / `inference.py` | 合并 LoRA、生成命令、正则后处理 |
| 训练数据 | `sft_data/*.json` | 原始/增强数据、验证切分 |
| 文档仓库 | `doc/` | 实验记录与教程（本文） |

Notebook 初始化阶段设置了 Hugging Face 镜像和 GPU 亲和性：

```python
os.environ["HF_ENDPOINT"] = "https://hf-mirror.com"
os.environ["CUDA_VISIBLE_DEVICES"] = "5"
```

**工程提示**：确保 `pip install -r requirements.txt` 覆盖 `trl>=0.8`、`peft>=0.11`、`transformers>=4.43`，否则 `SFTTrainer` 对 `completion_only_loss` 的支持会缺失。

---

## 3. 数据准备：从 JSONL 到高质量样本

### 3.1 原始格式与语义

`sft_data/training_data.jsonl` 中的每行表示一个原子对话：

```json
{
  "conversation": [
    {
      "input": "行1：取1个50ul枪头，从…",
      "output": "GetDiti(ditiType='50ul', channels=[1])\n..."
    }
  ]
}
```

目标是教模型**只生成命令行，并以 `<eoc>` 终止**，因此我们把自由文本规范成严格的 prompt/completion。

### 3.2 预处理函数拆解

在 Notebook 的 “Load and Prepare Data” 单元里，我把常用处理封装成纯函数，便于单测和复用：

- `strip_line_prefix(text)`：去除“行X：”编号，保留原语义。
- `instruction_variants(record)`：构造带编号 / 去编号两个 instruction 版本，增加鲁棒性。
- `build_prompt_text(desc, template)`：注入统一操作规约，确保模型遵守语法。
- `ensure_eoc_suffix(payload)`：补齐 `<eoc>`，并在 augmentation 时做重复检查。

核心 Prompt 指南如下：

```python
PROMPT_GUIDELINES = (
    "You must respond using robot command syntax only.\n"
    "- Output one command per line.\n"
    "- Do not add explanations, natural language, or metadata.\n"
    "- Finish the sequence immediately after the final command.\n"
    "- Terminate the entire response with the token <eoc>."
)
```

### 3.3 数据增强：模板 + 指令变体

原始语料只有 95 条，如果直接训练几乎立刻过拟合。我做了两层增强：

1. **Prompt 模板**：为同一条 instruction 组合 4 种上下文语气（直接指令、目标描述、实验员备忘、QA 风格），通过 `augment_examples` 批量生成 `template` 标签，后续分析 loss 时可按模板聚合。
2. **指令变体**：保留原始编号版 + 去编号版，使模型不只依赖“行X”这样的符号定位。

增强后样本字段：`{"prompt", "completion", "template", "variant", "source_index"}`。`source_index` 可帮助排查某条原始语料在训练集中的表现。

### 3.4 数据概览：命令分布与覆盖度

为确保增强之后的语料仍然均衡，我写了一个统计脚本（也放进了 Notebook 数据分析单元）：

统计结果：

| 样本量 | 平均命令数 | 主要命令 | 次要命令 |
| --- | --- | --- | --- |
| 95 | 1.0 | `GetDiti` 71 次 | `Transfer` 48 次 / `PCR` 28 次 / `Delay` 18 次/ `Mix` 34 |

这提示我们：`GetDiti` 明显占主导，而 `Transfer`、`PCR` 是关键长尾，需要在验证集中保证曝光。后续可以考虑人工补充少见命令或设计针对性的模板。

### 3.5 数据准备增强策略（长尾词 / 指令遵循 / 数据对齐）

- **长尾词与命令覆盖**：
    - 针对 `Transfer`、`PCR` 等低频操作，额外构造“边界条件”样本（极小体积、跨板位、异常通道组合），并在训练时设置 `sample_weight` 提高曝光频率。
    - 建立长尾词表，在数据增强阶段自动检测漏采命令并拉起半自动补标流水线，保证每个命令模板至少出现 10 次。
- **指令遵循保障**：
    - 统一使用 JSON 结构作为 completion，配合 system prompt 强制模型仅填充槽位；对历史文本格式样本进行迁移或剔除，避免目标分布混杂。
    - 在数据出口加上 schema validator（`pydantic`/`jsonschema`），训练前即校验字段类型与必填项，减少后续因脏数据导致的 loss 震荡。
- **数据对齐与一致性**：
    - 训练、验证、推理全链路使用同一套 `preprocess_action_desc` 与 `build_prompt_text` 函数，确保 NFKC 归一化、模板注入、JSON 序列化完全一致。
    - 维护一份“指令-命令对照表”，记录每条样本的 `source_index` 与版本号，方便回溯 LoRA checkpoint 与数据快照之间的关系；必要时可以用 Delta Lake 或 git-lfs 跟踪样本演化。

这些策略让数据准备不再只是“清洗 + 增强”，而是有计划地覆盖长尾、约束模型输出空间，并确保训练/推理语境完全对齐，从源头提高指令遵循率。

---

## 4. 数据集拆分：小样本的平衡策略

初版按 70/20/10（train/eval/holdout）切分，结果出现两个问题：

- 训练集只有 67 条原始样本，长尾命令直接被分走，模型训练不到。
- holdout 没经过预处理，`trainer.evaluate` 缺失 `input_ids`，触发 `KeyError`。

经验总结：**在小样本场景，调参阶段优先保证训练集覆盖面，留存评估可以延后**。

最终配置：

```python
eval_fraction = 0.1
min_eval = 2 if len(raw_examples) >= 20 else 1
eval_count = max(min_eval, int(len(raw_examples) * eval_fraction))
train_source = raw_examples[eval_count:]
eval_source = raw_examples[:eval_count]
```

除此之外我还做了两点改动：

1. **提前 materialize**：在进入 `datasets.Dataset.from_dict` 前把增强结果写入 `train_examples / eval_examples`，避免 `remove_unused_columns` 冲掉自定义字段。
2. **保留 metadata**：`DatasetDict({"train": train_ds, "eval": eval_ds})` 中保留 `template`、`variant`，方便日志里交叉分析。

---

## 5. 训练配置与调参细节

### 5.1 训练配置概览

- **基座模型**：`Qwen/Qwen3-4B-Instruct-2507`
- **Tokenizer**：追加 `<eoc>` 并设置 `pad_token_id = eos_token_id`
- **LoRA 目标层**：`q_proj`, `k_proj`, `v_proj`, `o_proj`
- **最大序列长度**：512（prompt + completion 合并后仍低于此上限）
- **梯度截断**：`gradient_accumulation_steps=4`，等效全局 batch size ≈ 16
- **混合精度**：bf16（A800 环境测试稳定）

### 5.2 LoRA 参数选择

| 参数 | 取值 | 说明 |
| --- | --- | --- |
| `r` | 8 | 较小秩，足够拟合指令模式，避免过拟合 |
| `lora_alpha` | 16 | 与 `r` 成比例，控制尺度 |
| `lora_dropout` | 0.1 | 小数据场景下提高泛化 |
| `bias` | `none` | 避免额外可训练参数 |

调参心得：`r=16` 在 95 条样本上过拟合明显（验证 loss 波动大），降到 8 后 loss 曲线平滑许多。

### 5.3 SFTConfig 关键项

```python
training_args = SFTConfig(
    output_dir=output_dir,
    num_train_epochs=8,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=5e-5,
    lr_scheduler_type="cosine",
    warmup_ratio=0.03,
    logging_steps=10,
    eval_strategy="epoch",
    save_strategy="epoch",
    save_total_limit=2,
    report_to=["tensorboard"],
    completion_only_loss=True,
    remove_unused_columns=False,
    max_seq_length=512,
    gradient_checkpointing=True,
)
```

几条实践建议：

- **`completion_only_loss`**：必须与 `<eoc>` 配合，否则模型会学习 prompt。
- **`remove_unused_columns=False`**：防止 TRL 把 prompt/completion 字段剔除。
- **`gradient_checkpointing=True`**：对 4B 模型节省显存约 30%，代价是前向耗时增加，可配合 `bf16`。
- **学习率选择**：`1e-4` 在小样本上会震荡，`5e-5` 搭配 `cosine`/warmup 更平滑。

### 5.4 训练监控与诊断

```python
history = trainer.state.log_history
pd.DataFrame(history)[["step", "loss", "eval_loss", "learning_rate"]]
```

监控重点：

- 训练 loss 3 个 epoch 内收敛至 ~0.05。
- `eval_loss` 与训练曲线间距保持在 0.01-0.02，说明过拟合得到缓解。
- 如果某个模板上的样本频繁触发 `nan`，可以用 `train_dataset.filter(lambda x: x["template"] == "prompt_variant")` 定位。

---

## 6. 推理流程：端到端验证

推理 Notebook `text_2_code_inference.ipynb` 主要包含两个阶段：

1. **权重合并**：

    ```python
    base_model = AutoModelForCausalLM.from_pretrained(base_path, device_map="auto", torch_dtype=torch.bfloat16)
    peft_model = PeftModel.from_pretrained(base_model, lora_checkpoint)
    merged_model = peft_model.merge_and_unload()
    merged_model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)
    ```

    合并后可以直接部署，无需额外加载 LoRA 适配器。

2. **命令生成**：

    ```python
    def generate_commands_from_action_desc(desc: str, *, max_new_tokens: int = 128) -> str:
        prompt = build_prompt_text(desc)
        input_ids = tokenizer(prompt, return_tensors="pt").to(device)
        outputs = model.generate(
            **input_ids,
            max_new_tokens=max_new_tokens,
            do_sample=False,
            eos_token_id=tokenizer.convert_tokens_to_ids("<eoc>"),
        )
        decoded = tokenizer.decode(outputs[0], skip_special_tokens=False)
        return post_process_to_commands(decoded)
    ```

`post_process_to_commands` 使用正则 `r"^[A-Z][A-Za-z0-9_]+\(.*\)$"` 匹配每一行命令，并补回 `<eoc>`。调参后模型能够稳定输出 `GetDiti/Aspirate/Dispense/Mix/DropDiti` 全流程，且槽位参数（孔位、体积）保持一致。

---

## 7. 排坑手记：从报错到修复

| Issue | 触发条件 | 根因定位 | 解决方案 |
| --- | --- | --- | --- |
| `<eoc>` 未学习到 | Augmentation 时漏掉 `<eoc>` | completion loss 涉及 prompt | 在 `build_completion_text` 中强制追加 `<eoc>`，并在训练前断言 |
| `KeyError: 'input_ids'` | 对未经处理的 holdout `trainer.evaluate` | `remove_unused_columns` 剪掉字段 | 统一调用 `trainer._prepare_eval_dataset` 或直接取消 holdout |
| 命令重复或缺失 | 推理时 `generate` 生成自然语言 | prompt 不一致 / 温度过高 | 推理使用与训练一致的模板，并关闭采样（`do_sample=False`） |
| 显存溢出 | batch size 较大、4B 模型 | LoRA 层 + 完整模型参数 | 开启 `gradient_checkpointing`，并调低 `per_device_train_batch_size` |

### 案例：JSON 参数格式不一致

- **现象**：模型在推理阶段偶尔输出 `labWare`、`lab Ware` 等错别字键名，或把 `wells` / `channels` / `vols` 写成单值（例如 `"well": "13"`），导致解析失败或执行器拒绝命令。
- **根因排查**：训练语料本身保持了数组格式，但早期 Prompt 未强调“单元素也要写成数组”，system prompt 也缺少 schema 约束；推理端一度与训练端使用不同模板，使模型回退到基座习惯。
- **修复步骤**：
    1. 在 `PROMPT_GUIDELINES` 与 `CHAT_SYSTEM_PROMPT` 中增加明确的 schema 说明，强调 `wells` / `channels` / `vols` 必须使用数组形式，禁止键名别称。
    2. 训练与推理 Notebook 统一改用 `tokenizer.apply_chat_template` 构造 system/user 消息，并对原始描述做 NFKC 归一化，保证提示一致。
    3. 推理端仅保留必要的后处理（控制符剔除 + NFKC），将 `mismatched_cases.jsonl` 作为回归集记录异常样本，便于复盘。
    4. 基于更新后的 Prompt 重新跑一轮 LoRA 微调，让模型从训练端学习强约束格式；临时可在推理端先改提示做烟囱测试，但上线前必须同步训练端提示并重训。
- **回归建议**：新 checkpoint 产出后，优先在 `mismatched_cases.jsonl` 集合上验证成功率；若仍有个别键名漂移，可补充对照样本或引入 schema 校验脚本兜底。

调试经验：**日志一定要保留原始 prompt/completion**。我在 `augment_examples` 输出中额外写入 `prompt_preview` 字段，便于出错时快速复现。

### 案例：指令遵循与命令表示形式的选择

- **背景对比**：早期版本沿用了纯文本 command 作为训练目标，模型容易把命令解释成“自然语言 + 代码片段”的混合输出；在推理时即便加入 system prompt，仍会出现冗余注释或缺少 `<eoc>` 的情况。
- **洞察**：把命令抽象成 JSON 结构（显式字段 + 数组语义）后，模型在指令遵循方面更稳定。一方面，键名提供了“操作 → 参数”映射的显式约束；另一方面，LoRA 只需学习受限的 slot 填充，减轻了自由文本生成的歧义。
- **优化动作**：
    1. 重新标注训练数据，将所有命令统一整理成 JSON（含 `command`, `wells`, `channels`, `vols`, `labware` 等字段），并补充 schema 断言，确保不会混入旧的文本格式样本。
    2. 在 Prompt 中强调“回答必须是一段合法 JSON 数组”，并通过少样本示例展示多命令串联的写法，便于模型把控输出边界。
    3. 训练阶段启用 `json_mode` 观察日志中 `loss` 与 `json_valid_ratio` 的关联，推理阶段配合 `json.loads` 验证与自动回滚策略，使得即便遇到半结构化输出也能快速定位。
- **收益**：迁移到 JSON 结构后，回归集中的 schema 校验通过率显著提升，失败案例集中在极少曝光的长尾命令上；后续可通过定向补齐与提示增强继续收敛。

---

## 8. 质量校验与监控

- **训练阶段**：TensorBoard 跟踪 `loss`、`eval_loss`、`learning_rate`；提前设定 `EarlyStoppingCallback` 门限（如验证 loss 连续两次上升就停止）。
- **数据阶段**：统计命令分布，关注长尾命令是否出现在训练集中；必要时手工补齐。
- **推理阶段**：抽样 10 条开发集样本，使用正则校验生成是否只包含命令；遇到语法错误时，结合 `prompt_preview` 反查数据质量。

可以进一步加入轻量级自动化测试：

```python
assert "<eoc>" in generate_commands_from_action_desc("取 50ul 枪头")
assert "GetDiti" in response
```

---

## 9. 调优心得汇总

1. **数据仍是决定因素**：增强策略与切分策略直接影响模型的泛化能力。
2. **Prompt/Completion 一致性**：训练与推理必须共享同一套模板，避免模型进入非命令模式。
3. **LoRA 参数贴合任务规模**：小样本更适合低秩 + 更高 dropout，先控制容量，再逐步加大。
4. **监控早于问题出现**：通过数据统计、训练日志、推理断言提前暴露异常，省去大量排查时间。
5. **记录复盘**：每个问题（`<eoc>`、数据切分、评估报错）及时沉淀，方便团队协作与后续扩展。

---

## 10. 下一步计划

- 补充更多实验场景（特别是 `Transfer`、`PCR` 等长尾命令），构建真正的 offline holdout。
- 将正则后处理替换成 AST 解析器，对语法和参数类型做校验。
- 在 Agent 流程中集成 A/B 测试，将模型输出接入实际机器人脚本，闭环验证。
- 基于更新后的 schema 提示重新微调 LoRA，并用 `mismatched_cases.jsonl` 做回归校验，确保数组字段与键名完全一致。

---

## 11. 参考与附录

- [Hugging Face TRL 文档](https://github.com/huggingface/trl)
- [Qwen 模型主页](https://huggingface.co/Qwen)
- 本项目 Notebook：`text_code_sft/text_2_code_sft.ipynb`、`text_code_sft/text_2_code_inference.ipynb`
- 数据统计脚本与训练配置片段可在同名 Notebook 的 `Data Diagnostics` 与 `Training` 单元找到。

如果你也在做 action desc → command 的轻量指令学习，欢迎交流更多样本增强和评估策略，期待把行业 know-how 进一步沉淀成通用模板。
