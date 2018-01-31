let api = require('../../utils/api.js')
let app = getApp()

Page({
  data: {
    bannar: [],
    computedCategories: []
  },
  onLoad () {
    let computedCategories = app.globalData.computedCategories
    this.setData({
      computedCategories: computedCategories
    })
    app.fetch(api.host + '/bannar')
      .then(res => {
        this.setData({
          bannar: res
        })
      })
  }
})
