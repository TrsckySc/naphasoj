# mock-data

#### 介绍

API 挡板接口管理工程,支持多后台工程多接口配置地址,真正实现前端接口联调时代码零修改.模拟数据采用json5编辑,妈妈再也不担心我写json了,如果你还不知道啥是json5,去问下度娘吧.添加可视化界面,可随时修改返回的数据,随时处理可能会发生的情况.再也不用担心漏下什么逻辑了,除非你漏了需求.

#### 软件架构

后端技术栈
nodejs、mongodb、express

前端技术栈
jquery、bootstrap、json5、ace、mockjs

#### 安装教程-本地版(需要自己本地安装mongodb数据库)

1. 先下载安装mongodb, [MongoDB官网下载链接](https://www.mongodb.com/download-center/community)
2. `git clone https://gitee.com/seebin/mock-data.git`
3. `cd mock-data`
4. `npm install`
5. 修改config.js文件里面的mongodb数据库链接地址，解开本地版链接地址  注释docker版链接地址
6. `npm start`
7. 浏览器访问`http://localhost:3004/mock`

#### 安装教程-Docker版(docker内部自动安装mongodb数据库)-默认

> 前提需要本地安装docker以及compose

1. `git clone https://gitee.com/seebin/mock-data.git`
2. `cd mock-data`
3. `npm install`
4. 执行以下命令:`docker-compose up -d`

#### 使用说明

1. 将前端工程的测试环境的ip地址改为:`127.0.0.1:3004`
2. 浏览器打开页面:`127.0.0.1:3004/mock` 来访问接口管理可视化页面
3. 试试添加一个接口,保存成功后默认开启mock功能,前端业务工程访问接口返回mock数据,关闭mock状态,则请求真实的接口
4. 愉快的使用起来吧!

#### docker 常用指令

 docker logs -f 7d6287d43144   查看容器日志

 docker container ls    查看docker容器列表

 docker ps              查看启动的容器列表

 docker restart 7d6287d43144      重启容器

 docker-compose up -d  启动docker-compose

 docker-compose stop   停止docker-compose

#### 参与贡献

作者:seebin

#### 相关链接

[Mac电脑安装mongodb教程](http://note.youdao.com/noteshare?id=ff4b17665bdab2022c67571b716c5be3)
