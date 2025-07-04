var api = require('../utils/api.js');
var wxRequest = require('../utils/wxRequest.js')

function getUserInfo(fn) {
  wxRequest.getRequest(api.getUserInfo()).then(res => {
    wx.setStorageSync('userInfo', res.data);
    fn(res);
  });
}

function updateTokenUser() {
  var token = wx.getStorageSync('token');
  if (token) {
    if (token.code == 1) {
      getUserInfo((res => {
        token.user = res.data;
        wx.setStorageSync('token', token);
        if (token.user.status) {
          wx.redirectTo({
            url: '/pages/error/error?type=UserDisabled',
          })
          return;
        }
      }));
    }
  }
}

function getUserSn(fn) {
  wxRequest.getRequest(api.getUserSn()).then(res => {
    fn(res);
  });
}


function loadUserCollections(page) {
  wxRequest.getRequest(api.getUserCollections()).then(res => {
    if (res.data.data.length > 0) {
      res.data.data.forEach(x => {
        if (x.courseName.length > 30) {
          x.courseName = x.courseName.substring(0, 30) + '...';
        }
      });
    }

    var flag = false;
    if (res.data.data.filter(x => x.isCancel == false).length == 0) {
      flag = true;
    }

    page.setData({
      collections: res.data.data,
      isEmpty: flag
    });
  });
}

function putCollection(data, page) {
  wxRequest.putRequest(api.deleteCollection(), data).then(res => {
    //loadUserCollections(page);
  });
}

function deleteCollection(data, page) {
  wxRequest.deleteRequest(api.deleteCollection(), data).then(res => {
    //loadUserCollections(page);
  });
}

function updateUserInfo(data, page) {
  wxRequest.postRequest(api.updateUserInfo(), data).then(res => {
    if (res.data.status == "Success") {
      getUserInfo(res => {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
        page.setData({
          submit: false,
          isDisable: false
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500);
      });
    } else {
      wx.showToast({
        title: '数据请求失败,请稍后再试',
        icon: 'none'
      })
    }
  });
}

function loadUserCourseHistory(page) {
  wxRequest.getRequest(api.loadUserCourseHistory()).then(res => {
    if (res.data.length > 0) {
      res.data.forEach(x => {
        if (x.name.length > 30) {
          x.name = x.name.substring(0, 30) + '...';
        }
      });
    }

    page.setData({
      courses: res.data
    });
  });
}

function validationSnNumber(sn, fn) {
  wxRequest.getRequest(api.validationSnNumber(sn)).then(res => {
    fn(res.data);
  });
}

function completeCourse(page) {
  wxRequest.postRequest(api.completeCourse(page.data.id), {}).then(res => {
    var course = page.data.course;
    course.isWatchCompleted = true;
    page.setData({
      course: course
    });
  });
}

module.exports = {
  getUserInfo: getUserInfo,
  loadUserCollections: loadUserCollections,
  putCollection: putCollection,
  deleteCollection: deleteCollection,
  updateUserInfo: updateUserInfo,
  loadUserCourseHistory: loadUserCourseHistory,
  getUserSn: getUserSn,
  validationSnNumber: validationSnNumber,
  updateTokenUser: updateTokenUser,
  completeCourse: completeCourse
}