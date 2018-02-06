let api = require('../../utils/api.js')
let app = getApp()

Page({
  data: {
    bannar: [],
    computedCategories: []
  },
  onLoad () {
    let computedCategories = app.globalData.computedCategories
    if (computedCategories.length > 0) {
      this.setData({
        computedCategories: computedCategories
      })
    } else {
      app.getComputedCategories(computedCategories => {
        this.setData({
          computedCategories: computedCategories
        })
      })
    } 
    app.fetch(api.host + '/bannar')
      .then(res => {
        this.setData({
          bannar: res
        })
      })
  },
  /* 
   * 添加到购物车
   * @param object product 商品对象
   */
  addCart(event) {
    let product = event.currentTarget.dataset.product
    // 追加product_id(商品id)属性
    product.product_id = product.id
    app.addCart(product)
  }
})
