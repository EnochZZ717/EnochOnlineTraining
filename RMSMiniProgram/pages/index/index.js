var homeService = require('../../services/homeService.js');
var authenticationService = require('../../services/authenticationService.js');
import config from '../../utils/config.js';
const app = getApp()

Page({
  data: {
    navHeight: 0,
    searchValue: '',
    banners: [],
    cloudClassroomImage: '',
    operationGuide: '',
    hotCourses: [],
    loading: true,
    swiperCurrent: 0,
    hasMore: false,
    pageNo: 1,
    scoreViewHeight: '',
    refreshActive: false,
    lastQueryResult: 0,
    showModal: false,
    hotKeys: [],
    modalLocation: '140',
    showRegisterModal: false,
    showPage: false,
    disableSearch: false
  },
  onReachBottom: function (e) {
    var pageNo = this.data.pageNo;
    var self = this;
    this.setData({
      refreshActive: true
    });
    if (this.data.lastQueryResult < config.getPageSize) {
      this.setData({
        hasMore: false
      });
      return;
    } else {
      this.setData({
        hasMore: true
      });
      homeService.getConfig(self, {
        pageNo: pageNo + 1
      });

    }
  },
  onHotKeySearch(e) {
    var key = e.currentTarget.dataset.value;
    this.setData({
      searchValue: key
    });
    wx.navigateTo({
      url: '/pages/search/search?text=' + key,
    })
  },
  onClickHide() {
    this.setData({
      showModal: false
    });
  },
  onActiveInput() {
    if (this.data.showRegisterModal) {
      return;
    }
    var modalHeight = app.globalData.navHeight + 53;
    this.setData({
      modalLocation: modalHeight,
      showModal: true
    });
  },
  onLoad() {
    var self = this;
    homeService.getConfig(self, {
      pageNo: self.data.pageNo
    });
    homeService.getHotKeys(self, () => {});
  },
  onShow() {
    var self = this;
    authenticationService.checkUserLoginStatus(self, (token) => {
      var disableSearch = false;
      if (self.data.showRegisterModal) {
        disableSearch = true;
      }
      self.setData({
        disableSearch: disableSearch
      });
    });
  },
  onReady() {
    var scoreViewHeight = app.globalData.windowHeight - app.globalData.navHeight - 54;
    config.getIPhoneAgents.forEach((item, index) => {
      if (app.globalData.device.indexOf(item) != -1) {
        scoreViewHeight = scoreViewHeight - 40;
      }
    });

    this.setData({
      scoreViewHeight: scoreViewHeight + 'px',
      navHeight: app.globalData.navHeight
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  swiperDotChange: function (e) {
  },
  onSearchChange(e) {
    this.setData({
      searchValue: e.detail,
    });
  },
  onShareAppMessage: function () {
    let obj = {
      title: '蔡司空中教室',
      path: `/pages/index/index`,
      imageUrl: '/images/zeiss-logo-rgb.png'
    };
    return obj;
  },
  onShowCourse(e) {
    var course = e.currentTarget.dataset['index'];
    if (course.isPublished == true) {
      if (course.categoryType == "培训课程") {
        wx.navigateTo({
          url: '/pages/operationCourseDetails/operationCourseDetails?id=' + course.id,
        })
      } else {
        wx.navigateTo({
          url: '/pages/courseDetails/courseDetails?id=' + course.id,
        })
      }
    } else {
      wx.showToast({
        title: '该课程尚未发布',
        icon: 'error'
      })
    }
  },
  onSearch: function () {
    if (this.data.searchValue == '') {
      wx.showToast({
        title: '请输入你要查询的课程名字',
        icon: 'none'
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/search/search?text=' + this.data.searchValue,
    })
  }
})