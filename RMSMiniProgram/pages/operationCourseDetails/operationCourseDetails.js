const app = getApp()
import config from '../../utils/config.js';
var courseService = require('../../services/courseService.js');
var userService = require('../../services/userService.js');
var authenticationService = require('../../services/authenticationService.js');
var util = require('../../utils/util.js');

Page({
  data: {
    pageName: "",
    id: "",
    query: {},
    activeNames: ['1'],
    iconName: "arrow-up",
    showShare: false,
    options: [{
        name: '微信',
        icon: 'wechat',
        openType: 'share'
      },
      {
        name: '二维码',
        icon: 'qrcode'
      },
    ],
    course: {},
    sections: [],
    activeSection: {},
    showQrCode: false,
    videoContext: null,
    qrCode: '',
    playStatus: false,
    confirmNetworkType: false,
    isFavor: false,
    canOperation: true,
    operationInterval: 3500,
    watchTime: 0,
    isCompleteCourse: false,
    rawDescription: '',
    description: '',
    mediaServiceFile: '',
    showExamTips: false,
    examTips: '',
    videoCoverLocation: {},
    showVideoCover: true,
    showSections: true,
    showOfficialAccount: true,
    showRegisterModal: false,
    navHeight: 0,
    objectFit: 'contain',
    displayOpsContainer: false
  },
  showShare() {
    this.setData({
      showShare: true
    });
  },
  onShareClose() {
    this.setData({
      showShare: false
    });
  },
  onCloseQrCode() {
    this.setData({
      showQrCode: false
    });
  },
  onShareSelect(event) {
    var self = this;
    if (event.detail.name == "二维码") {
      var data = {
        'sense': '',
        'page': 'pages/operationCourseDetails/operationCourseDetails',
        'courseId': this.data.id,
        'sectionId': this.data.activeSection.id,
        'width': '240',
      };
      if (this.data.qrCode == '') {
        courseService.getCourseQRCode(data, (x) => {
          const fs = wx.getFileSystemManager();
          let codeimg = wx.env.USER_DATA_PATH + '/' + self.data.id + '.png';
          fs.writeFile({
            filePath: codeimg,
            data: x,
            encoding: 'base64',
            success: (res) => {
              self.setData({
                qrCode: codeimg
              });
            }
          });
        });
      }
      this.setData({
        showQrCode: true
      });
    }
    this.onShareClose();
  },
  onOpen(event) {
    this.setData({
      iconName: "arrow-up"
    })
  },
  onClose(event) {
    this.setData({
      iconName: "arrow-down"
    })
  },
  onPause() {
    this.setData({
      playStatus: false
    });
  },
  showFullDescription() {
    var description = this.data.description;
    if (description.indexOf('......') != -1) {
      this.setData({
        description: this.data.rawDescription
      });
    } else {
      this.setData({
        description: this.data.course.description
      });
    }
  },
  onExam() {
    if (this.data.course.level != 2) {
      

      wx.showToast({
        title: '该课程无考试内容',
        icon: 'none'
      })
      return;
    }

    if (this.data.isCompleteCourse) {
      wx.navigateTo({
        url: '/pages/exam/exam?courseId=' + this.data.id + '&courseName=' + this.data.course.name,
      })
    } else {
     

      wx.showToast({
        title: '看完所有视频可以开始考试',
        icon: 'none'
      })
    }
  },
  onHideExamTips() {
    this.setData({
      showExamTips: false
    });
  },
  async onProgressChange() {
    var network = await courseService.checkNetworkType();
    if (network.networkType != "wifi" && this.data.confirmNetworkType == false) {
      this.data.videoContext.stop();
    }
    this.setData({
      showVideoCover: false,
      showSections: true
    });
  },
  onLoad: function (options) {
    this.setData({
      query: options,
      id: options.id,
      navHeight: app.globalData.navHeight
    });

    var confirmNetworkPlay = wx.getStorageSync('confirmNetworkPlay');
    if (confirmNetworkPlay) {
      this.setData({
        confirmNetworkType: true
      });
    }

    var sharedUserId = options.sharedUserId;
    if (sharedUserId) {
      wx.setStorageSync('sharedUserId', sharedUserId)
    }

    let scene = decodeURIComponent(options.scene);
    if (scene != 'undefined') {
      var parameters = scene.split('#');
      var userIntId = parameters[1].split(':')[1]; //分享者
      wx.setStorageSync('sharedUserId', userIntId);
    }

    util.loadNavbar(app);
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
      success(res) {}
    })
  },
  bindCourse(data) {
    this.setData({
      displayOpsContainer: true
    });
    app.log('WatchVideo', {
      "videoname": `${data.name}`,
      "watchvideoduration": `0.1s`,
      "TagContent": data.tagContent
    });

    var sections = data.sections.sort(function (a, b) {
      return a.sequence - b.sequence;
    });

    var isComplete = true;
    for (var i = 0; i < data.sections.length; i++) {
      if (!data.sections[i].isCompleted) {
        isComplete = false;
        break;
      }
    }

    var description = data.description;
    if (data.description.length > 104) {
      data.description = data.description.substring(0, 104) + '......';
    }

    this.setData({
      rawDescription: description,
      description: data.description,
      course: data,
      sections: sections,
      activeSection: data.sections[0],
      pageName: '培训课程',
      isFavor: data.isFavor,
      id: data.id,
      isCompleteCourse: isComplete,
      mediaServiceFile: `https://${config.getDomain}/api/video/${data.sections[0].id}.m3u8`
    });
  },
  onReady: function () {
    var videoContext = wx.createVideoContext('myVideo');
    this.setData({
      videoContext: videoContext
    });
  },
  onShow: function () {
    var self = this;
    var options = this.data.query;
    authenticationService.checkUserLoginStatus(self, (token) => {
      if (token.user.unionId) {
        self.setData({
          showOfficialAccount: false
        });
      }

      var sharedUserId = wx.getStorageSync('sharedUserId');

      //分享链接进入
      if (options.isShare != undefined) {
        setTimeout(() => {
          courseService.getShareCourse(options.id, sharedUserId, (data) => {
            self.bindCourse(data);
            self.setData({
              id: options.id
            });
          });
        }, 500);
        return;
      }

      //通过小程序码进入
      let scene = decodeURIComponent(options.scene);
      if (scene != 'undefined') {
        var parameters = scene.split('#');
        var courseIntId = parameters[0].split(':')[1];
        setTimeout(() => {
          courseService.getShareCourse(courseIntId, sharedUserId, (data) => {
            self.bindCourse(data);
            self.setData({
              id: courseIntId
            });
          });
        }, 500);
        return;
      }

      //内部进入
      if (options.id != undefined) {
        self.setData({
          id: options.id,
        })

        courseService.getCourse(self.data.id, (data) => {
          self.bindCourse(data);
        });
        return;
      }
    });
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  videoErrorCallback: function (params) {
    wx.showToast({
      title: '视频加载出错',
      icon: 'error',
      duration: 3000
    })
  },
  onEnded() {
    var self = this;
    var section = this.data.activeSection;
    var sections = this.data.sections;
    var data = {
      "courseId": this.data.id,
      "sectionId": section.id,
      "watchedTime": parseInt(this.data.watchTime),
      "isCompleted": true
    };

    app.log('WatchVideo', {
      "videoname": `${section.title}`,
      "watchvideoduration": `${section.duration}s`,
      "TagContent": this.data.course.tagContent
    });

    courseService.completeCourseSection(data, (res) => {
      var isComplete = true;
      for (var i = 0; i < res.length; i++) {
        if (!res[i].isCompleted) {
          isComplete = false;
          break;
        }
      }

      self.setData({
        sections: res,
        isCompleteCourse: isComplete
      });

      if (isComplete && !this.data.course.isWatchCompleted) {
        userService.completeCourse(this);
      }

      for (var i = 0; i < sections.length; i++) {
        if (sections[i].id == section.id) {
          if (i != sections.length - 1) {
            self.setData({
              activeSection: sections[i + 1],
              mediaServiceFile: `https://${config.getDomain}/api/video/${sections[i + 1].id}.m3u8`
            });
            break;
          }
        }
      }
    });
  },
  onPlay: async function () {
    var that = this;
    var network = await courseService.checkNetworkType();
    this.setData({
      showVideoCover: false
    });
    if (that.data.playStatus) {
      this.setData({
        playStatus: true
      });
      return;
    }
    if (network.networkType != "wifi" && this.data.confirmNetworkType == false) {
      that.data.videoContext.stop();
      wx.showModal({
        title: '提示',
        content: '当前正在使用手机流量，是否要继续播放',
        success(res) {
          if (res.confirm) {
            that.data.videoContext.play();
            that.setData({
              playStatus: true,
              confirmNetworkType: true
            });
            wx.setStorageSync('confirmNetworkPlay', true);
          } else if (res.cancel) {
            that.data.videoContext.stop();
            that.setData({
              playStatus: false,
              confirmNetworkType: false
            });
          }
        }
      })
    } else {
      that.setData({
        confirmNetworkType: true,
        playStatus: true
      });
      that.data.videoContext.play();
    }
  },
  onPlayProgress(obj) {
    this.setData({
      watchTime: obj.detail.currentTime
    });
    if (parseInt(obj.detail.currentTime) == 5) {

    }

    if (parseInt(obj.detail.currentTime) == 15) {

    }
  },
  async onSection(obj) {
    var that = this;
    var section = obj.currentTarget.dataset["index"];
    var playStatus = this.data.playStatus;
    var confirmNetworkType = this.data.confirmNetworkType;
    var network = await courseService.checkNetworkType();
    if (!confirmNetworkType && network.networkType != "wifi") {
      wx.showModal({
        title: '提示',
        content: '当前正在使用手机流量，是否要继续播放',
        success(res) {
          if (res.confirm) {
            that.data.videoContext.play();
            that.setData({
              playStatus: true,
              activeSection: section,
              confirmNetworkType: true,
              mediaServiceFile: `https://${config.getDomain}/api/video/${section.id}.m3u8`,
              showVideoCover: true
            });
            wx.setStorageSync('confirmNetworkPlay', true);
          } else if (res.cancel) {
            that.data.videoContext.stop();
            that.setData({
              playStatus: false,
              confirmNetworkType: false
            });
          }
        }
      })
    }
    if (!that.data.confirmNetworkType) {
      return;
    }
    if (section.id == this.data.activeSection.id) {
      if (playStatus == true) {
        playStatus = false;
        this.data.videoContext.pause();
      } else {
        playStatus = true;
        this.data.videoContext.play();
      }
    } else {
      this.setData({
        activeSection: section,
        mediaServiceFile: `https://${config.getDomain}/api/video/${section.id}.m3u8`,
        showVideoCover: true
      });
      playStatus = true;
    }
    this.setData({
      playStatus: playStatus
    });

    app.log('WatchVideo', {
      "videoname": `${section.title}`,
      "watchvideoduration": `${section.duration}s`,
      "TagContent": this.data.course.tagContent
    });
  },
  onLoadComplete() {
    this.data.videoContext.play();
  },
  onScreenChange(obj) {

  },
  onShareAppMessage: function (option) {
    var userInfo = wx.getStorageSync('userInfo');
    let obj = {
      title: this.data.course.name,
      path: `/pages/operationCourseDetails/operationCourseDetails?isShare=true&id=${this.data.id}&sharedUserId=${userInfo?userInfo.id:null}`,
      imageUrl: this.data.course.coverImage.contentPath
    };
    return obj;
  },
  onShareTimeline: function (option) {
    let obj = {
      title: this.data.course.name,
      path: '/pages/operationCourseDetails/operationCourseDetails?id=' + this.data.id,
      imageUrl: this.data.course.coverImage.contentPath
    };
    return obj;
  },
  onfavorite: function () {
    var that = this;
    var favor = this.data.isFavor;
    var data = {
      "courseId": this.data.id,
      "sectionId": this.data.activeSection.id
    };
    if (that.data.canOperation) {
      if (favor) {
        courseService.deleteCollection(data, (res) => {
          if (res.statusCode == 200) {
            that.setData({
              isFavor: false,
              canOperation: false
            });
          }
          setTimeout(() => {
            that.setData({
              canOperation: true
            });
          }, this.data.operationInterval);
        });
      } else {
        courseService.addCollection(data, (res) => {
          if (res.statusCode == 200) {
            that.setData({
              isFavor: true,
              canOperation: false
            });
          }
          setTimeout(() => {
            that.setData({
              canOperation: true
            });
          }, this.data.operationInterval);
        });
      }
    } else {
      wx.showToast({
        title: '操作频繁,请稍后再试',
        icon: 'none'
      })
    }
  }
})