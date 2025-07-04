const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  externalClasses: ['custom-class'],
  properties: {
    pageName: String,
    showNav: {
      type: Boolean,
      value: true
    },
    bgColor: {
      type: String,
      value: '#fff'
    },
    iconColor: {
      type: String,
      value: '#000'
    },
    isDisplay: {
      type: String,
      value: 'block'
    }
  },

  data: {

  },
  lifetimes: {
    attached: function () {
      this.setData({
        navHeight: app.globalData.navHeight,
        navTop: app.globalData.navTop
      })
    }
  },
  methods: {
    _navBack: function () {
      wx.navigateBack({
        delta: 1
      })
    },
    _toIndex: function () {
      wx.switchTab({
        url: '/pages/tabBar/index/index'
      })
    },
  }
})