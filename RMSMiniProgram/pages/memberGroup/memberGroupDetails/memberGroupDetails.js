const app = getApp()
const memberGroupService = require('../../../services/memberGroupService.js');

Page({
  data: {
    id: '',
    name: '',
    image: '',
    isLeader: false,
    courses: [],
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
  onLoad(option) {
    var self = this;
    this.setData({
      id: option.id,
      name: option.name.trim(),
      image: option.image,
      isLeader: option.isLeader
    });

    if (option.isLeader == 'false') {
      wx.hideShareMenu({
        menus: ['shareAppMessage', 'shareTimeline']
      })
    }

    memberGroupService.getGroupStatus(option.id, self);
    wx.removeStorageSync('refreshCourse');
  },
  editGroup() {
    wx.navigateTo({
      url: `../../addMemberGroup/updateGroup/updateGroup?id=${this.data.id}&name=${this.data.name}`,
    })
  },
  getUsers() {
    wx.navigateTo({
      url: `../groupMembers/groupMembers?id=${this.data.id}&name=${this.data.name}&image=${this.data.image}`,
    })
  },
  onReady: function () {

  },
  onShow: function () {
    var refresh = wx.getStorageSync('refreshCourse');
    if (refresh) {
      memberGroupService.getGroupStatus(this.data.id, this);
    }
  },
  onShowCourse: function (e) {
    var course = e.currentTarget.dataset['index'];
    if (course.categoryRootName == "云课堂") {
      wx.navigateTo({
        url: '/pages/courseDetails/courseDetails?id=' + course.courseId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/operationCourseDetails/operationCourseDetails?id=' + course.courseId,
      })
    }
  }
})