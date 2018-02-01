// pages/category/category.js
let app = getApp()

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
    ranking: false,
    // 激活的分类数据
    activeCategoryProducts: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let computedCategories = app.globalData.computedCategories
    this.setData({
      computedCategories: computedCategories
    })
    this.changeActiveCategoryProducts()
  },
  /* 
   * 切换分类的下标
   */
  changeCategories (event) {
    // 获取点击分类项的下标
    let index = event.currentTarget.dataset.index
    this.setData({
      activeCategory: index,
      activeCid: '全部分类',
      activeRanking: '综合排序',
      ranking: false,
      allCategories: false
    })
    this.changeActiveCategoryProducts()
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
  },
  /* 
   * 更改激活的子分类
   * @param string cidname   子分类的名称
   * @param int    index  子分类的下标
   */
  changeCid (event) {
    let cidname = event.currentTarget.dataset.cidname
    let index = event.currentTarget.dataset.index
    
    this.setData({
      activeCid: cidname,
      activeCidIndex: index
    })
    this.changeActiveCategoryProducts()
  },
  /* 
   * 更改排序方式
   * @param string item   排序的方式
   */
  changeActiveRanking (event) {
    let item = event.currentTarget.dataset.item

    this.setData({
      activeRanking: item
    })
    this.changeActiveCategoryProducts()
  },
  /* 
   * 更改激活的分类数据
   */
  changeActiveCategoryProducts () {
    // 激活的分类下标
    let activeCategory = this.data.activeCategory
    // 所有的商品数据
    let computedCategories = this.data.computedCategories
    // 根据激活的分类下标返回激活分类对应商品数据
    let activeCategoryProducts = computedCategories[activeCategory].products
    // 根据全部分类的值进行过滤(值为all不过滤)
    // 激活的子分类下标
    let activeCidIndex = this.data.activeCidIndex
    if (activeCidIndex !== 'all') {
      activeCategoryProducts = activeCategoryProducts.filter(item => item.cidsIndex === Number(activeCidIndex))
    }
    
    // 根据激活的排序方式进行排序
    let activeRanking = this.data.activeRanking
    // 克隆对象,防止对原数组对象造成影响
    let cloneActiveCategoryProducts = activeCategoryProducts.slice(0)
    if (activeRanking === '价格最低') {
      activeCategoryProducts = cloneActiveCategoryProducts.sort((a, b) => a.price - b.price)
    } else if (activeRanking === '价格最高') {
      activeCategoryProducts = cloneActiveCategoryProducts.sort((a, b) => b.price - a.price)
    }
    
    this.setData({
      activeCategoryProducts: activeCategoryProducts
    })
  }
})