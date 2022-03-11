# SNAKE-API mini

## UI 2.0 新版本来了!!

### 界面

![snake-api-mini-home](https://qiniu.seebin.com/snake-api-home-tab.png)

### 介绍

基于反向代理的过滤式接口小型Mock管理工程，真正实现前端开发接口mock时代工程代码开发零修改。采用MongoDB将Mock数据持久化，可视化编辑界面，远离修改JSON文件。可随时修改返回的数据,随时处理可能会发生的情况.再也不用担心漏下什么逻辑了,除非你漏了需求.

什么？测试环境在发版，接口又不能用了？  
不用担心，开启Mock接口，继续干!

### 特点

+ 基于反向代理，mock请求返回mock数据，非mock请求返回真实数据
+ 可单个Mock接口开启Mock状态，关闭Mock状态则请求服务器真实数据
+ JSON5编辑器，JSON数据结构增强，支持添加注释，支持key无需引号包裹等强大特性
+ 可选择性导入swagger接口数据，导入用到的单个接口，而非所有的swagger数据
+ 新建接口支持多服务器多接口前缀配置
+ 采用MockJS自动生成Mock数据
+ 一键清空非锁定状态下的所有Mock接口，准备开启下个需求的Mock模拟，防止无用的Mock接口迷惑自己
+ ...

### 软件架构

后端技术栈  
nodejs、mongodb、express...

前端技术栈  
react、react-router、redux...

### 使用教程-Docker版(docker内部自动安装mongodb数据库)-默认方式

> 前提需要本地安装docker以及compose(Docker-Desktop会默认安装), [Docker-Desktop官网下载地址](https://www.docker.com/products/docker-desktop)

1. `git clone https://gitee.com/seebin/snake-api-mini.git`
2. `cd snake-api-mini`
3. `npm install`
4. 执行以下命令:`docker-compose up -d`
5. 浏览器访问`http://localhost:3004/mock` 来管理mock接口

### 使用教程-本地版(需要自己本地安装mongodb数据库)

> 先下载安装mongodb, [MongoDB官网下载链接](https://www.mongodb.com/download-center/community)

1. `git clone https://gitee.com/seebin/snake-api-mini.git`
2. `cd snake-api-mini`
3. `npm install`
4. 修改config.js文件里面的mongodb数据库链接地址，解开本地版链接地址  注释docker版链接地址
5. `npm start`
6. 浏览器访问`http://localhost:3004/mock` 来管理mock接口

### 使用说明

1. 第一次访问`http://localhost:3004/mock`会引导你进入项目配置页面，设置反向代理地址等配置
2. 将现有项目工程的接口服务地址ip换为`127.0.0.1:3004`
3. 浏览器打开页面:`127.0.0.1:3004/mock` 添加一个接口
4. 启动现有项目调用刚刚添加的接口地址，这时返回的数据为添加接口的mock数据
5. 将刚刚添加的接口mock状态置为停用状态，再次调用该接口 这时数据返回的是代理地址返回的真实数据

### 为什么不用json
太繁琐，建这个的目的就是减少繁琐的流程，json的层层结构，反而增加了工作量，用json，难道swagger不香吗？  
这个的目的是保证前端开发的顺利畅通，而不是把后端功能的一部分在这给补充上  
再说下json5格式，不要太香，虽然在结构上没有json严格，而且有可能会出现结构性问题，但是，数据改起来，不要太简单，一眼望去，所有字段尽收眼底，随便改！  
程序的目的就是让复杂的东西简单化。

### 解决什么问题

基于反向代理，是在前台与服务器之间架上一层过滤网，需要mock的接口才mock，而不是把所有的接口都mock，调用真实接口  
再已经存在的页面上继续新加接口，原页面接口仍然走真实环境，数据更真实，页面就像没有mock一样，一部分接口也确实没有mock  
由于是在前台与服务器之间的处理，前台代码真正做到了零改动，开发起来：一切接口都是真的，开发流程也都是真的，你没有在mock接口  

### docker 常用指令

service docker start      启动docker(linux系统)

service docker stop      停止docker(linux系统)

 docker logs -f 7d6287d43144   查看容器日志

 docker container ls    查看docker容器列表

 docker ps              查看启动的容器列表

 docker restart 7d6287d43144      重启容器

 docker-compose up -d  启动docker-compose

 docker-compose stop   停止docker-compose

### 参与贡献

作者:seebin

### 交流谈论

钉钉交流群:21958681

### 相关链接

[Mac电脑本地安装MongoDB服务教程](http://note.youdao.com/noteshare?id=ff4b17665bdab2022c67571b716c5be3)

[Window电脑本地安装MongoDB服务教程](http://note.youdao.com/noteshare?id=ae30a3d8b9ad2b8fdd81f2ae39834490)

[Ant-Design 国内镜像地址](https://ant-design.gitee.io/components/button-cn/)

[Window 10系统Docker启动： SNAKE-API mini 项目接口管理地址无法访问的问题](http://note.youdao.com/noteshare?id=33ee27ee8a5412322e5ce1981ceaa556&sub=5B4F928C0D7E4A2C853571B600B5B329)