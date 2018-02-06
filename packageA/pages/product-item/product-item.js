// packageA/pages/product-item/product-item.js
let app = getApp()
let api = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    // 获取全局的商品数据
    let computedCategories = app.globalData.computedCategories
    if (computedCategories.length > 0) {// 如果已经获取到了
      
      label:
      for (let i = 0; i < computedCategories.length; i++) {
        let products = computedCategories[i].products
        for (let j = 0; j < products.length; j++) {
          if (products[j].id === id) {
            console.log(products[j])
            this.setData({
              productInfo: products[j]
            })
            break label
          }
        }
      }
    } else {
      // 没有获取到的话，直接走请求获取
      app.fetch(api.host + '/products/' + id)
        .then(res => {
          this.setData({
            productInfo: res
          })
        })
    }
  }
})