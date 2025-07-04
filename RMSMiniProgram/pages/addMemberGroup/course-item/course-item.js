const app = getApp()
var memberGroupService = require('../../../services/memberGroupService.js');

Page({
  data: {
    navHeight: 0,
    courses: [],
    selectedCourse: [],
    isSelectAll: false
  },
  onLoad() {
    var self = this;
    this.setData({
      navHeight: app.globalData.navHeight
    });
    memberGroupService.getGroupCourses(self);
    var selctedCourse = wx.getStorageSync('selectedCourse');
    if (selctedCourse) {
      this.setData({ 
        selectedCourse: selctedCourse.map(x => x.id)
      });
    }
  },
  onSave() {
    var selectedCourse = this.data.selectedCourse;
    var courses = this.data.courses;
    var newCourse = [];
    if (selectedCourse.length == 0) {
      wx.showToast({
        title: '请选择课程',
        icon: 'none'
      })
    } else {
      selectedCourse.forEach(x => {
        var course = courses.find(c => c.id == x);
        course.dragId = x;
        course.fixed = false;
        newCourse.push(course);
      });
      wx.setStorageSync('selectedCourse', newCourse);
      wx.navigateBack({
        delta: 1,
      });
    }
  },
  selectCourse(e) {
    var selectedCourse = this.data.selectedCourse;
    var course = e.currentTarget.dataset['index'];
    if (selectedCourse.indexOf(course.id) != -1) {
      var index = selectedCourse.indexOf(course.id);
      selectedCourse.splice(index, 1);
    } else {
      selectedCourse.push(course.id);
    }

    var isSelectAll = false;
    if (selectedCourse.length == this.data.courses.length) {
      isSelectAll = true;
    }

    this.setData({
      selectedCourse: selectedCourse,
      isSelectAll: isSelectAll
    });
  },
  selectAll() {
    var courses = this.data.courses;
    var selectedCourses = [];
    var selectAll = this.data.isSelectAll;

    if (selectAll) {
      selectedCourses = [];
      selectAll = false;
    } else {
      selectAll = true;
      courses.forEach(x => {
        selectedCourses.push(x.id);
      });
    }

    this.setData({
      selectedCourse: selectedCourses,
      isSelectAll: selectAll
    });
  },
  detail(e) {
    var course = e.currentTarget.dataset['index'];
    if (course.categoryRootName == "培训课程") {
      wx.navigateTo({
        url: '/pages/operationCourseDetails/operationCourseDetails?id=' + course.id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/courseDetails/courseDetails?id=' + course.id,
      })
    }
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