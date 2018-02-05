//app.js
let api = require('./utils/api.js')
App({
  onLaunch () {
    // 读取保存在本地的用户信息
    let userinfo = wx.getStorageSync('userinfo')
    if (userinfo) {
      // 如果userinfo不等于空,那么就提取里面的值
      userinfo = JSON.parse(userinfo)
      // 获取改用户的购物车数据
      this.getCart(userinfo.id)
        .then(res=>{
          this.globalData.carts = res
        })
    } else {
      // 没有读取到用户的登陆信息，自动跳转到login页面
      wx.redirectTo({
        url: 'pages/login/login'
      })
    } 
  },
  /* 
   * 获取该用户对应的购物车数据
   * @param   int   id    用户的id
   * @return  arr   carts 购物车数据
   */
  getCart (id) {
    return new Promise((resolve, reject) => {
      this.fetch(api.host + '/carts?userId=' + id)
        .then(res => {
          resolve(res)
        })
    })
  },
  /* 
   * 获取分类和商品数据
   * @param callback cb 回调函数,用于在获取到商品数据后执行内容
   */
  getComputedCategories (cb) {
    wx.showLoading({
      title: '加载商品数据中...',
      mask: true
    })
    let categories = []
    let products = []
    this.fetch(api.host + '/categories')
      .then(res => {
        categories = res
        return this.fetch(api.host + '/products')
      })
      .then(res => {
        products = res
        for (let i = 0; i < products.length; i++) {
          for (let j = 0; j < categories.length; j++) {
            // 找到商品相对应的分类
            if (categories[j].id === products[i].categoryId) {
              categories[j].products.push(products[i])
            }
          }
        }
        this.globalData.computedCategories = categories
        cb(categories)
        wx.hideLoading()
      })
  },
  /* 
   * 全局的数据
   */
  globalData: {
    // 保存的是合并后的商品数据
    computedCategories: [],
    // 购物车数据
    carts: []
  },
  /* 
   * 封装的请求方法
   * @param string method 请求的方法
   * @param object data   请求携带的数据
   */
  fetch(url, method = "GET", data = {},) {
    return new Promise(function (resolve, reject) {
      console.log(url)
      wx.request({
        url: url,
        data: data,
        method: method,
        success: res => {
          resolve(res.data)
        },
        fail: res => {
          reject('请求失败aa')
        }
      })
    })
  }
})