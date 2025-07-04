const app = getApp()
var userService = require('../../services/userService.js');

Page({
  data: {
    courses: [''],
  },
  onLoad() {
    var self = this;
    userService.loadUserCourseHistory(self);
  },
  onReady: function () {

  },
  onShow: function () {

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