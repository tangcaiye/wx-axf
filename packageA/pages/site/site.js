let app = getApp()
let api = require('../../../utils/api.js')
// 地址列表页
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sites: [],
    userinfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userinfo = app.globalData.userinfo
    this.setData({
      userinfo: userinfo
    })
    // 获取该用户的地址列表
    app.fetch(api.host + '/users/' + userinfo.id + '/sites')
      .then(res => {
        app.globalData.sites = res
        this.setData({
          sites: res
        })
      })
  },
  onShow () {
    let sites = app.globalData.sites
    this.setData({
      sites: sites
    })
  },
  /* 
   * 点击新增地址跳转页面
   */
  addSite () {
    wx.navigateTo({
      url: '/packageA/pages/add-site/add-site',
    })
  },
  /* 
   * 更改所选的地址
   */
  changeSelectedSite (event) {
    let item = event.currentTarget.dataset.item
    // 将地址对象添加给用户
    app.fetch(api.host + '/users/' + this.data.userinfo.id, 'PATCH', {
      selectSite: item
    })
      .then(res => {
        app.globalData.userinfo = res
        this.setData({
          userinfo: res
        })
        wx.setStorage({
          key: "userinfo",
          data: JSON.stringify(res)
        })
      })
  }
})