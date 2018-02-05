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
  }
})
