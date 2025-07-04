var api = require('./api.js');

function wxPromisify(fn) {
    return function (obj = {}) {
        return new Promise((resolve, reject) => {
            obj.success = function (res) {
                wx.hideToast({
                    success: (res) => {},
                })
                if (res.statusCode == 200 || res.statusCode == 403) {
                    resolve(res)
                } else if (res.statusCode == 404) {
                    wx.redirectTo({
                        url: '/pages/error/error?type=NotFound',
                    });
                } else if (res.statusCode == 401) {
                    var token = wx.getStorageSync('token');
                    wx.request({
                        url: api.getNewToken(),
                        header: {
                            'content-type': 'application/json',
                            'Authorization': 'bearer ' + token.token
                        },
                        success(res) {
                            wx.setStorageSync('token', res.data);
                            wx.showToast({
                                title: '登录凭证过期,请重试',
                                icon: 'none'
                            });
                            const app = getApp();
                            app.identify(res.data.user.weChatOpenID, res.data.user.unionId);
                            setTimeout(() => {
                                wx.redirectTo({
                                    url: '/pages/index/index',
                                });
                            }, 1500);
                        }
                    })
                } else {
                    wx.showToast({
                        title: '服务器繁忙, 请稍后再试!',
                        icon: 'none'
                    })
                }
            }
            obj.fail = function (res) {
                reject(res)
                wx.hideToast({
                    success: (res) => {},
                });
                // error 
                wx.showToast({
                    title: '数据请求失败,请稍后再试!',
                    icon: "none"
                })
            }
            fn(obj)
        })
    }
}

if (!Promise.prototype.finally) {
    Promise.prototype.finally = function (callback) {
        let P = this.constructor;
        wx.hideToast({
            success: (res) => {},
        })
        return this.then(
            value => P.resolve(callback()).then(() => value),
            reason => P.resolve(callback()).then(() => {
                throw reason
            })
        );
    };
}

function buildRequest(url, data, method) {
    var getRequest = wxPromisify(wx.request);
    var token = wx.getStorageSync('token');
    if (token != '') {
        token = token.token;
    }
    var systemInfo = wx.getStorageSync('systemInfo');
    wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 300000,
        mask: true
    });
    return getRequest({
        url: url,
        method: method,
        data: data,
        header: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + token,
            'x-device': systemInfo ? JSON.stringify(systemInfo) : ''
        }
    })
}

function getRequest(url, data) {
    return buildRequest(url, data, "GET");
}

function postRequest(url, data) {
    return buildRequest(url, data, "POST");
}

function putRequest(url, data) {
    return buildRequest(url, data, "PUT");
}

function deleteRequest(url, data) {
    return buildRequest(url, data, "DELETE");
}

module.exports = {
    postRequest: postRequest,
    getRequest: getRequest,
    putRequest: putRequest,
    deleteRequest: deleteRequest
}