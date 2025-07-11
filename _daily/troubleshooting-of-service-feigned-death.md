---
layout: post
title: "Java服务假死问题排查实战：从线程堆栈到超时配置"
date: 2022-03-05
category: "故障排查"
excerpt: "记录一次生产环境中Java服务假死问题的完整排查过程，从发现问题到最终解决，涉及K8S监控、线程堆栈分析、网络超时配置等技术要点。"
tags: 
  - Java
  - 故障排查
  - K8S
  - 线程堆栈
  - 网络超时
author: "Xunberg"
---

# 背景说明

昨天上午，因为疫情的原因，我在家办公，早上起来，常规性的去检查下 自己负责的 增量数据更新的服务，打开队列的监控页面，发现消息出现了积压

## 排查问题

### 消费端

都第一反应，是不是消息的消费端出现了问题，于是 我打开公司的K8S 的监控页面，进入服务，看见控制台上的服务消费日志，已经停留在6个小时之前，后面我切进 容器内部 ，查看服务线程情况，发现容器的里面的 java  进程的CPU 使用情况 都不怎么变动，几乎不动，感觉线程出现了假死的情况

### 联系OPS

由于 服务运行 了很久，最近我也没有改动，我问OPS 那边 是否最近集群 资源 有什么调整，OPS 说没有，然后帮我看了下 整个数据组的集群使用情况，都没什么问题，资源很充足。我和OPS 描述了下情况，OPS说可能OOM了，但是我感觉明显不是这种情况

### 排查问题

既然OPS 说资源都没有，这个程序也跑了半年了，最近也没什么改动，我顿时就很懵，不知道什么情况，之前也有同事和我反馈这个问题，因为整个数据组的任务，爬虫，etl, 都是托管在数据任务平台的，这个平台也就是我自己维护的，当时 我也没意识到这个问题，后面还帮他们做了 服务的定时重启，就是防止这种假死的情况。

于是 我又去监控页面看了下，消息的获取接口的服务压力，看见内存和CPU 使用都还挺好，因为服务的流量情况，OPS的监控页面出现了问题，没法看到流量的情况，导致我排查问题，更加的困难。

没办法，只能从服务系统里面看下情况，于是我有进入服务，使用jps,这个命令系统里面没有，于是 按照了命令

```shell
yum install java-1.8.0-openjdk-devel.x86_64
```

按照好之后，用jps 命令，查看到 系统里面的java 进程ID是1

```
1 com.patsnap.analysis.postporcess.rdapi.dpp.PatentTextAPIInvokServiceV4
```

### 发现问题

后面使用了 jstack -l 1，查看了下 java 的进程的堆栈情况，信息太多，我挑选出一个有用的信息

```java
"pool-1-thread-3" #13 prio=5 os_prio=0 tid=0x00007f84d8535000 nid=0x13 runnable [0x00007f84a34bf000]
   java.lang.Thread.State: RUNNABLE
        at java.net.SocketInputStream.socketRead0(Native Method)
        at java.net.SocketInputStream.socketRead(SocketInputStream.java:116)
        at java.net.SocketInputStream.read(SocketInputStream.java:171)
        at java.net.SocketInputStream.read(SocketInputStream.java:141)
        at java.io.BufferedInputStream.fill(BufferedInputStream.java:246)
        at java.io.BufferedInputStream.read1(BufferedInputStream.java:286)
        at java.io.BufferedInputStream.read(BufferedInputStream.java:345)
        - locked <0x00000000fb338c70> (a java.io.BufferedInputStream)
        at sun.net.www.http.HttpClient.parseHTTPHeader(HttpClient.java:735)
        at sun.net.www.http.HttpClient.parseHTTP(HttpClient.java:678)
        at sun.net.www.protocol.http.HttpURLConnection.getInputStream0(HttpURLConnection.java:1593)
        - locked <0x00000000fb338cc8> (a sun.net.www.protocol.http.HttpURLConnection)
        at sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1498)
        - locked <0x00000000fb338cc8> (a sun.net.www.protocol.http.HttpURLConnection)
        at java.net.HttpURLConnection.getResponseCode(HttpURLConnection.java:480)
        at com.patsnap.base.core.util.HttpMethodUtils.request(HttpMethodUtils.java:234)
        at com.patsnap.base.core.util.HttpMethodUtils.sendPost(HttpMethodUtils.java:48)
        at com.patsnap.base.core.util.ActiveMQUtils.sendMsg(ActiveMQUtils.java:200)
        at 
```



这种线程的信息，我看到了3个，因为获取的消息时候是多线程的，这个服务开了3个线程，看上去 3个线程都是RUNNABLE，没问题呀，但是仔细一看，locked 这个信息 让我关注到了 感觉线程在阻塞 是因为有锁，看样子好像是在读取网络资源信息。会不会是这个地方问题，于是我上网查了下，也有很多人 说遇到了这样的问题

### 定位问题

带着这样的以疑问，我根据堆栈信息 去查看了底层的HttpURLConnection 的方法

```java
 public static String request(String method, String urlPath, Map<String, String> headers, JSONObject param)
        throws Exception {
     ....
    URL url = new URL(urlPath);
    conn = (HttpURLConnection)url.openConnection();
    conn.setRequestMethod("post");
    conn.setDoOutput(true);
    conn.setUseCaches(false);
    conn.connect();
    .....
 }
```

我发现根本没有设置ConnectTimeout ，ReadTimeout  ，于是我进入看了下 2个字段的说明：

ConnectTimeout 的 意思就是用来建立连接的时间。

>```
>* Sets a specified timeout value, in milliseconds, to be used
>* when opening a communications link to the resource referenced
>* by this URLConnection.  If the timeout expires before the
>* connection can be established, a
>* java.net.SocketTimeoutException is raised. A timeout of zero is
>* interpreted as an infinite timeout.
>
>* <p> Some non-standard implementation of this method may ignore
>* the specified timeout. To see the connect timeout set, please
>* call getConnectTimeout().
>```

ReadTimeout  的意思是 已经建立连接，并开始读取服务端资源，如果在规定的时间内没有读取到数据，则报异常

>```
>* Sets the read timeout to a specified timeout, in
>* milliseconds. A non-zero value specifies the timeout when
>* reading from Input stream when a connection is established to a
>* resource. If the timeout expires before there is data available
>* for read, a java.net.SocketTimeoutException is raised. A
>* timeout of zero is interpreted as an infinite timeout.
>*
>*<p> Some non-standard implementation of this method ignores the
>* specified timeout. To see the read timeout set, please call
>* getReadTimeout().
>```

里面都有相同的一句话： A timeout of zero is interpreted as an infinite timeout.  0是指无限超时

于是 我明白 线程为什么一直阻塞正在这边了，而且三个线程都在阻塞了，这些终于明白了为什么会出现服务假死的情况

### 解决问题

当然解决问题就是加上超时时间，我分别设置connectTimeout，readTimeout 为60秒！然后重新构建了服务镜像，发布了上去，果然问题解决了，服务在正常消费了，虽然也会超时，但是服务没有被堵塞！



## 反思问题

后来想了想，为什么会出现这种情况，服务运行这么久了很少出现这样的问题，因为近期 我们的服务从AWS 迁移到腾讯云上，之前很多服务在AWS EC2或者Fargate 的时候 都是直连MQ的来获取消息的，现在由于切换了环境，由于之前的域名没法直接访问了，都切换成用的提供的restful api 来获取消息，切换过后大量的数据任务处理服务上线，导致我本就2个负载的api 消息代理服务，压力很大，导致很多链接超时或者读取超时等情况，后来我看了api 代理的流量情况，确实大了很多，现在我又新增了2个负载，这样才最终结局问题~

## 总结

排查问题的时候，不能总抱着 代码没有改动，服务都运行很久了都没问题的心态去解决服务问题，这样会导致你发现问题的时间会变长很久，我们最近应该还是通过系统工具来定位问题，最后去解决问题，在然后在反思问题的出现的原因！

加油！



推荐几遍博文，排查问题的时候用到了

1：[如何利用线程堆栈定位问题](https://segmentfault.com/a/1190000041411988)

2：[jvm监控三板斧实战-进程假死排查：jmap、jstat、jstack](https://blog.csdn.net/weixin_42005602/article/details/109330236)

3：[Java程序员必备：jstack命令解析](https://juejin.cn/post/6844904152850497543)

4：[ReadTimeout和ConnectTimeout真的能解决http超时问题吗](https://segmentfault.com/a/1190000040235345)