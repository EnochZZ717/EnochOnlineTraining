const app = getApp();
var authenticationService = require('../../services/authenticationService.js');
var userPermissionService = require('../../services/userPermissionService.js');
Component({
  options: {
    addGlobalClass: true,
  },
  externalClasses: ['custom-class'],
  properties: {
    active: {
      type: String
    }
  },
  data: {
    menus: []
  },
  lifetimes: {
    attached: function () {
      var menus1 = [{
          zh_name: "首页",
          en_name: "home",
          icon: "/images/home01.png",
          activeIcon: "/images/home02.png"
        },
        {
          zh_name: "云课堂",
          en_name: "classroom",
          icon: "/images/classroom01.png",
          activeIcon: "/images/classroom02.png"
        },
        {
          zh_name: "培训课程",
          en_name: "operationGuide",
          icon: "/images/train01.png",
          activeIcon: "/images/train02.png"
        },
        {
          zh_name: "个人中心",
          en_name: "account",
          icon: "/images/personage01.png",
          activeIcon: "/images/personage02.png"
        }
      ];

      var menus2 = [{
          zh_name: "首页",
          en_name: "home",
          icon: "/images/home01.png",
          activeIcon: "/images/home02.png"
        },
        {
          zh_name: "云课堂",
          en_name: "classroom",
          icon: "/images/classroom01.png",
          activeIcon: "/images/classroom02.png"
        },
        {
          zh_name: "培训课程",
          en_name: "operationGuide",
          icon: "/images/train01.png",
          activeIcon: "/images/train02.png"
        },
        {
          zh_name: "学习小组",
          en_name: "learnGroup",
          icon: "/images/plan01.png",
          activeIcon: "/images/plan02.png"
        },
        {
          zh_name: "个人中心",
          en_name: "account",
          icon: "/images/personage01.png",
          activeIcon: "/images/personage02.png"
        }
      ];

      var self = this;
      authenticationService.checkUserLoginStatus(self, (token) => {
        if (token.code == 0) {
          self.setData({
            menus: menus1
          })
        } else {
          if (token.user.isMemberGroupMember || token.user.isMemberGroupLeader) {
            self.setData({
              menus: menus2
            })
          } else {
            self.setData({
              menus: menus1
            })
          }
        }

      });


    }
  },
  methods: {
    _onChange: function (event) {
      if (this.data.active == event.detail) {
        return;
      }
      this.setData({
        active: event.detail
      });

      switch (event.detail) {
        case 'home':
          wx.redirectTo({
            url: '/pages/index/index',
          })
          break;
        case 'classroom':
          wx.redirectTo({
            url: '/pages/cloudClassroom/cloudClassroom',
          })
          break;
        case 'operationGuide':
          wx.redirectTo({
            url: '/pages/operationGuide/operationGuide',
          })
          break;
        case 'learnGroup':
          wx.redirectTo({
            url: '/pages/memberGroup/memberGroup',
          })
          break;
        case 'account':
          var userInfo = wx.getStorageSync('userInfo');
          if (!userInfo) {
            userPermissionService.getUserInfo(res => {
              wx.setStorageSync('userInfo', res.data);
              wx.redirectTo({
                url: '/pages/account/userInfo/userInfo',
              });
            });
          } else {
            wx.redirectTo({
              url: '/pages/account/userInfo/userInfo',
            });
          }

          break;
      }
    },
  }
})