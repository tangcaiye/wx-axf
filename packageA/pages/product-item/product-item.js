// packageA/pages/product-item/product-item.js
let app = getApp()
let api = require('../../../utils/api.js')
let id = 0
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
    id = options.id
  },
  onShow () {
    // 获取全局的商品数据
    this.getComputedCategories()
  },
  /* 
   * 获取全局的商品数据
   */
  getComputedCategories () {
    let computedCategories = app.globalData.computedCategories
    if (computedCategories.length > 0) {// 如果已经获取到了

      label:
      for (let i = 0; i < computedCategories.length; i++) {
        let products = computedCategories[i].products
        for (let j = 0; j < products.length; j++) {
          if (products[j].id === Number(id)) {
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
  },
  /* 
   * 减少商品
   */
  subCart (event) {
    let product = this.data.productInfo
    // 追加product_id(商品id)属性
    product.product_id = product.id
    app.subCart(product)
      .then(res => {
        this.getComputedCategories()
      })
  },
  /* 
   * 添加商品
   */
  addCart (event) {
    let product = this.data.productInfo
    // 追加product_id(商品id)属性
    product.product_id = product.id
    app.addCart(product)
      .then(res => {
        this.getComputedCategories()
      })
  }
})