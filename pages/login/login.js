const app = getApp()
const api = require('../../utils/api.js')

// packageA/pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 控制提示条的显示隐藏
    picHide: false,
    phone: ''
  },
  /* 
   * 手机号码输入框更改内容的时候同步data中的phone
   * @param string value 输入的值
   */
  changePhone (event) {
    let phone = event.detail.value
    this.setData({
      phone: phone
    })
  },
  /* 
   * 手机号码输入框聚焦的时候隐藏图片
   */
  picHidefocus () {
    this.setData({
      picHide: true
    })
  },
  /* 
   * 手机号码输入框失焦的时候显示图片（延迟1秒钟）
   */
  picHideBlue () {
    setTimeout(() => {
      this.setData({
        picHide: false
      })
    }, 1000)
  },
  /* 
   * 点击确定按钮登陆
   */
  loginFn () {
    let phone = this.data.phone
    let reg = /^1[34578]\d{9}$/g
    if (reg.test(phone)) {
      // 验证通过
      // 发请求验证在数据库是否存在
      app.fetch(api.host + '/users?phone=' + phone)
        .then(res => {
          // 判断这个接口是否返回了数据，如果返回就是存在，没返回就是没有这个手机号
          if (res.length > 0) {
            // 登陆成功
            wx.showToast({
              title: '登陆成功',
            })
            // 因为返回的res是数组
            res = res[0]
            // 将用户信息添加到全局数据
            app.globalData.userinfo = res
            // 写到缓存中
            wx.setStorage({
              key: "userinfo",
              data: JSON.stringify(res)
            })
            // 跳转到首页
            wx.switchTab({
              url: '/pages/index/index',
            })
          } else {
            // 数据库没有这个用户，注册
            let userObj = {
              // 手机号
              phone: phone,
              // 初始化所选地址
              select_site: {}
            }
            
            // 发送注册请求
            app.fetch(api.host + '/users', "post", userObj)
              .then(res => {
                // 将用户信息添加到全局数据
                app.globalData.userinfo = res
                // 注册成功后先将注册的用户信息存储到本地缓存中
                return new Promise(function (resolve, reject) {
                  wx.setStorage({
                    key: "userinfo",
                    data: JSON.stringify(res),
                    success () {
                      return resolve()
                    }
                  })
                })
              })
              .then(() => {
                // 显示注册成功并跳转到首页
                wx.showToast({
                  title: '注册成功',
                  icon: 'success',
                  duration: 2000,
                  mask: true,
                  success () {
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                  }
                })
              })
          }
        })
    }
  }
})