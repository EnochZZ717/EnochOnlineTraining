const app = getApp()

function checkUserLoginStatus(page, callback) {
  var token = wx.getStorageSync('token');
  if (token) {
    if (token.code == 0) {
      wx.redirectTo({
        url: '/pages/register/register',
      })
      callback(token);
      return;
    }

    if (token.code == -3) {
      wx.redirectTo({
        url: '/pages/index/index',
      })
      return;
    }

    //用户被禁用
    if (token.user.status) {
      wx.redirectTo({
        url: '/pages/error/error?type=UserDisabled',
      })
      return;
    }
    callback(token);
  } else {
    app.dataCallback = res => {
      if (res.code == 0) {
        wx.redirectTo({
          url: '/pages/register/register',
        })
        return;
      }
      //用户被禁用
      if (res.user.status) {
        wx.redirectTo({
          url: '/pages/error/error?type=UserDisabled',
        })
        return;
      }

      callback(res);
    };
  }
}

module.exports = {
  checkUserLoginStatus: checkUserLoginStatus
}