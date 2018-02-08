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
    linkman: '',
    sex: 0,
    phone: '',
    detailSite: ''
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
          citys: citys,
          selectedCityIndex: citys.indexOf(app.globalData.selectedSite.city)
        })
      })
  },
  /* 
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // 判断如果是从select-site页面过来的就不用重置全局的selectedSite
    if (app.globalData.selectSiteBol) {
      // 是从select-site页面过来的
      app.globalData.selectSiteBol = false
    } else {
      // 重置
      app.globalData.selectedSite = {
        city: '北京市',
        site: '天安门',
        longitude: 116.397390,
        latitude: 39.908860,
        linkman: '',
        sex: 0,
        phone: '',
        detailSite: ''
      }
    }
    let selectedSite = app.globalData.selectedSite
    
    // 设置
    this.setData({
      selectedCityIndex: this.data.citys.indexOf(selectedSite.city),
      // 所选地址
      selectedSite: selectedSite.site,
      linkman: selectedSite.linkman,
      sex: selectedSite.sex,
      phone: selectedSite.phone,
      detailSite: selectedSite.detailSite
    })
  },
  /* 
   * 切换选择的城市下标
   */
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
    // 将当前输入的内容临时存储到全局selectedSite中，这样在选择地区后回来数据还在
    let selectedSite = app.globalData.selectedSite
    app.globalData.selectedSite = {
      linkman: this.data.linkman,
      sex: this.data.sex,
      phone: this.data.phone,
      detailSite: this.data.detailSite,
      city: selectedSite.city,
      site: selectedSite.site,
      longitude: selectedSite.longitude,
      latitude: selectedSite.latitude,
    }
    wx.navigateTo({
      url: '/packageA/pages/select-site/select-site'
    })
  },
  /* 
   * 添加对input对data数据的更新
   */
  changeLinkman (event) {
    let val = event.detail.value
    this.setData({
      linkman: val
    })
  },
  changeSex (event) {
    let sex = event.currentTarget.dataset.sex
    this.setData({
      sex: Number(sex)
    })
  },
  changePhone (event) {
    let val = event.detail.value
    this.setData({
      phone: val
    })
  },
  changeDetailSite (event) {
    let val = event.detail.value
    this.setData({
      detailSite: val
    })
  }
})