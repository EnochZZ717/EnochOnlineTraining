const app = getApp()
const memberGroupService = require('../../../services/memberGroupService.js');

Page({
  data: {
    users: [],
    id: '',
    name: '',
    image: '',
    activeUser: ''
  },
  onLoad(option) {
    var self = this;
    this.setData({
      id: option.id,
      name: option.name,
      image: option.image
    });
    memberGroupService.getGroupMembers(option.id, self, () => {});

  },
  onReady: function () {

  },
  onCloseOperationContainer() {
    this.setData({
      activeUser: ''
    });
  },
  onRemoveUser(e) {
    var user = e.currentTarget.dataset['index'];
    var userInfo = wx.getStorageSync('userInfo');
    var self = this;
    if (user.userId == userInfo.id) {
      wx.showToast({
        title: '不能移除自己',
        icon: 'none'
      })
      return;
    } else {
      wx.showModal({
        title: '提示',
        content: '确定要移除该学员吗?',
        success(res) {
          if (res.confirm) {
            memberGroupService.removeGroupMember(user.userId, self.data.id, self);
          } else if (res.cancel) {}
        }
      })
    }
  },
  onShowOperation(e) {
    var user = e.currentTarget.dataset['index'];
    this.setData({
      activeUser: user
    });
  },
  onShow: function () {},
  showImage(obj) {
    var item = obj.currentTarget.dataset['index'];
    if (item.profileImagePath) {
      wx.previewImage({
        current: item.profileImagePath,
        urls: [item.profileImagePath]
      })
    }
  },
  onShareAppMessage: function () {
    var userInfo = wx.getStorageSync('userInfo');
    var timestamp = new Date();
    var expirationTime = timestamp.setDate(timestamp.getDate() + 3);
    let obj = {
      title: this.data.name,
      path: `/pages/memberGroup/joinGroup/joinGroup?id=${this.data.id}&sharedUserId=${userInfo?userInfo.id:null}&timestamp=${expirationTime}`,
      imageUrl: this.data.image
    };
    return obj;
  },

}, )