# SNAKE-API mini

#### 界面

![snake-api-mini-page](http://qiniu.seebin.com/snake-api-mini-page.png)

#### 介绍

基于反向代理的过滤式接口小型Mock管理工程，真正实现前端开发接口mock时代工程代码开发零修改。采用MongoDB将Mock数据持久化，可视化编辑界面，远离修改JSON文件。可随时修改返回的数据,随时处理可能会发生的情况.再也不用担心漏下什么逻辑了,除非你漏了需求.

什么？测试环境在发版，接口又不能用了？  
不用担心，开启Mock接口，继续干!

#### 特点

+ 基于反向代理，mock请求返回mock数据，非mock请求返回真实数据
+ 可单个Mock接口开启Mock状态，关闭Mock状态则请求服务器真实数据
+ JSON5编辑器，JSON数据结构增强，支持添加注释，支持key无需引号包裹等强大特性
+ 可选择性导入swagger接口数据，导入用到的单个接口，而非所有的swagger数据
+ 新建接口支持多服务器多接口前缀配置
+ 采用MockJS自动生成Mock数据
+ 一键清空非锁定状态下的所有Mock接口，准备开启下个需求的Mock模拟，防止无用的Mock接口迷惑自己
+ ...

#### 软件架构

后端技术栈  
nodejs、mongodb、express...

前端技术栈  
react、react-router、redux...

#### 使用教程-Docker版(docker内部自动安装mongodb数据库)-默认方式

> 前提需要本地安装docker以及compose(Docker-Desktop会默认安装), [Docker-Desktop官网下载地址](https://www.docker.com/products/docker-desktop)

1. `git clone https://gitee.com/seebin/snake-api-mini.git`
2. `cd snake-api-mini`
3. `npm install`
4. 执行以下命令:`docker-compose up -d`
5. 浏览器访问`http://localhost:3004/mock` 来管理mock接口

#### 使用教程-本地版(需要自己本地安装mongodb数据库)

1. 先下载安装mongodb, [MongoDB官网下载链接](https://www.mongodb.com/download-center/community)
2. `git clone https://gitee.com/seebin/snake-api-mini.git`
3. `cd snake-api-mini`
4. `npm install`
5. 修改config.js文件里面的mongodb数据库链接地址，解开本地版链接地址  注释docker版链接地址
6. `npm start`
7. 浏览器访问`http://localhost:3004/mock` 来管理mock接口

#### 使用说明

1. 第一次访问`http://localhost:3004/mock`会引导你进入项目配置页面，设置反向代理地址等配置
2. 将现有项目工程的接口服务地址ip换为`127.0.0.1:3004`
3. 浏览器打开页面:`127.0.0.1:3004/mock` 添加一个接口
4. 启动现有项目调用刚刚添加的接口地址，这时返回的数据为添加接口的mock数据
5. 将刚刚添加的接口mock状态置为停用状态，再次调用该接口 这时数据返回的是代理地址返回的真实数据

#### docker 常用指令

service docker start      启动docker(linux系统)

service docker stop      停止docker(linux系统)

 docker logs -f 7d6287d43144   查看容器日志

 docker container ls    查看docker容器列表

 docker ps              查看启动的容器列表

 docker restart 7d6287d43144      重启容器

 docker-compose up -d  启动docker-compose

 docker-compose stop   停止docker-compose

#### 参与贡献

作者:seebin

#### 交流谈论

钉钉交流群：

![dingding](http://qiniu.seebin.com/sanke-api-dingding-qrocode.jpg)

#### 相关链接

[Mac电脑本地安装MongoDB服务教程](http://note.youdao.com/noteshare?id=ff4b17665bdab2022c67571b716c5be3)

[Window电脑本地安装MongoDB服务教程](http://note.youdao.com/noteshare?id=ae30a3d8b9ad2b8fdd81f2ae39834490)

[Ant-Design 国内镜像地址](https://ant-design.gitee.io/components/button-cn/)