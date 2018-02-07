let app = getApp()
let api = require('../../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    citys: [],
    selectedCityIndex: 0,
    // 所选地址
    selectedSite: '',
    // 所选城市
    selectedCity: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取支持的城市列表
    app.fetch(api.host + '/citys')
      .then(res => {
        let citys = []
        for (let i = 0; i < res.length; i++) {
          citys.push(res[i].city)
        }
        this.setData({
          citys: citys
        })
      })
  },
  changeSelectedCityIndex (event) {
    let index = event.detail.value
    app.selectedCity = this.data.citys[index]
    this.setData({
      selectedCityIndex: index
    })
  },
  /* 
   * 选择地区，跳转到选择地区页面
   */
  selectSite () {
    wx.navigateTo({
      url: '/packageA/pages/select-site/select-site'
    })
  }
})