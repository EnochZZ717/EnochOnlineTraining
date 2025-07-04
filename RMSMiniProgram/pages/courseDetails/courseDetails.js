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
    show: false,
    course: {},
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
    completeSections: [],
    nodes: [],
    videoContext: null,
    activeSection: {},
    showQrCode: false,
    qrCode: '',
    playStatus: false,
    confirmNetworkType: false,
    isFavor: false,
    canOperation: true,
    operationInterval: 3500,
    watchTriggerInterval: 800,
    showPage: false,
    watchTime: 0,
    rawDescription: '',
    description: '',
    mediaServiceFile: '',
    watchFlag: true,
    isActive: false,
    isFirstLoad: true,
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
  onClose() {
    this.setData({
      showShare: false
    });
  },
  onDownload() {
    this.data.videoContext.pause();
    wx.navigateTo({
      url: '/pages/externalPage/downloadCourse/download',
    })
  },
  onCloseQrCode() {
    this.setData({
      showQrCode: false
    });
  },
  onSelect(event) {
    var self = this;
    if (event.detail.name == "二维码") {
      var data = {
        'sense': '',
        'page': 'pages/courseDetails/courseDetails',
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
    this.onClose();
  },
  onEnded() {
    var self = this;
    var section = self.data.course.sections[0];
    var userHistoryTransIns = [];
    var lastNode = section.nodes[section.nodes.length - 1];
    if (!lastNode.isCompleted) {
      var node = {
        "courseId": self.data.course.id,
        "sectionId": self.data.course.sections[0].id,
        "sectionNodeId": lastNode.id,
        "watchedTime": lastNode.endNumber,
        "isCompleted": true
      };
      lastNode.isCompleted = true;
      userHistoryTransIns.push(node);
      var data = {
        userHistoryTransIns: userHistoryTransIns
      };
      courseService.completeCourseNodes(data, (res) => {
        self.setData({
          nodes: section.nodes
        });
      });
    }
  },
  onLoadMetadata(obj) {
    var height = obj.detail.height;
    var width = obj.detail.width;
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
    var nodes = [];
    var activeSection = {};
    if (data.sections.length > 0) {
      nodes = data.sections[0].nodes.sort(function (a, b) {
        return a.sequence - b.sequence;
      });
      activeSection = nodes[0];
    }
    var description = data.description;
    if (data.description.length > 104) {
      data.description = data.description.substring(0, 104) + '......';
    }

    this.setData({
      rawDescription: description,
      description: data.description,
      course: data,
      nodes: nodes,
      pageName: '云课堂',
      activeSection: activeSection,
      isFavor: data.isFavor,
      id: data.id,
      mediaServiceFile: `https://${config.getDomain}/api/video/${data.sections[0].id}.m3u8`,
      isActive: true
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
              id: options.id,
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
              id: courseIntId.toString()
            });
          });
        }, 500);
        return;
      }

      //内部进入
      if (options.id != undefined) {
        self.setData({
          id: options.id,
        });

        courseService.getCourse(self.data.id, (data) => {
          self.bindCourse(data);
        });
        return;
      }


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
  async onAcviveProgress(obj) {
    var that = this;
    that.setData({
      isActive: true
    });
    var section = obj.currentTarget.dataset["index"];
    var playStatus = this.data.playStatus;
    var network = await courseService.checkNetworkType();
    if (!this.data.confirmNetworkType && network.networkType != "wifi") {
      wx.showModal({
        title: '提示',
        content: '当前正在使用手机流量，是否要继续播放',
        success(res) {
          if (res.confirm) {
            that.setData({
              playStatus: true,
              activeSection: section,
              confirmNetworkType: true
            });
            wx.setStorageSync('confirmNetworkPlay', true);
            that.data.videoContext.play();
            that.data.videoContext.seek(section.startNumber);
          } else if (res.cancel) {
            that.data.videoContext.stop();
            that.setData({
              confirmNetworkType: false,
              playStatus: false
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
      this.data.videoContext.play();
      this.data.videoContext.seek(section.startNumber + 1);
      playStatus = true;
    }
    this.setData({
      activeSection: section,
      playStatus: playStatus
    });
  },
  onLoadComplete() {
    this.data.videoContext.play();
  },
  onPause() {
    this.setData({
      playStatus: false
    });
  },
  onPlay: async function () {
    var that = this;
    var network = await courseService.checkNetworkType();
    var activeSection = this.data.activeSection;
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
            that.setData({
              playStatus: true,
              activeSection: that.data.course.sections[0].nodes[0],
              confirmNetworkType: true
            });
            that.data.videoContext.play();
            wx.setStorageSync('confirmNetworkPlay', true);
            var isFirstLoad = that.data.isFirstLoad;
            if (isFirstLoad) {
              var lastWatchtime = wx.getStorageSync(that.data.id);
              if (lastWatchtime > 0) {
                that.data.videoContext.seek(lastWatchtime);
              }
              that.setData({
                isFirstLoad: false
              });
            }
          } else if (res.cancel) {
            that.data.videoContext.stop();
            that.setData({
              confirmNetworkType: false
            });
          }
        }
      })
    } else {
      that.setData({
        activeSection: activeSection,
        confirmNetworkType: true,
        playStatus: true
      });
      var isFirstLoad = this.data.isFirstLoad;
      if (isFirstLoad) {
        var lastWatchtime = wx.getStorageSync(this.data.id);
        if (lastWatchtime > 0) {
          this.data.videoContext.seek(lastWatchtime);
        }
        this.setData({
          isFirstLoad: false
        });
      }
    }
  },
  onPlayProgress(obj) {
    var self = this;
    var watchTime = parseInt(obj.detail.currentTime);
    if (self.data.watchFlag) {
      self.validationNodeStatus(watchTime);
      self.setData({
        watchFlag: false,
        watchTime: watchTime
      });
      setTimeout(() => {
        self.setData({
          watchFlag: true
        });
      }, self.data.watchTriggerInterval);
    }
  },
  onReturn() {
    wx.setStorageSync(this.data.id, this.data.watchTime)
  },
  validationNodeStatus(watchTime) {
    var self = this;
    var node = self.data.activeSection;
    var nodes = self.data.nodes;
    var isActive = self.data.isActive;
    //需要提交到后台标识完成的节点
    var completeNodes = [];
    var activeSection = self.data.activeSection;
    //计算已经完成的节点
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var endNum = node.endNumber;
      if (watchTime == (endNum - 1)) {
        if (!node.isCompleted) {
          completeNodes.push(node);
        }
        nodes[i].isCompleted = true;
        activeSection = node;
        isActive = false;

        app.log('WatchVideo', {
          "videoname": `${node.title}`,
          "watchvideoduration": `${node.endNumber-node.startNumber}s`,
          "TagContent": this.data.course.tagContent
        });
        break;
      }
    }

    if (activeSection.isCompleted && !isActive) {
      //计算下一个节点
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].id == activeSection.id) {
          if (i != nodes.length - 1) {
            self.setData({
              activeSection: nodes[i + 1]
            });
            break;
          }
        }
      }
    }

    //提交到后台
    if (completeNodes.length > 0) {
      var userHistoryTransIns = [];
      completeNodes.forEach(x => {
        var node = {
          "courseId": self.data.course.id,
          "sectionId": self.data.course.sections[0].id,
          "sectionNodeId": x.id,
          "watchedTime": x.endNumber,
          "isCompleted": true
        };
        userHistoryTransIns.push(node);
      });
      var data = {
        userHistoryTransIns: userHistoryTransIns
      };

      courseService.completeCourseNodes(data, (res) => {});
    }

    //计算当前节点
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var startNum = node.startNumber;
      var endNum = node.endNumber;
      if (watchTime >= startNum && watchTime <= endNum) {
        activeSection = node;
        break;
      }
    }

    var completeCourseFlag = true;
    nodes.forEach(node => {
      if (!node.isCompleted) {
        completeCourseFlag = false;
      }
    });

    if (completeCourseFlag && !this.data.course.isWatchCompleted) {
      userService.completeCourse(this);
    }

    self.setData({
      nodes: nodes,
      isActive: isActive,
      activeSection: activeSection
    });

  },
  onHide() {
    this.data.videoContext.pause();
  },
  videoErrorCallback: function (params) {
    wx.showToast({
      title: '视频加载出错',
      icon: 'error',
      duration: 3000
    })
  },
  onScreenChange(obj) {

  },
  onShareAppMessage: function (option) {
    var userInfo = wx.getStorageSync('userInfo');
    let obj = {
      title: this.data.course.name,
      path: `/pages/courseDetails/courseDetails?isShare=true&id=${this.data.id}&sharedUserId=${userInfo?userInfo.id:null}`,
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
  onfavorite: function () {
    var that = this;
    var favor = this.data.isFavor;
    var data = {
      "courseId": this.data.id,
      "sectionId": this.data.course.sections[0].id,
      "sectionNodeId": this.data.activeSection.id
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