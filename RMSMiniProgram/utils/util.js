const formatTime = date => {
  var dateNow = new Date();
  var date = new Date(date);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1);
  const day = date.getDate();

  var times = (dateNow - date) / 1000;
  let tip = '';
  if (times <= 0) {
    tip = '刚刚'
    return tip;
  } else if (Math.floor(times / 60) <= 0) {
    tip = '刚刚'
    return tip;
  } else if (times < 3600) {
    tip = Math.floor(times / 60) + '分钟前'
    return tip;
  } else if (times >= 3600 && (times <= 86400)) {
    tip = Math.floor(times / 3600) + '小时前'
    return tip;
  } else if (times / 86400 <= 1) {
    tip = Math.ceil(times / 86400) + '昨天'
  } else if (times / 86400 <= 31 && times / 86400 > 1) {
    tip = Math.ceil(times / 86400) + '天前'
  } else if (times / 86400 >= 31) {
    tip = year + '-' + month + '-' + day
  } else tip = null;
  return tip
}

const getStorage = (key) => {
  try {
    var v = wx.getStorageSync(key);
    return v;
  } catch (e) {
    return [];
  }
}

const setStorage = (key, cont) => {
  wx.setStorage({
    key: key,
    data: cont
  })
}

function getNetworkType(that) {
  //初次加载判断网络情况
  wx.getNetworkType({
    success(res) {
      const networkType = res.networkType
      if (networkType === 'none') {
        that.globalData.isConnected = false
        wx.showToast({
          title: '当前无网络',
          icon: 'loading'
        })
      }
    }
  });
}

function lisenNetworkStatusChange(that) {
  //监听网络状态变化
  wx.onNetworkStatusChange(function (res) {
    if (!res.isConnected) {
      wx.showToast({
        title: '网络已断开',
        icon: 'loading'
      })
      that.globalData.isConnected = false
    } else {
      wx.hideToast()
      that.globalData.isConnected = true
    }
  })
}

function checkUpdateVersion() {
  if (wx.canIUse('getUpdateManager')) {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(function () {
          wx.showModal({
            title: '发现新版本',
            content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开.',
          })
        })
      }
    })
  } else {
    //TODO 此时微信版本太低（一般而言版本都是支持的）
    // wx.showModal({
    //   title: '溫馨提示',
    //   content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    // })
  }
}


function appInitialization(that) {
  let menuButtonObject = wx.getMenuButtonBoundingClientRect();
  wx.getSystemInfo({
    success: res => {
      let statusBarHeight = res.statusBarHeight,
        navTop = menuButtonObject.top, //胶囊按钮与顶部的距离
        navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
      that.globalData.navHeight = navHeight;
      that.globalData.device = res.model;
      that.globalData.navTop = navTop;
      that.globalData.windowHeight = res.windowHeight;
      that.globalData.system = res.system;
      that.globalData.SDKVersion = res.SDKVersion;
      wx.setStorageSync('systemInfo', res);
    },
    fail(err) {}
  })

}

function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }
      obj.fail = function (res) {
        reject(res)
      }
      fn(obj)
    })
  }
}

function loadNavbar(that) {
  let menuButtonObject = wx.getMenuButtonBoundingClientRect();
  wx.getSystemInfo({
    success: res => {
      let statusBarHeight = res.statusBarHeight,
        navTop = menuButtonObject.top, //胶囊按钮与顶部的距离
        navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
      that.globalData.navHeight = navHeight;
      that.globalData.device = res.model;
      that.globalData.navTop = navTop;
      that.globalData.windowHeight = res.windowHeight;
      that.globalData.system = res.system;
    },
    fail(err) {}
  })
}


module.exports = {
  formatTime,
  getStorage: getStorage,
  setStorage: setStorage,
  getNetworkType: getNetworkType,
  lisenNetworkStatusChange: lisenNetworkStatusChange,
  checkUpdateVersion: checkUpdateVersion,
  appInitialization: appInitialization,
  loadNavbar: loadNavbar
}