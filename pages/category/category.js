let app = getApp()

// pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 分类和商品数据
    computedCategories: [],
    // 激活的大分类, 保存的是分类的下标
    activeCategory: 0,
    // 激活的子分类, 保存的是子分类的名称
    activeCid: '全部分类',
    // 激活的子分类的下标,默认为all为全部分类
    activeCidIndex: 'all',
    // 控制全部分类列表显示隐藏的
    allCategories: false,
    // 综合排序的方式
    rankingList: ['综合排序', '价格最低', '价格最高'],
    // 激活的排序方式
    activeRanking: '综合排序',
    // 控制排序方式列表的显示隐藏
    ranking: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let computedCategories = app.globalData.computedCategories
    this.setData({
      computedCategories: computedCategories
    })
  },
  /* 
   * 切换分类的下标
   */
  changeCategories (event) {
    // 获取点击分类项的下标
    let index = event.currentTarget.dataset.index
    this.setData({
      activeCategory: index
    })
  },
  /* 
   * 显示隐藏全部分类
   */
  changeAllCategories () {
    let allCategories = this.data.allCategories
    // 切换全部分类的显示隐藏，同时将综合排序隐藏
    this.setData({
      allCategories: !allCategories,
      ranking: false
    })
  },
  /* 
   * 切换综合排序的显示隐藏
   */
  changeRanking () {
    let ranking = this.data.ranking
    this.setData({
      ranking: !ranking,
      allCategories: false
    })
  },
  /* 
   * 隐藏灰色蒙版
   */
  hideProductList () {
    this.setData({
      ranking: false,
      allCategories: false
    })
  }
})