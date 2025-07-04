const app = getApp()

Page({
  data: {
    activeNames: ['1'],
  },
  onLoad() {

  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  onReady: function () {

  },
  onShow: function () {

  }
})