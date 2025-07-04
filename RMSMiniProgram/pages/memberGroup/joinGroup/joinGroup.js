const app = getApp()
var memberGroupService = require('../../../services/memberGroupService.js');
var authenticationService = require('../../../services/authenticationService.js');
Page({
  data: {
    id: '',
    message: '',
    showContainer: false,
    status: '',
    showRegisterModal: false,
  },
  onLoad(option) {
    var self = this;
    this.setData({
      id: option.id
    });

    var timestamp = option.timestamp;
    var currentTime = Date.now();

    if (currentTime > timestamp) {
      this.setData({
        message: '链接已失效',
        showContainer: true,
        status: '-2'
      });
      return;
    }

    wx.setStorageSync('groupId', option.id);
    wx.setStorageSync('sharedUserId', option.sharedUserId);
    authenticationService.checkUserLoginStatus(self, (token) => {
      if (self.data.showRegisterModal) {
        wx.redirectTo({
          url: '/pages/register/register',
        })
      } else {
        memberGroupService.joinGroup(option.id, this, option.sharedUserId);
      }
    });
  },
  onReady: function () {

  },
  onShow: function () {},
  goMemberGroup() {
    if (this.data.status == '-2') {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    } else {
      wx.redirectTo({
        url: '/pages/memberGroup/memberGroup',
      })
    }
  },
})