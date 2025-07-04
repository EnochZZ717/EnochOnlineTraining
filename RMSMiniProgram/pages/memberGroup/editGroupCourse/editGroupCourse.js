const app = getApp()
var memberGroupService = require('../../../services/memberGroupService.js');

Page({
  data: {
    navHeight: 0,
    courses: [],
    selectedCourse: [],
    isSelectAll: false,
    groupName: '',
    id: '',
    defaultSelectCourseCount: 0
  },
  onLoad(option) {
    var allCourses = wx.getStorageSync('allCourses');
    var selectedCourse = wx.getStorageSync('updatedCourses');
    var newCourses = [];
    if (selectedCourse) {
      newCourses = selectedCourse.map(x => x.id);
    }

    if (allCourses) {
      allCourses.forEach(x => {
        if (x.name.length > 26) {
          x.name = x.name.substring(0, 26) + '...';
        }
      });
    }

    var defaultSelectCourse = selectedCourse.map(x => x.id);

    this.setData({
      navHeight: app.globalData.navHeight,
      id: option.id,
      groupName: option.name,
      selectedCourse: newCourses,
      courses: allCourses,
      defaultSelectCourse: defaultSelectCourse
    });
  },
  onSave() {
    var selectedCourse = this.data.selectedCourse;
    var courses = this.data.courses;
    var newCourse = [];
    selectedCourse.forEach(x => {
      var course = courses.find(c => c.id == x);
      course.dragId = x;
      course.fixed = false;
      newCourse.push(course);
    });
    wx.setStorageSync('updatedCourses', newCourse);
    wx.navigateBack({
      delta: 1,
    });

    //memberGroupService.updateGroupSelectedCourses(this.data.id, newCourse);
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
      selectedCourses = this.data.defaultSelectCourse;
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