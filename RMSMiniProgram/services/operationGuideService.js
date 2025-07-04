var api = require('../utils/api.js');
var wxRequest = require('../utils/wxRequest.js')

function getFilters(fn, page) {
  wxRequest.getRequest(api.getOperateFilter()).then(res => {
    page.setData({
      categories: res.data
    });
  });

  fn();
}

function getCourses(data, fn) {
  wxRequest.postRequest(api.getOperationGuideCourse(data), data.acviveIds).then(res => {
    fn(res.data);
  });
}

function getSnsTips(page) {
  let token = wx.getStorageSync('token');
  if (token.user.seriesNumbers) {
    if (token.user.seriesNumbers.trim() != '') {
      page.setData({
        tips: '输入其他产品设备序列号（SN）解锁相关课程'
      });
    } else {
      page.setData({
        tips: '输入产品设备序列号（SN）解锁相关课程'
      });
    }
  } else {
    page.setData({
      tips: '输入产品设备序列号（SN）解锁相关课程'
    });
  }

}

function saveSn(data, page) {
  wxRequest.postRequest(api.saveSn(), '"' + data.sns.join(',') + '"').then(res => {
    if (res.data.status == 'Failed') {
      wx.showToast({
        title: 'SN更新失败',
        icon: 'none'
      })
      return;
    } else {
      page.setData({
        inputSns: data.sns,
        inputSn: '',
        pageNo: 1
      });

      var userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        userInfo.seriesNumbers = data.sns.join(',');
        wx.setStorageSync('userInfo', userInfo);
      }
    }

    page.filterCourse();

  });
}

module.exports = {
  getFilters: getFilters,
  getCourses: getCourses,
  getSnsTips: getSnsTips,
  saveSn: saveSn
}