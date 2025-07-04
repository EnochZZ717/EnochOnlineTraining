const app = getApp()
var memberGroupService = require('../../../services/memberGroupService.js');

Page({
  data: {
    navHeight: 0,
    groups: [],
    selectedGroup: [],
    isSelectAll: false,
    hasGroups: false
  },
  onLoad() {
    var self = this;
    this.setData({
      navHeight: app.globalData.navHeight
    });
    memberGroupService.getMemberGroups(self);
  },
  onSave() {
    var selectedGroup = this.data.selectedGroup;
    if (selectedGroup.length == 0) {
      wx.showToast({
        title: '请选择学习组',
        icon: 'none'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定要删除吗?',
        success(res) {
          if (res.confirm) {
            memberGroupService.deleteMemberGroups(selectedGroup, this);
          }
        }
      })
    }
  },
  selectAll() {
    var groups = this.data.groups;
    var selectedGroup = [];
    var selectAll = this.data.isSelectAll;

    if (selectAll) {
      selectedGroup = [];
      selectAll = false;
    } else {
      selectAll = true;
      groups.forEach(x => {
        selectedGroup.push(x.memberGroupId);
      });
    }

    this.setData({
      selectedGroup: selectedGroup,
      isSelectAll: selectAll
    });
  },
  selectGroup(e) {
    var selectedGroup = this.data.selectedGroup;
    var group = e.currentTarget.dataset['index'];
    if (selectedGroup.indexOf(group.memberGroupId) != -1) {
      var index = selectedGroup.indexOf(group.memberGroupId);
      selectedGroup.splice(index, 1);
    } else {
      selectedGroup.push(group.memberGroupId);
    }
    var isSelectAll = false;
    if (selectedGroup.length == this.data.groups.length) {
      isSelectAll = true;
    }
    this.setData({
      selectedGroup: selectedGroup,
      isSelectAll: isSelectAll
    });
  },
  onCancel() {
    wx.navigateBack({
      delta: 1,
    })
  },
  onReady: function () {

  },
  onShow: function () {

  }
})