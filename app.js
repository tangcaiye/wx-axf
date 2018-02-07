//app.js
let api = require('./utils/api.js')
App({
  onLaunch () {
    // 读取保存在本地的用户信息
    let userinfo = wx.getStorageSync('userinfo')
    
    if (userinfo) {
      // 如果userinfo不等于空,那么就提取里面的值
      userinfo = JSON.parse(userinfo)
      // 获取改用户的购物车数据
      this.getCart(userinfo.id)
        .then(res=>{
          this.globalData.carts = res
        })
      // 添加到全局数据中
      this.globalData.userinfo = userinfo
      // 临时跳转代码，方便开发
      /* wx.redirectTo({
        url: 'packageA/pages/select-site/select-site'
      }) */
    } else {
      // 临时跳转代码，方便开发
      /* wx.redirectTo({
        url: 'packageA/pages/select-site/select-site'
      }) */
      // 没有读取到用户的登陆信息，自动跳转到login页面
      wx.redirectTo({
        url: 'pages/login/login'
      })
    } 
  },
  /* 
   * 添加到购物车
   * @param object product 商品对象
   * @return arr   computedCategories 同步后的商品列表
   */
  addCart(product) {
    return new Promise((resolve, reject) => {
      // 首先验证该商品在本地购物车中是否已经存在
      let localCarts = this.globalData.carts
      let userinfo = this.globalData.userinfo
      // 假设不存在，需要添加
      let addBol = true
      for (let i = 0; i < localCarts.length; i++) {
        if (localCarts[i].product_id === product.product_id) {
          // 找到了,存在
          addBol = false
          // 更新数量
          localCarts[i].num++
          this.fetch(api.host + '/carts/' + localCarts[i].id, 'PATCH', {
            num: localCarts[i].num
          })
            .then(res => {
              if (res.id > 0) {
                // 更新成功
                wx.showToast({
                  title: '更新成功',
                })
                this.resetProductNum(res)
                  .then(computedCategories => {
                    resolve(computedCategories)
                  })
              }
            })
          break
        }
      }
      // 不存在
      if (addBol) {
        // 不存在，需要添加,构造需要添加到购物车中的商品对象
        /* 
          数据结构
          {
            商品在购物中表的 id,
            商品的id product_id,
            用户id user_id,
            商品的数量,
            商品的图片,
            商品的名称,
            商品的价格,
            是否选择
          }
        */
        let productToCartObj = {
          product_id: product.product_id,
          userId: userinfo.id,
          product_img: product.imgs.min,
          product_name: product.name,
          product_price: product.price,
          checked: true,
          num: 1
        }
        // 添加到数据库中的购物车
        this.fetch(api.host + '/carts', 'POST', productToCartObj)
          .then(res => {
            if (res.id > 0) {
              localCarts.push(res)
              wx.showToast({
                title: '添加成功',
              })
              this.resetProductNum(res)
                .then(computedCategories => {
                  resolve(computedCategories)
                })
            }
          })
      }
    })
  },
  /* 
   * 减少商品
   * @param object product 商品对象
   */
  subCart(product) {
    return new Promise((resolve, reject) => {
      let carts = this.globalData.carts
      // 获取需要更改数量的购物对象
      let cartObj = {}
      // 购物车对象的下标
      let index = 0
      // 循环遍历提取该商品对应本地购物车中的商品对象
      for (let i = 0; i < carts.length; i++) {
        if (product.product_id === carts[i].product_id) {
          cartObj = carts[i]
          index = i
        }
      }
      if (cartObj.num > 1) {
        // 更改-》减少
        cartObj.num--
        this.fetch(api.host + '/carts/' + cartObj.id, 'PATCH', {
          num: cartObj.num
        })
          .then(res => {
            if (res.id > 0) {
              // 更新全局的购物车对象
              wx.showToast({
                title: '更新成功',
              })
              this.globalData.carts = carts
              return this.resetProductNum(cartObj)
            }
          })
          .then(res => {
            resolve()
          })
      } else {
        // 从本地和数据库中删除该商品
        this.fetch(api.host + '/carts/' + cartObj.id, 'DELETE')
          .then(res => {
            wx.showToast({
              title: '删除成功',
            })
            cartObj.num--
            return this.resetProductNum(cartObj)
          })
          .then(res => {
            // 从购物车列表中将对象移除掉
            carts.splice(index, 1)
            resolve()
          })
      }
    })
  },
  /* 
   * 重置本地商品的数量
   * @param   object  product 商品对象
   * @return  arr     computedCategories 同步后的商品列表
   */
  resetProductNum (product) {
    let computedCategories = this.globalData.computedCategories
    return new Promise((resolve, reject) => {
      label:
      for (let i = 0; i < computedCategories.length; i++) {
        let products = computedCategories[i].products
        for (let j = 0; j < products.length; j++) {
          if (products[j].id === product.product_id) {
            products[j].num = product.num
            break label
          }
        }
      }
      this.globalData.computedCategories = computedCategories
      resolve(computedCategories)
    })
  },
  /* 
   * 获取该用户对应的购物车数据
   * @param   int   id    用户的id
   * @return  arr   carts 购物车数据
   */
  getCart (id) {
    return new Promise((resolve, reject) => {
      this.fetch(api.host + '/carts?userId=' + id)
        .then(res => {
          // 将购物车数据添加到全局
          this.globalData.carts = res
          resolve(res)
        })
    })
  },
  /* 
   * 获取分类和商品数据
   * @param callback cb 回调函数,用于在获取到商品数据后执行内容
   */
  getComputedCategories (cb) {
    wx.showLoading({
      title: '加载商品数据中...',
      mask: true
    })
    let categories = []
    let products = []
    this.fetch(api.host + '/categories')
      .then(res => {
        categories = res
        return this.fetch(api.host + '/products')
      })
      .then(res => {
        products = res
        for (let i = 0; i < products.length; i++) {
          for (let j = 0; j < categories.length; j++) {
            // 找到商品相对应的分类
            if (categories[j].id === products[i].categoryId) {
              categories[j].products.push(products[i])
            }
          }
        }
        this.globalData.computedCategories = categories
        wx.hideLoading()
        // 获取购物车数据并同步
        return this.getCart(this.globalData.userinfo.id)
      })
      .then(data => {
        let computedCategories = this.globalData.computedCategories
        for (let i = 0; i < computedCategories.length; i++) {
          let products = computedCategories[i].products
          for (let j = 0; j < products.length; j++) {
            for (let z = 0; z < data.length; z++) {
              if (products[j].id === data[z].product_id) {
                products[j].num = data[z].num
                break
              }
            }
          }
        }
        cb(computedCategories)
      })
  },
  /* 
   * 全局的数据
   */
  globalData: {
    // 保存的是合并后的商品数据
    computedCategories: [],
    // 购物车数据
    carts: [],
    // 用户信息
    userinfo: {},
    // 所选城市
    selectedCity: '深圳市',
    // 所选地址
    selectedSite: ''
  },
  /* 
   * 封装的请求方法
   * @param string method 请求的方法
   * @param object data   请求携带的数据
   */
  fetch(url, method = "GET", data = {},) {
    return new Promise(function (resolve, reject) {
      console.log(url)
      wx.request({
        url: url,
        data: data,
        method: method,
        success: res => {
          resolve(res.data)
        },
        fail: res => {
          reject('请求失败aa')
        }
      })
    })
  }
})