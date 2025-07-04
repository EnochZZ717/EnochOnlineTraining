const app = getApp()
const memberGroupService = require('../../services/memberGroupService.js');

Page({
  data: {
    groups: [],
    showOperationContainer: false,
    navHeight: 0
  },
  onLoad() {
    var self = this;
    memberGroupService.getMemberGroups(self);
    memberGroupService.getOperationContainer(self);
    wx.removeStorageSync('refreshGroup');

    this.setData({
      navHeight: app.globalData.navHeight
    })
  },
  onReady: function () {

  },
  showGroup(e) {
    var group = e.currentTarget.dataset['index'];
    wx.navigateTo({
      url: `./memberGroupDetails/memberGroupDetails?id=${group.memberGroupId}&isLeader=${group.isGroup}&name=${group.name.trim()}&image=${encodeURIComponent(group.imagePath)}`,
    })
  },
  editGroup() {
    wx.navigateTo({
      url: './editMemberGroup/editMemberGroup',
    })
  },
  addGroup() {
    wx.navigateTo({
      url: '/pages/addMemberGroup/addMemberGroup',
    })
  },
  onShow: function () {
    var needRefreshGroup = wx.getStorageSync('refreshGroup');
    if (needRefreshGroup) {
      memberGroupService.getMemberGroups(this);
      wx.removeStorageSync('refreshGroup');
    }
  }
})