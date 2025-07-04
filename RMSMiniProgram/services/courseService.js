var api = require('../utils/api.js');
var wxRequest = require('../utils/wxRequest.js')

function getCourse(courseId, fn) {
  wxRequest.getRequest(api.getCourse(courseId)).then(res => {
    if (res.statusCode == 200) {
      fn(res.data);
    } else {
      wx.redirectTo({
        url: '/pages/error/error?type=NoPermission',
      });
    }
  });
}

function getShareCourse(courseId, shareUserId, fn) {
  wxRequest.getRequest(api.getShareCourse(courseId, shareUserId)).then(res => {
    if (res.statusCode == 403) {
      wx.redirectTo({
        url: '/pages/error/error?type=NoPermission',
      });
    } else {
      fn(res.data);
    }
  });
}

function getCourseExam(courseId, fn) {
  wxRequest.getRequest(api.getCourseExam(courseId)).then(res => {
    fn(res.data);
  });
}

function postCourseExam(data, fn) {
  wxRequest.postRequest(api.postCourseExam(), data).then(res => {
    fn(res.data);
  });
}

function checkNetworkType() {
  return new Promise(function (reslove, reject) {
    wx.getNetworkType({
      success(res) {
        reslove(res);
      },
      fail(res) {
        reject();
      }
    })
  })
}

function getSectionsStatus(courseId, fn) {
  wxRequest.getRequest(api.getSectionsStatus(courseId)).then(res => {
    fn(res.data);
  });
}

function getCourseQRCode(data, fn) {
  wxRequest.postRequest(api.getCourseQRCode(), data).then(res => {
    fn(res.data);
  });
}

function addCollection(data, fn) {
  wxRequest.putRequest(api.addCollection(), data).then(res => {
    fn(res);
  });
}

function deleteCollection(data, fn) {
  wxRequest.deleteRequest(api.deleteCollection(), data).then(res => {
    fn(res);
  });
}

function completeCourseSection(data, fn) {
  wxRequest.postRequest(api.completeCourseSection(), data).then(res => {
    fn(res.data);
  });
}

function courseDeepSearch(data, page) {
  wxRequest.getRequest(api.courseDeepSearch(data)).then(res => {
    var hasData = true;
    if (res.data.publicCourses.length == 0 && res.data.opeartionCourses.length == 0 && res.data.currentMemberGroupCourses.length == 0) {
      hasData = false;
    }

    res.data.publicCourses.forEach(x => {
      if (x.name.length > 44) {
        x.name = x.name.substring(0, 44) + '...';
      }
    });

    res.data.opeartionCourses.forEach(x => {
      if (x.name.length > 44) {
        x.name = x.name.substring(0, 44) + '...';
      }
    });

    res.data.currentMemberGroupCourses.forEach(x => {
      if (x.name.length > 44) {
        x.name = x.name.substring(0, 44) + '...';
      }
    });

    page.setData({
      courses: res.data,
      hasData: hasData
    })
  });
}

function getVideoFromMediaService(data, fn) {
  wxRequest.getRequest(api.getVideoFromMediaService(data)).then(res => {
    fn(res.data);
  });
}

function completeCourseNodes(data, fn) {
  wxRequest.postRequest(api.completeCourseNodes(), data).then(res => {
    fn(res.data);
  });
}

function addCourseHistory(data, fn) {
  wxRequest.putRequest(api.addCourseHistory(), data).then(res => {
    fn(res.data);
  });
}


module.exports = {
  getCourse: getCourse,
  getCourseExam: getCourseExam,
  getCourseQRCode: getCourseQRCode,
  checkNetworkType: checkNetworkType,
  addCollection: addCollection,
  deleteCollection: deleteCollection,
  postCourseExam: postCourseExam,
  getSectionsStatus: getSectionsStatus,
  completeCourseSection: completeCourseSection,
  courseDeepSearch: courseDeepSearch,
  getVideoFromMediaService: getVideoFromMediaService,
  completeCourseNodes: completeCourseNodes,
  addCourseHistory: addCourseHistory,
  getShareCourse: getShareCourse
}