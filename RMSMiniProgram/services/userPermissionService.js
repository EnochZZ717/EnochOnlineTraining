var api = require('../utils/api.js');
var wxRequest = require('../utils/wxRequest.js')

function getToken(code) {
  return new Promise(function (reslove, reject) {
    wxRequest.getRequest(api.getToken(code)).then(res => {
      wx.setStorageSync('token', res.data);
      reslove(res.data);
    });
  })
}

function checkUserPermission(page) {
  var token = wx.getStorageSync('token')
  //TODO... 
}

function wxLogin(that) {
  return new Promise(function (reslove, reject) {
    wx.login({
      success(res) {
        getToken(res.code).then(token => {
          var app = getApp();
          //token.code 0: 第一次进入未注册 1: 已经注册
          if (that.dataCallback) {
            that.dataCallback(token);
          }
        }); 
      }
    })
  })
}

function getUserProfile() {
  return new Promise(function (reslove, reject) {
    wx.getUserProfile({
      desc: '用于完善客户信息',
      success: (res) => {
        reslove(res);
      },
      fail: (res) => {
        reslove(res);
      }
    })
  })
}

function register(data) {
  return wxRequest.postRequest(api.register(), data);
}

function getUserInfo(fn) {
  wxRequest.getRequest(api.getUserInfo()).then(res => {
    fn(res);
  });
}

function getOpenId(code, fn) {
  wxRequest.getRequest(api.getOpenId(code)).then(res => {
    fn(res);
  });
}

module.exports = {
  getToken: getToken,
  wxLogin: wxLogin,
  register: register,
  getUserProfile: getUserProfile,
  getUserInfo: getUserInfo,
  checkUserPermission: checkUserPermission,
  getOpenId: getOpenId
}