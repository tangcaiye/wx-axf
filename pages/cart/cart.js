// pages/cart/cart.js
let times = []
let dayList = ['今天', '明天', '后天']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [],
    multiIndex: [0, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当前的小时数
    let hour = new Date().getHours()
    // 判断是否可以30分钟内送货
    let thirtyBol = true
    // 如果在凌晨9点以前，那么就安排在9点开始送货
    if (hour < 9) {
      hour = 8
      thirtyBol = false
    } else if (hour >= 23) {// 如果在23点以后，就到明天9点开始送货
      hour = 8
      dayList = ['明天', '后天']
    }
    // 根据天数(dayList)生成配送的时间数组
    for (let i = 0; i < dayList.length; i++) {
      let start = 8
      let dayTimes = []
      // 第一天的开始时间是从当前时间开始的
      if (i === 0) {
        start = hour
      }
      if (i === 0 && dayList[i] === '今天' && thirtyBol) {
        dayTimes.push('30分钟送达')
      }
      let len = 23 - start
      for (let j = 0; j < len; j++) {
        let time = `${start + j + 1}:00-${start + j + 2}:00`
        dayTimes.push(time)
      }
      times.push(dayTimes)
    }
    let multiArray = [dayList, times[0]]
    this.setData({
      multiArray: multiArray
    })
  },
  /* 
   * 根据选择的天数返回时间列表
   */
  changeTimes (event) {
    let detail = event.detail
    let nowTimes = []
    // 如果是更改的第一列(天数)，就根据更改的下标返回对应的时间列表
    if (detail.column === 0) {
      nowTimes = times[detail.value]
      let multiArray = [dayList, nowTimes]
      this.setData({
        multiArray: multiArray
      })
    }
    
    let multiIndex = this.data.multiIndex
    // 根据更改的列数来修改picker的value值
    if (detail.column === 0) {
      multiIndex = [detail.value, multiIndex[1]]
    } else if (detail.column === 1) {
      multiIndex = [multiIndex[0], detail.value]
    }
    this.setData({
      multiIndex: multiIndex
    })
  }
})