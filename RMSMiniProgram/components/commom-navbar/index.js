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
      this.triggerEvent('backBefore', null);
      wx.navigateBack({
        delta: 1
      })
    },
    _toIndex: function () {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    },
  }
})