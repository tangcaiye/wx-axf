var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js')

let app = getApp()
let api = require('../../../utils/api.js')
// 城市列表
let citys = []
// 地图的关键字
let key = ''
let qqmapsdk
Page({
  data: {
    markers: [],
    // 纬度
    latitude: '',
    // 经度
    longitude: '',
    // 搜索的结果
    rgcData: {}
  },
  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'JQFBZ-Y7Q34-EWXU4-XUFDK-RGPPJ-OHFNE'
    })
    let selectedCity = app.globalData.selectedCity
    let selectedSite = app.globalData.selectedSite
    // 首先判断是否选择了地址
    if (selectedSite === '') {
      // 没有地址,就用该城市对应的默认地址
      // 读取城市列表
      app.fetch(api.host + '/citys')
        .then(res => {
          citys = res
          for (let i = 0; i < citys.length; i++) {
            if (citys[i].city === selectedCity) {
              let key = citys[i].name
              let latitude = citys[i].y
              let longitude = citys[i].x
              let markers = [{
                id: '1',
                latitude: latitude,
                longitude: longitude,
                title: key,
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
        })
    }
  },
  onShow () {
    // 调用接口
    qqmapsdk.getSuggestion({
      keyword: '灵芝',
      region: '深圳市',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  }
})