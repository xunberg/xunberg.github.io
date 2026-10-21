# 打赏收款码图片

将您提供的收款码图片放到本目录，并在 `_config.yml` 的 `support` 段更新路径。

## 建议规格

- 格式：PNG 或 JPG（推荐 PNG，背景干净）
- 尺寸：正方形，边长 **400–800 px**（页面会自动缩放）
- 当前使用：
  - `wechat-pay.jpg` — 微信收款码
  - `alipay.jpg` — 支付宝收款码

更换收款码时覆盖上述文件，或新增文件并在 `_config.yml` 的 `support.wechat.image` / `support.alipay.image` 中更新路径。

## 安全提示

收款码会随 GitHub Pages **公网可见**。若担心泄露，可使用官方「赞赏码 / 收款码」并定期更换，勿上传与收款无关的敏感信息。
