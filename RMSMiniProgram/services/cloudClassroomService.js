var api = require('../utils/api.js');
var wxRequest = require('../utils/wxRequest.js')

function getFilters(fn, page) {
  let cloudClassroomCategories = wx.getStorageSync('cloudClassroomCategories');
  if (cloudClassroomCategories) {
    page.setData({
      categories: cloudClassroomCategories
    });
  } else {
    wxRequest.getRequest(api.getCloudClassroomFilter()).then(res => {
      page.setData({
        categories: res.data,
      });
      wx.setStorageSync('cloudClassroomCategories', res.data)
    });
  }

  fn();
}

function getCourses(data, fn) {
  wxRequest.postRequest(api.getCloudClassroomCourses(data), data.acviveIds).then(res => {
    fn(res.data);
  });
}

module.exports = {
  getFilters: getFilters,
  getCourses: getCourses
}