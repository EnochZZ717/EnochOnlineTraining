const app = getApp()
var commonService = require('../../services/commonService.js');

Page({
  data: {
    userInfo: null,
    refreshView: null
  },
  onLoad() {
    commonService.getAreas(this);
    var refreshView = this.selectComponent("#refreshView");
    this.setData({
      refreshView: refreshView
    });
  },
  onReady: function () {

  },
  showImage() {
    if (this.data.userInfo.profileImagePath) {
      wx.previewImage({
        current: this.data.userInfo.profileImagePath,
        urls: [this.data.userInfo.profileImagePath]
      })
    }
  },
  goUserDetail() {
    wx.navigateTo({
      url: '/pages/account/userDetail/userDetail',
    })
  },
  onShow: function () {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    });
  }
})