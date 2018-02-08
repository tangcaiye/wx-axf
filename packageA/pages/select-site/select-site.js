var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js')

let app = getApp()
let api = require('../../../utils/api.js')
let util = require('../../../utils/util.js')
// 城市列表
let citys = []
// 所选的城市
let selectedCity = ''
// 所选的地址
let selectedSite = ''
// 腾讯地图sdk
let qqmapsdk
Page({
  data: {
    markers: [],
    // 纬度
    latitude: '',
    // 经度
    longitude: '',
    // 通过所选地址搜索的结果
    rgcData: [],
    // 通过文本输入框内容搜索的结果
    searchResults: []
  },
  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'JQFBZ-Y7Q34-EWXU4-XUFDK-RGPPJ-OHFNE'
    })
    selectedCity = app.globalData.selectedSite.city
    selectedSite = app.globalData.selectedSite.site
  },
  onShow () {
    app.globalData.selectSiteBol = true
    // 读取城市列表
    this.getCitys()
      .then(() => {
        this.initSiteList()
      })
  },
  /* 
   * 切换选择的地址
   * @param object item 地址对象
   */
  addSite (event) {
    let item = event.currentTarget.dataset.item
    // 更改全局属性


  },
  /* 
   * 地址输入框键入内容的处理
   * util.debounce限制触发的频率(防抖)
   */
  searchSite: util.debounce(700, function (event) {
    let val = event.detail.value
    this.getSug(val)
      .then(res => {
        console.log(res)
        this.setData({
          searchResults: res.data
        })
      }) 
  }),
  /* 
   * 初始化根据所选的关键字显示地址列表
   */
  initSiteList () {
    this.getSug(selectedSite)
      .then(res => {
        this.setData({
          rgcData: res.data
        })
      })
  },
  /* 
   * 调用关键字获取位置列表的接口
   */
  getSug (keyword) {
    return new Promise((resolve, reject) => {
      // 调用接口
      qqmapsdk.getSuggestion({
        keyword: keyword,
        region: selectedCity,
        success: function (res) {
          resolve(res)
        },
        fail: function (res) {
          reject(res)
        }
      })
    })
  },
  /* 
   * 获取城市列表
   */
  getCitys () {
    return new Promise((resolve, reject) => {
      app.fetch(api.host + '/citys')
        .then(res => {
          citys = res
          for (let i = 0; i < citys.length; i++) {
            if (citys[i].city === selectedCity) {
              selectedSite = citys[i].name
              let latitude = citys[i].y
              let longitude = citys[i].x
              let markers = [{
                id: '1',
                latitude: latitude,
                longitude: longitude,
                title: selectedSite,
                iconPath: '/images/marker_red.png'
              }]
              this.setData({
                markers: markers,
                latitude: latitude,
                longitude: longitude
              })
              
              break
            }
          }
          resolve()
        })
    })
  }
})