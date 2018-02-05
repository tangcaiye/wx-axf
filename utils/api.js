let api = {
  /* 
   * 远程调试的时候换成自己电脑的ip.
   * 手机跟电脑需在同一个局域网下
   * 手机必须通过数据线连接电脑
   * 保证已经启动了db(json-server)服务器
   * db(json-server)不能放在项目目录下，会导致开发工具自动刷新
   */
  host: 'http://127.0.0.1:3000'
}
module.exports = api