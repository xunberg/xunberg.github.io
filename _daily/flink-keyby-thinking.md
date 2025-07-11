---
layout: post
title: "Flink KeyBy 数据倾斜问题深度解析与优化实践"
date: 2023-07-11
category: "技术深度"
excerpt: "记录在 Flink 实时数据处理中遇到的 KeyBy 数据倾斜问题，深入分析 Flink KeyGroup 分配机制，并提供了自定义 Key 重平衡的解决方案。"
tags: 
  - Flink
  - 数据倾斜
  - KeyBy
  - 实时计算
  - 优化
author: "Xunberg"
---

# 背景

最近 公司组织架构调整，我也被调整到了 数据中台组，刚好最近分配到一个需求任务，这个任务其实也很简单，就是公司的BI分析需要一个维护的 统计分析数据 ，这部分数据  由于一些历史等原因，是solr 那边 做完索引的专利数据，发对应的专利消息到对应的Kafka  的一个topic 中，我们数据组这边消费消息后，做一些etl 的工作后 入库，为了保证数据的实时性，我们采用了Flink 来消费Kafka的消息,我这边只要在我们的处理专利数据的sink中，新增一个逻辑 处理这份数据，然后入库，最终提供给BI那边的数据 使用！

代码 我很快的熟悉了下流程后 写完了，但是 我又熟悉了整个消费流程的代码，看到有一处代码的时候 我有点迷糊 表示看不懂为什么这么做，最终才有了这篇博文，为了记录下这个过程

# 过程

## show code

```java
FlinkKafkaConsumer<SolrItem> consumer = new FlinkKafkaConsumer<>(topicNames, new SolrRecordSchema(), properties);
DataStreamSource<SolrItem> dataStreamSource = env.addSource(consumer).setParallelism(total_kafka_parallelism);
dataStreamSource.keyBy(new SolrKeySelector<>(tidbParallelism))
                .window(TumblingProcessingTimeWindows.of(Time.seconds(windowSize)))
                .apply(new SolrItemSortCollectWindowFunction())
                .addSink(new PatentSolrSink())
                .name("XXXX")
                .setParallelism(tidb_parallelism);
```

其中 keyby的代码 SolrKeySelector 我跟进去来看了下代码：

```java
public class SolrKeySelector<T extends SolrItem> implements KeySelector<T, Integer> {
    private static final long serialVersionUID = 1429326005310979722L;
    private int parallelism;
    private Integer[] rebalanceKeys;

    public SolrKeySelector(int parallelism) {
        this.parallelism = parallelism;
        rebalanceKeys = KeyRebalanceUtil.createRebalanceKeys(parallelism);
    }
    @Override
    public Integer getKey(T value) throws Exception {
        return rebalanceKeys[Integer.parseInt(value.getKey()) % parallelism];
    }
}
```



```java
public class KeyRebalanceUtil {
    public static Integer[] createRebalanceKeys(int parallelism) {
        HashMap<Integer, LinkedHashSet<Integer>> groupRanges = new HashMap<>();
        int maxParallelism = KeyGroupRangeAssignment.computeDefaultMaxParallelism(parallelism);
        int maxRandomKey = parallelism * 12;
        for (int randomKey = 0; randomKey < maxRandomKey; randomKey++) {
            int subtaskIndex = KeyGroupRangeAssignment.assignKeyToParallelOperator(randomKey, maxParallelism, parallelism);
            LinkedHashSet<Integer> randomKeys = groupRanges.computeIfAbsent(subtaskIndex, k -> new LinkedHashSet<>());
            randomKeys.add(randomKey);
        }
        Integer[] rebalanceKeys = new Integer[parallelism];
        for (int i = 0; i < parallelism; i++) {
            LinkedHashSet<Integer> ranges = groupRanges.get(i);
            if (ranges == null || ranges.isEmpty()) {
                throw new IllegalArgumentException("Create rebalanceKeys fail.");
            } else {
                rebalanceKeys[i] = ranges.stream().findFirst().get();
            }
        }
        return rebalanceKeys;
    }
}
```

以上就是 我感到迷惑的代码，不知道这么做是为了什么，尤其是KeyRebalanceUtil 这个类，从名字上能看出 是为了key的平衡的工具类，猜测是为了重平衡key的，后来也是自己看了相关的文章后，自己做一下总结，记录一下

## 一些基础点

首先 上面的一些代码，设计Flink的 一些算子，来总结一下

### keyby 算子

keyby 算子是根据指定的键来将DataStream流来转换为KeyedStream流，使用keyby 算子必须使用键控状态，其从逻辑上将流划分为了不想交的分区，具有相同键的记录都会被分配到同一个分区中，keyby内部使用哈希分区来实现；

我们有多种可以指定建的方法，如:

dataStream.keyBy("name");//通过字段名称去进行分区

dataStream.keyBy(0);//通过元数组中的第一个元素进行分区

我们也可以写自己Function ,只要实现implements KeySelector<T, Integer> 接口就可以，如我们工程中使用的方法；

### Windows 窗口

窗口是处理无线流的核心，窗口把流分成了有限大小的多个“存储桶”，可以在其中对事件引用计算。

窗口可以是时间驱动比如一秒钟 ，也可以是数据驱动如100个元素等；

在时间驱动的基础上，可以将窗口划分为几种类型：

- 滚动窗口：数据没有重叠
- 滑动窗口：数据有重叠
- 会话窗口：由不活动的间隙隔开

## 为什么会重新设计key重平衡

上面我进到的说过 keyby 算子 是用来拆分键控流的，内部使用hash来进行key的分区，说白了 就是 要根据key 去计算 ，当前key应该分配到那一个subtask中运行，

那我们来详细看下 Flink中keyby 进行分组的时候 是怎么样完成的，我们可以从源码中得到答案

这其实要分为2个步骤：

- 根据key 计算 属于哪一个 KeyGroup
- 计算 KeyGroup 属于哪一个subtask

### 根据key 去计算其对应哪一个keyGroup

```java
public static int assignToKeyGroup(Object key, int maxParallelism) {
        Preconditions.checkNotNull(key, "Assigned key must not be null!");
        return computeKeyGroupForKeyHash(key.hashCode(), maxParallelism);
 }
 
public static int computeKeyGroupForKeyHash(int keyHash, int maxParallelism) {
        return MathUtils.murmurHash(keyHash) % maxParallelism;
}
 
```

首先我assignToKeyGroup 方法，这个方法的入参，一个是key,还有一个是maxParallelism

key 这个参数我们可以理解，就是要计算的值，那maxParallelism 这个最大并行度又是什么，那么看下 这段方法;

```java
 public static int computeDefaultMaxParallelism(int operatorParallelism) {
        checkParallelismPreconditions(operatorParallelism);
        return Math.min(Math.max(MathUtils.roundUpToPowerOfTwo(operatorParallelism + operatorParallelism / 2), 128), 32768);
    }
```

上面的方法就是 计算最大并行度的方法，从上面的算法我们可以知道 计算规则如下：

1. 将算子并行度 * 1.5 后，向上取整到 2 的 n 次幂 
2.  跟 128  也就是2的7次方 相比，取 max 
3.  跟 32768  也就是2的15次方 相比，取 min

我自己测试了一下  当算子的并行度 在86一下的时候，最大并行度 都是最小值128，正常我们不会调整这个最大并行度的值，因为 一旦调高了最大并行度，就会产生更多的key Groups 组数，是的状态的元数据 增大，导致Checkpoint快照也随之变大，减低性能，关于这个KeyGroup 和CheackPoint的关系  我后面 准备再写一遍博文 描述一下，感觉这个还是很有必要的！

好的，回到 assignToKeyGroup 方法中，我们看到Flink 中没有采用直接采用key的hashCode的值，而是有进行了一次murmurhash的算法，这样最的目的就是 为了尽量的大散数据，减少hash碰撞。但是 对于 我这个项目中 使用的key  是专利的docId,是存数字生成的，计算后很容易导致Subtask index 相同的。

### 计算keyGroup 属于哪一个并行度

```java
public static int assignKeyToParallelOperator(Object key, int maxParallelism, int parallelism) {
         Preconditions.checkNotNull(key, "Assigned key must not be null!");
         return computeOperatorIndexForKeyGroup(maxParallelism, parallelism, assignToKeyGroup(key, maxParallelism));
 }
 
public static int computeOperatorIndexForKeyGroup(int maxParallelism, int parallelism, int keyGroupId) {
        return keyGroupId * parallelism / maxParallelism;
 }
```

我们看下 computeOperatorIndexForKeyGroup 这个方法，这个方法就是 计算得到keyGroup  属于 哪一个index 的

### Test Code

也许从上面的源码上 我们看不出什么问题，下面我来要一段代码 来测试下，让大家去发现下问题

```java
@Test
public void test() {
 int parallelism = 5;//设置并行度
 int maxParallelism = KeyGroupRangeAssignment.computeDefaultMaxParallelism(parallelism);//计算最大并行度
 for (int i = 0; i < 10; i++) {
     int subtaskIndex = KeyGroupRangeAssignment.assignKeyToParallelOperator(i, maxParallelism, parallelism);
     KeyGroupRange keyGroupRange = KeyGroupRangeAssignment.computeKeyGroupRangeForOperatorIndex(maxParallelism, parallelism, subtaskIndex);
     System.out.printf("current key:%d,keyGroupIndex:%d,keyGroupRange:%d-%d \n", i, subtaskIndex, keyGroupRange.getStartKeyGroup(), keyGroupRange.getEndKeyGroup());
   }
}
```

运行的结果：

```
current key:0,keyGroupIndex:3,keyGroupRange:77-102 
current key:1,keyGroupIndex:3,keyGroupRange:77-102 
current key:2,keyGroupIndex:4,keyGroupRange:103-127 
current key:3,keyGroupIndex:4,keyGroupRange:103-127 
current key:4,keyGroupIndex:0,keyGroupRange:0-25 
current key:5,keyGroupIndex:4,keyGroupRange:103-127 
current key:6,keyGroupIndex:0,keyGroupRange:0-25 
current key:7,keyGroupIndex:4,keyGroupRange:103-127 
current key:8,keyGroupIndex:0,keyGroupRange:0-25 
current key:9,keyGroupIndex:1,keyGroupRange:26-51 
```

分析结果：

>keyGroupIndex：0   keyGroupRange:0-25        key: 4,6,8
>
>keyGroupIndex：1   keyGroupRange:26-51      key：9
>
>keyGroupIndex：2   keyGroupRange:52-76      key:
>
>keyGroupIndex：3   keyGroupRange:77-102    key: 0,1
>
>keyGroupIndex：4   keyGroupRange:103-127  key:  2,3,5,7

从上面运行的结果来看，其中我们能发现一些问题，首先keyGroupIndex为2的一个没有，keyGroupIndex为4的 有4个key值，如果按照这份数据 去执行，就会导致 我们的subtask 执行的数据很不均匀，导致数据倾斜的问题。

看到这边 我们应该能发现问题了，在少量的数据的时候，很容易就会发生这种数据倾斜的问题，但是当一旦key的数据变多后，这种情况会很好很多~



## 怎么去解决这种问题

其实 怎么去解决这种问题，一开始  的代码 就已经解决了这个问题，KeyRebalanceUtil 这个类就是为了解决这个问题的，那我来测试下，是否正在的解决了 

```java
@Test
    public void testKeyRebalance() {
        int parallelism = 5;
        int maxParallelism = KeyGroupRangeAssignment.computeDefaultMaxParallelism(parallelism);
        Integer[] rebalanceKeys = KeyRebalanceUtil.createRebalanceKeys(parallelism);
        for (int i = 0; i < 10; i++) {
            int new_key = rebalanceKeys[i % parallelism];
            int subtaskIndex = KeyGroupRangeAssignment.assignKeyToParallelOperator(new_key, maxParallelism, parallelism);
            KeyGroupRange keyGroupRange = KeyGroupRangeAssignment.computeKeyGroupRangeForOperatorIndex(maxParallelism, parallelism, subtaskIndex);
            System.out.printf("current key:%d,new_key:%d,keyGroupIndex:%d,keyGroupRange:%d-%d \n", i, new_key, subtaskIndex, keyGroupRange.getStartKeyGroup(),
                    keyGroupRange.getEndKeyGroup());
        }
    }
```

执行的结果：

```
current key:0,new_key:4,keyGroupIndex:0,keyGroupRange:0-25 
current key:1,new_key:9,keyGroupIndex:1,keyGroupRange:26-51 
current key:2,new_key:10,keyGroupIndex:2,keyGroupRange:52-76 
current key:3,new_key:0,keyGroupIndex:3,keyGroupRange:77-102 
current key:4,new_key:2,keyGroupIndex:4,keyGroupRange:103-127 
current key:5,new_key:4,keyGroupIndex:0,keyGroupRange:0-25 
current key:6,new_key:9,keyGroupIndex:1,keyGroupRange:26-51 
current key:7,new_key:10,keyGroupIndex:2,keyGroupRange:52-76 
current key:8,new_key:0,keyGroupIndex:3,keyGroupRange:77-102 
current key:9,new_key:2,keyGroupIndex:4,keyGroupRange:103-127 
```

从上面的结果看，10个key,目前的并行度是5，刚好每个SubTask 可以分配2个key，是解决了 之前的问题的。

其实我们回归头来仔细看下 KeyRebalanceUtil的createRebalanceKeys 方法，其实他怎么去解决的呢，就是首先穷尽了一些数字，然后计算得到每一个SubtaskIndex 仔细的key的列表，然后随机从列表中来取一个,当然方法里面是取的第一个，这样就会使得 这个随机取的key一定会分配在这个SubtaskIndex 里面，这样如果我给每个SubtaskIndex  都分配一个这样的key, 然后 我再把原始的key 和这个随机的key做一个转换，这样就解决了 key值分配不均匀的问题！



其实 最后 我看了下 createRebalanceKeys 的代码 ，有些地方写的有点儿累赘，其实可以优化一下，改成这样：

```java
public static Integer[] createRebalanceKeys(int parallelism) {
        HashMap<Integer, LinkedHashSet<Integer>> groupRanges = new HashMap<>();
        int maxParallelism = KeyGroupRangeAssignment.computeDefaultMaxParallelism(parallelism);
        int maxRandomKey = parallelism * 12;
        Map<Integer, Integer> key_subIndex_map = new HashMap<>();
        for (int randomKey = 0; randomKey < maxRandomKey; randomKey++) {
            int subtaskIndex = KeyGroupRangeAssignment.assignKeyToParallelOperator(randomKey, maxParallelism, parallelism);
            if (key_subIndex_map.keySet().contains(subtaskIndex))
                continue;
            key_subIndex_map.put(subtaskIndex, randomKey);
        }
        log.info("group range size : {},expect size : {}", groupRanges.size(), parallelism);
        return key_subIndex_map.values().toArray(new Integer[key_subIndex_map.size()]);
    }

```

最终的结果 还是一样的，逻辑本质上也是差不多，但是 这样写以后 ，可读性 会变得好很多，之前的那种写法 真的很弯弯绕绕的！

# 总结

总计一下，Flink 中 要学习的东西还有很多，平时还是要善于积累，还有就是 我们看到不理解到代码，要有好奇心，只要带着这样的心态学习，我觉得你才能真正的理解和掌握好收获的知识！

加油！

路途漫漫总有一归。

幸与不幸都有尽头！



