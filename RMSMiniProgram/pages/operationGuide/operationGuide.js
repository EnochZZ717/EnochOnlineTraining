var operationGuideService = require('../../services/operationGuideService.js');
var homeService = require('../../services/homeService.js');
var userService = require('../../services/userService.js');
import config from '../../utils/config.js';
const app = getApp()

Page({
  data: {
    searchValue: '',
    courses: [],
    sortFilter: [{
      text: '时间',
      value: 'publishedDate'
    }, {
      text: '热度',
      value: 'hits'
    }],
    sortValue: 'default',
    sortOrder: 0,
    scoreViewHeight: '55vh',
    refreshTriggered: false,
    hasMore: true,
    pageNo: 1,
    lastQueryResult: 0,
    refreshActive: false,
    hasData: true,
    showSNNumberModal: false,
    snNumber: '',
    categories: [],
    activeCategories: [],
    tips: '',
    errorMessage: '',
    showModal: false,
    modalLocation: '135',
    hotKeys: [],
    displayErrorMessage: 'hidden',
    showSnPopup: false,
    inputSn: '',
    inputSns: [],
    updateSnInput: '',
    isRefresh: false,
    showConfirmInput:false,
    confirmSnInput:true
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
  onCloseSnPopup() {
    this.setData({
      showSnPopup: false
    });
  },
  onSnChange(event) {
    var showConfirmInput=this.data.showConfirmInput;
    var confirmSnInput=this.data.confirmSnInput;
    if(event.detail.length>0){
      showConfirmInput=true;
    }else{
      showConfirmInput=false;
    }

    if(event.detail.length>3){
      confirmSnInput=false;
    }else{
      confirmSnInput=true;
    }
    this.setData({
      inputSn: event.detail,
      showConfirmInput:showConfirmInput,
      confirmSnInput:confirmSnInput
    });
  },
  onCompleteSnInput() {
    var self = this;
    var sn = this.data.inputSn;
    var sns = this.data.inputSns;
    if (sn.trim() == '') {
      wx.showToast({
        title: '请输入SN号',
        icon: 'none'
      })
      return;
    }

    //是否是数字
    if (isNaN(sn)) {
      wx.showToast({
        title: 'SN输入格式不正确',
        icon: 'none'
      })
      return;
    }

    if (sns.indexOf(sn) != -1) {
      wx.showToast({
        title: 'SN号已经存在',
        icon: 'none'
      })
      return;
    }

    userService.validationSnNumber(sn, (res) => {
      if (res) {
        sns.push(sn);
        operationGuideService.saveSn({
          sns: sns
        }, self);
      } else {
        wx.showToast({
          title: 'SN不存在',
          icon: 'none'
        })
      }
    });
  },
  onClickUpdateSnInput(obj) {
    var sn = obj.detail.value;
    this.setData({
      updateSnInput: sn
    });
  },
  onUpdateSnInput(obj) {
    var self = this;
    var sn = obj.detail;
    var sns = this.data.inputSns;
    if (sn.trim() == '') {
      wx.showToast({
        title: '请输入SN号',
        icon: 'none'
      })
      return;
    }

    //是否是数字
    if (isNaN(sn)) {
      wx.showToast({
        title: 'SN输入格式不正确',
        icon: 'none'
      })
      return;
    }

    if (sns.indexOf(sn) != -1) {
      wx.showToast({
        title: 'SN号已经存在',
        icon: 'none'
      })
      return;
    }

    var index = sns.indexOf(this.data.updateSnInput);
    sns.splice(index, 1);

    console.log(sn);
    console.log(sns);
    userService.validationSnNumber(sn, (res) => {
      if (res) {
        sns.push(sn);
        operationGuideService.saveSn({
          sns: sns
        }, self);
      } else {
        sns.push(self.data.updateSnInput);
        self.setData({
          updateSnInput: ''
        });
        wx.showToast({
          title: 'SN不存在',
          icon: 'none'
        })
      }
    });
  },
  onRemoveSn(obj) {
    var sn = obj.currentTarget.dataset['index'];
    var sns = this.data.inputSns;
    var index = sns.indexOf(sn);
    sns.splice(index, 1);
    operationGuideService.saveSn({
      sns: sns
    }, this);
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
  onSaveSNNumber() {
    var sn = this.data.snNumber;
    if (sn == '') {
      this.setData({
        displayErrorMessage: 'visible'
      });
      return;
    }
    operationGuideService.saveSn({
      sn: sn
    }, this);

    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      userInfo.seriesNumbers = userInfo.seriesNumbers + "," + sn;
      wx.setStorageSync('userInfo', userInfo);
    }
  },
  onSNNumberChange(event) {
    this.setData({
      snNumber: event.detail
    });
  },
  onReturn() {
    this.setData({
      showSNNumberModal: false
    });
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
  onRefreshByPage() {
    var pageNo = this.data.pageNo;
    var self = this;
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
      operationGuideService.getCourses({
        pageNo: pageNo + 1,
        courseName: self.data.searchValue,
        sortField: self.sortValue,
        sortOrder: self.sortOrder,
        categoryName: self.filterValue
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
          refreshActive: false,
          isRefresh: false
        })
      });
    }
  },

  noop: {},
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
  onLoad() {
    var self = this;
    operationGuideService.getSnsTips(self);
    operationGuideService.getFilters(() => {}, self);
    this.filterCourse();
    homeService.getHotKeys(self, () => {});

    var scoreViewHeight = app.globalData.windowHeight - app.globalData.navHeight - 54 - 17 - 51 - 55 - 10;
    config.getIPhoneAgents.forEach((item, index) => {
      if (app.globalData.device.indexOf(item) != -1) {
        scoreViewHeight = scoreViewHeight - 40;
      }
    });
    this.setData({
      scoreViewHeight: scoreViewHeight + 'px',
      navHeight: app.globalData.navHeight
    });
  },
  enterSNNumber() {
    var self = this;
    userService.getUserInfo(user => {
      var sns = [];
      if (user.data.seriesNumbers != '') {
        sns = user.data.seriesNumbers.split(',');
        wx.setStorageSync('userInfo', user.data);
      }
      self.setData({
        inputSns: sns,
        showSnPopup: true
      });
    });

    // this.setData({
    //   // showSNNumberModal: true
    //   showSnPopup: true
    // });
  },
  goSnGuide() {
    wx.navigateTo({
      url: '/pages/snGuide/snGuide',
    })
  },
  onShowCourse(params) {
    var course = params.currentTarget.dataset["index"];
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
  filterCourse() {
    var self = this;
    var pageNo = self.data.pageNo;
    operationGuideService.getCourses({
      pageNo: pageNo,
      sortField: self.data.sortValue,
      sortOrder: self.data.sortOrder,
      acviveIds: self.data.activeCategories
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
  onRefresh() {
    this.setData({
      pageNo: 1
    });
    this.filterCourse();
    this.setData({
      refreshActive: false
    });
  },
  onShow() {

  }
})