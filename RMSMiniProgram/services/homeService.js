var api = require('../utils/api.js');
var wxRequest = require('../utils/wxRequest.js')

function getConfig(page, data) {
  var pageNo = data.pageNo;
  wxRequest.getRequest(api.getBanners({
    pageNo: pageNo
  })).then(res => {
    var data = {
      'banners': res.data.bannerImageList,
      'cloudClassroomImage': res.data.secondRowImageList[1],
      'operationGuide': res.data.secondRowImageList[0],
      'hotCourses': res.data.hotCourseList
    };

    if (res.data.length == 0) {
      page.setData({
        hasMore: false
      });
      return;
    }

    var newCourses = [...page.data.hotCourses, ...data.hotCourses];
    newCourses.forEach(x => {
      if (x.name.length > 44) {
        x.name = x.name.substring(0, 44) + '...';
      }
    });
  
    page.setData({
      banners: data.banners,
      cloudClassroomImage: data.cloudClassroomImage,
      operationGuide: data.operationGuide,
      hotCourses: newCourses,
      lastQueryResult: data.hotCourses.length,
      refreshActive: false,
      pageNo: pageNo,
      loading: false,
      showPage: true
    });

    wx.setStorageSync('homePageConfig', data);
  });
}

function getHotKeys(page, callback) {
  var hotKeys = wx.getStorageSync('hotKeys');
  if (hotKeys) {
    page.setData({
      hotKeys: hotKeys
    });
  } else {
    wxRequest.getRequest(api.getHotKeys()).then(res => {
      page.setData({
        hotKeys: res.data
      });
      wx.setStorageSync('hotKeys', res.data);
    });
  }

  callback();
}

module.exports = {
  getConfig: getConfig,
  getHotKeys: getHotKeys
}