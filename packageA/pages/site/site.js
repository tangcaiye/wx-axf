// packageA/pages/site/site.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sites: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  /* 
   * 点击新增地址跳转页面
   */
  addSite () {
    wx.navigateTo({
      url: '/packageA/pages/add-site/add-site',
    })
  }
})