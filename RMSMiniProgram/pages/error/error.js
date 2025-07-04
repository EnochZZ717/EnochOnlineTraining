const app = getApp()

Page({
  data: {
    typeMessage: '',
    detail: '',
    type: ''
  },
  onLoad(query) {
    var typeMessage = '';
    var detail = '';
    switch (query.type) {
      case "WeChatApiError":
        typeMessage = "获取授权数据错误";
        detail = "对不起, 在获取用户授权数据时发生错误,请通过以下按钮重新登录.";
        break;
      case "NoPermission":
        typeMessage = "没有访问权限";
        detail = "对不起, 您没有该课程的访问权限。";
        break;
      case "NoLogin":
        typeMessage = "请先登录";
        detail = "对不起, 您没有该页面的访问权限, 请先登录。";
      case "UserDisabled":
        typeMessage = "用户被禁用";
        detail = "您的账号已经被禁用。";
        break;
      case "NotFound":
        typeMessage = "资源不存在";
        detail = "课程已被删除。";
        break;
    }
    this.setData({
      typeMessage: typeMessage,
      detail: detail,
      type: query.type
    });
  },
  onReady: function () {

  },
  onShow: function () {

  },
  backToHome() {
    wx.redirectTo({
      url: '/pages/index/index',
    });
  },
})