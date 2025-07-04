var userPermissionService = require('/services/userPermissionService.js');
var userService = require('/services/userService.js');
var util = require('/utils/util.js');
 
App({
  log(eventName, properties) {
    console.log(eventName);
    console.log(eventNapropertiesme);
  },
  identify(openId, unionId) {
    console.log(openId);
    console.log(unionId);
  },
  onLaunch: async function () {
    util.appInitialization(this);
    util.getNetworkType(this);
    util.lisenNetworkStatusChange(this);
    util.checkUpdateVersion();
    await userPermissionService.wxLogin(this);
  },
  onShow: function () {
    userService.updateTokenUser();
  },
  globalData: {

  }
})