const app = getApp()
var commonService = require('../../services/commonService.js');

Page({
  data: {
    videos: []
  },
  onLoad() {
    var self = this;
    commonService.getSnGuide(self);
  },
  onReady: function () {

  },
  onShow: function () {

  },
  videoErrorCallback: function (params) {
    console.log(params);
    wx.showToast({
      title: '视频加载出错',
      icon: 'error',
      duration: 3000
    })
  },
})