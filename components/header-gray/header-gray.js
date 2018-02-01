// components/header-gray/header-gray.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    headerTitle: {
      type: String
    },
    back: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goBack () {
      wx.navigateBack({
        delta: 1
      })
    }
  }
})
