# wx-axf
微信小程序版爱鲜蜂

运行项目，需要启动db,[https://github.com/tangcaiye/db](https://github.com/tangcaiye/db)终端进入`db`目录，通过`npm install`安装依赖后键入`npm run db`启动`json-server`服务器，小程序才可以获取到数据

ps:不要讲`db`文件夹放到小程序的开发目录下，会导致小程序开发工具自动刷新.或者可以通过配置 project.config.json 的 miniprogram 字段，指定小程序的运行目录

微信开发者工具需要勾选不校验安全域名、`web-view域名`、`TLS`版本以及`HTTPS`证书