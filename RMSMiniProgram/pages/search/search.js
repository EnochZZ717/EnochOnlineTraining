var courseService = require('../../services/courseService.js');
const app = getApp()
Page({
  data: {
    courses: [],
    searchValue: '',
    hasMore: false,
    scoreViewHeight: '55vh',
    lastQueryResult: 0,
    hasData: true,
    lastSearchText: ''
  },
  onLoad(options) {
    this.setData({
      searchValue: options.text,
      lastSearchText: options.text
    });
    var self = this;
    courseService.courseDeepSearch({
      text: self.data.searchValue
    }, self);
  },
  onSearchChange(e) {
    this.setData({
      searchValue: e.detail,
    });
  },
  onSearch: function () {
    if (this.data.searchValue == '') {
      wx.showToast({
        title: '请输入课程名称',
        icon: 'none'
      })
      return;
    }
    this.setData({
      lastSearchText: this.data.searchValue
    });
    var self = this;
    courseService.courseDeepSearch({
      text: self.data.searchValue
    }, self);
  },
  onShow() {

  },
  onShowCloudClassroom(e) {
    var course = e.currentTarget.dataset['index'];
    if (course.isPublished == true) {
      wx.navigateTo({
        url: '/pages/courseDetails/courseDetails?id=' + course.id,
      })
    } else {
      wx.showToast({
        title: '该课程尚未发布',
        icon: 'error'
      })
    }
  },
  onShowOperationCourse(e) {
    var course = e.currentTarget.dataset['index'];
    if (course.isPublished == true) {
      wx.navigateTo({
        url: '/pages/operationCourseDetails/operationCourseDetails?id=' + course.id,
      })
    } else {
      wx.showToast({
        title: '该课程尚未发布',
        icon: 'error'
      })
    }
  },
  onShowCourseDetail(e) {
    var course = e.currentTarget.dataset['index'];
    if (course.isPublished == true) {
      if (course.categoryRootName == "云课堂") {
        wx.navigateTo({
          url: '/pages/courseDetails/courseDetails?id=' + course.id,
        })
      } else {
        wx.navigateTo({
          url: '/pages/operationCourseDetails/operationCourseDetails?id=' + course.id,
        })
      }
    } else {
      wx.showToast({
        title: '该课程尚未发布',
        icon: 'error'
      })
    }
  },
  onReady() {
   
  }
})