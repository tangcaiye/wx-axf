//app.js
let api = require('./utils/api.js')
App({
  onLaunch () {
    
  },
  getComputedCategories (cb) {
    wx.showLoading({
      title: '加载中...',
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
  globalData: {
    // 保存的是合并后的商品数据
    computedCategories: []
  },
  fetch(url, method = "get", data = {},) {
    return new Promise(function (resolve, reject) {
      
      wx.request({
        url: url,
        data: data,
        method: method,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
          resolve(res.data)
        },
        fail: res => {
          reject('请求失败')
        }
      })
    })
  }
})