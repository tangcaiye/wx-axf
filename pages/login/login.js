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
          console.log(res)
          if (res.length > 0) {
            // 登陆成功
            // 提取该用户的购物车数据
            console.log('登陆成功')
          } else {
            // 数据库没有这个用户，注册
            let userObj = {
              // 手机号
              phone: phone,
              // 初始化所选地址
              select_site: {}
            }
            wx.request({
              url: 'http://course.io:3000/users/2',
              method: 'DELETE',
              success: res => {
                console.log(res.data)
              }
            })
            // app.fetch(api.host + '/users', "post", userObj)
            //   .then(res => {
            //     console.log(res)
            //   })
          }
        })
    }
  }
})