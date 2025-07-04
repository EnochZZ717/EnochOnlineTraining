const app = getApp()
var userService = require('../../services/userService.js');

Page({
  data: {
    collections: [],
    canceledCollections: [],
    isEmpty:false
  },
  onLoad() {
    userService.loadUserCollections(this);
  },
  onReady: function () {

  },
  onShow: function () {},
  onRemoveCollection(e) {
    var course = e.currentTarget.dataset['index'];
    var courses = this.data.collections;
    var self = this;
    var canceledCollections = this.data.canceledCollections;
    var data = {
      "courseId": course.courseId
    };

    if (course.remove != undefined) {
      if (course.remove) {
        userService.putCollection(data, self)
        course.remove = false;
      } else {
        userService.deleteCollection(data, self)
        course.remove = true;
      }
    } else {
      if (course.isCancel) {
        userService.putCollection(data, self)
        course.remove = false;
      } else {
        userService.deleteCollection(data, self)
        course.remove = true;
      }
    }

    for (var i = 0; i < courses.length; i++) {
      if (courses[i].courseId == course.courseId) {
        courses[i] = course;
      }
    }

    if (canceledCollections.indexOf(course.courseId) != -1) {
      var index = canceledCollections.indexOf(course.courseId);
      canceledCollections.splice(index, 1);
    } else {
      canceledCollections.push(course.courseId);
    }

    this.setData({
      canceledCollections: canceledCollections,
      collections: courses
    });
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