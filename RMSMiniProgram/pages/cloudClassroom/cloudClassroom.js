var cloudClassroomService = require('../../services/cloudClassroomService.js');
var homeService = require('../../services/homeService.js');
import config from '../../utils/config.js';
const app = getApp()
Page({
  data: {
    pageNo: 1,
    courses: [],
    refreshTriggered: false,
    searchValue: '',
    sortOptions: [{
      text: '时间',
      value: 'publishedDate'
    }, {
      text: '热度',
      value: 'hits'
    }],
    sortValue: 'default',
    sortOrder: 0,
    filterValue: null,
    hasMore: false,
    scoreViewHeight: '55vh',
    lastQueryResult: 0,
    refreshActive: false,
    hasData: true,
    categories: [],
    activeCategories: [],
    showModal: false,
    modalLocation: '135',
    hotKeys: [],
    isRefresh: false
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
    var query = wx.createSelectorQuery();
    query.select('#tempModal')
      .boundingClientRect()
      .exec((rect = []) => {
        this.setData({
          modalLocation: rect[0].top
        });
        this.setData({
          showModal: true
        });
      });
  },
  onCategoryActive: function (e) {
    var category = e.currentTarget.dataset.value;
    var activeCategories = this.data.activeCategories;
    if (activeCategories.indexOf(category.id) != -1) {
      var index = activeCategories.indexOf(category.id);
      activeCategories.splice(index, 1);
    } else {
      activeCategories.push(category.id);
    }
    this.setData({
      activeCategories: activeCategories
    });
    this.onSubmit();
  },
  onShowCourse(params) {
    var course = params.currentTarget.dataset["index"];
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
  onReset() {
    this.setData({
      activeCategories: [],
      pageNo: 1
    });
    this.selectComponent('#item').toggle(false);
    this.filterCourse();
  },
  onSubmit() {
    this.selectComponent('#item').toggle(false);
    this.setData({
      pageNo: 1
    });
    this.filterCourse();
  },
  onSortChange({
    detail
  }) {
    var sortValue = this.data.sortValue;
    var sortOrder = this.data.sortOrder;
    if (sortValue == detail) {
      if (sortOrder == 0) {
        sortOrder = 1;
      } else {
        sortOrder = 0;
      }
    }
    this.setData({
      sortValue: detail,
      sortOrder: sortOrder
    });
    this.filterCourse();
  },
  filterCourse() {
    var self = this;
    var pageNo = self.data.pageNo;
    var acviveIds = self.data.activeCategories;
    cloudClassroomService.getCourses({
      pageNo: pageNo,
      sortField: self.data.sortValue,
      sortOrder: self.data.sortOrder,
      acviveIds: acviveIds
    }, (res) => {
      if (res.data.length == 0) {
        self.setData({
          hasData: false
        });
      } else {
        self.setData({
          hasData: true
        });
      }

      res.data.forEach(x => {
        if (x.name.length > 44) {
          x.name = x.name.substring(0, 44) + '...';
        }
      });

      self.setData({
        courses: res.data,
        lastQueryResult: res.data.length,
        refreshTriggered: false,
        refreshActive: false
      })
    });
  },
  onLoad() {
    var self = this;
    cloudClassroomService.getFilters(() => {}, self);
    this.filterCourse();
    homeService.getHotKeys(self, () => {});
  },
  onRefreshByPage() {
    var pageNo = this.data.pageNo;
    var self = this;
    var acviveIds = self.data.activeCategories;
    if (this.data.isRefresh) {
      return;
    }
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
        hasMore: true,
        isRefresh: true
      });
      cloudClassroomService.getCourses({
        pageNo: pageNo + 1,
        sortField: self.data.sortValue,
        sortOrder: self.data.sortOrder,
        acviveIds: acviveIds
      }, (res) => {
        if (res.data.length == 0) {
          self.setData({
            hasMore: false
          });
          return;
        }
        var newCourses = [...self.data.courses, ...res.data];
        newCourses.forEach(x => {
          if (x.name.length > 44) {
            x.name = x.name.substring(0, 44) + '...';
          }
        });
        self.setData({
          courses: newCourses,
          lastQueryResult: res.data.length,
          pageNo: pageNo + 1,
          refreshTriggered: false,
          refreshActive: false,
          isRefresh: false
        })
      });
    }
  },
  onRefresh() {
    this.setData({
      pageNo: 1
    });
    this.filterCourse();
    this.setData({
      refreshActive: false
    });
  },
  onSearchChange(e) {
    this.setData({
      searchValue: e.detail,
    });
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
  },
  onShow() {

  },
  onReady() {
    var scoreViewHeight = app.globalData.windowHeight - app.globalData.navHeight - 54 - 51 - 55;
    config.getIPhoneAgents.forEach((item, index) => {
      if (app.globalData.device.indexOf(item) != -1) {
        scoreViewHeight = scoreViewHeight - 40;
      }
    });

    this.setData({
      scoreViewHeight: scoreViewHeight + 'px'
    })
  }
})