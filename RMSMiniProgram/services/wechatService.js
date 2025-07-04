var api = require('../utils/api.js');
var wxRequest = require('../utils/wxRequest.js')

function getPhoneNumber(code, page, app) {
  wxRequest.getRequest(api.getPhoneNumber(code)).then(res => {
    if (res.data.errcode == 0) {
      page.setData({
        inputPhoneNumber: res.data.phone_info.phoneNumber,
        showGetPhoneNumberBtn: false,
        phoneNumberErrorMessage: '',
        emailFocus: true
      });
      app.log("授权", {
        "mobile": res.data.phone_info.phoneNumber
      });
    } else {
      wx.showToast({
        title: '获取手机号失败',
        icon: 'none'
      })
    }
  });
}
module.exports = {
  getPhoneNumber: getPhoneNumber
}