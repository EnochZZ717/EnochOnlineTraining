var api = require('../utils/api.js');
var wxRequest = require('../utils/wxRequest.js')

function getGroupCourses(page) {
  wxRequest.getRequest(api.getGroupCourses()).then(res => {
    if (res.data.length > 0) {
      res.data.forEach(x => {
        if (x.name.length > 28) {
          x.name = x.name.substring(0, 28) + '...';
        }
      });
    }
    page.setData({
      courses: res.data
    });
  });
}

function addMemberGroup(data, page) {
  page.setData({
    submit: true,
    isDisable: true,
  });
  wxRequest.putRequest(api.addMemberGroup(), data).then(res => {
    if (res.statusCode == 200) {
      wx.removeStorageSync('selectedCourse');
      wx.setStorageSync('refreshGroup', true);
      wx.navigateBack({
        delta: 1,
      })
    } else {
      wx.showToast({
        title: '数据保存失败',
        icon: 'none'
      })
    }
  });
}

function getOperationContainer(page) {
  var token = wx.getStorageSync('token');
  if (token.user.isMemberGroupLeader) {
    page.setData({
      showOperationContainer: true
    });
  }
}

function getMemberGroups(page) {
  wxRequest.getRequest(api.getMemberGroups()).then(res => {
    if (res.data.length > 0) {
      res.data.forEach(x => {
        if (x.name.length > 12) {
          x.name = x.name.trim().substring(0, 12) + '...';
        }
      });
    }

    var groups = res.data;
    if (groups.length > 0) {
      var ownGroups = groups.filter(x => x.isGroup);
      if (ownGroups.length > 0) {
        page.setData({
          hasGroups: true
        });
      }
    }

    page.setData({
      groups: res.data
    });
  });
}

function deleteMemberGroups(data, page) {
  wxRequest.deleteRequest(api.deleteMemberGroups(), data).then(res => {
    if (res.statusCode == 200) {
      wx.setStorageSync('refreshGroup', true);
      wx.navigateBack({
        delta: 1,
      });
    } else {
      wx.showToast({
        title: '获取数据失败,请稍后再试',
        icon: 'none'
      })
    }
  });
}

function getGroupStatus(id, page) {
  wxRequest.getRequest(api.getGroupStatus(id)).then(res => {
    if (res.data.length > 0) {
      res.data.forEach(x => {
        if (x.name.length > 28) {
          x.name = x.name.substring(0, 28) + '...';
        }
      });
    }
    page.setData({
      courses: res.data
    });
  });
}

function joinGroup(groupId, page, sharedUserId) {
  wxRequest.putRequest(api.joinGroup(groupId, sharedUserId), {}).then(res => {
    // - 1 已经加入过 , -2小组被删除
    if (res.data == -1) {
      wx.redirectTo({
        url: '/pages/memberGroup/memberGroup',
      })
    } else if (res.data == -2) {
      page.setData({
        message: '要加入的学习小组已被删除',
        showContainer: true,
        status: '-2'
      });
    } else {
      //更新权限
      var token = wx.getStorageSync('token');
      token.user.isMemberGroupMember = true;
      wx.setStorageSync('token', token)
      wx.removeStorageSync('groupId');
      wx.removeStorageSync('sharedUserId');
      page.setData({
        message: '你已经成功加入学习小组, 点击下方按钮查看',
        showContainer: true,
        status: '0'
      });
    }
  });
}

function getGroupSelectedCourses(groupId, page) {
  wxRequest.getRequest(api.getGroupSelectedCourses(groupId)).then(res => {
    if (res.data.length > 0) {
      res.data.forEach(x => {
        if (x.name.length > 28) {
          x.name = x.name.substring(0, 28) + '...';
        }
      });
    }
    page.setData({
      courses: res.data,
      defaultSelectCourseCount: res.data.filter(x => x.isSelected).length
    });
  });
}

function updateGroupSelectedCourses(groupId, data) {
  wxRequest.postRequest(api.updateGroupSelectedCourses(groupId), data).then(res => {
    wx.setStorageSync('refreshCourse', true)
    wx.setStorageSync('refreshGroup', true);
    wx.navigateBack({
      delta: 1,
    });
  });
}

function getGroupMembers(groupId, page, fn) {
  wxRequest.getRequest(api.getGroupMembers(groupId)).then(res => {
    page.setData({
      users: res.data
    });

    if (fn) {
      fn();
    }
  });
}

function removeGroupMember(userId, groupId, page) {
  wxRequest.deleteRequest(api.removeGroupMember(groupId, userId), []).then(res => {
    getGroupMembers(groupId, page);
    page.setData({
      activeUser: ''
    });
  });
}

function getGroupDetail(groupId, page, fn) {
  wxRequest.getRequest(api.getGroupDetail(groupId)).then(res => {
    if (res.data.groupMangedCourses) {
      res.data.groupMangedCourses.forEach(x => {
        if (x.name.length > 28) {
          x.name = x.name.substring(0, 28) + '...';
        }
      });
    }
    var selectedCourses = res.data.groupMangedCourses.filter(x => x.isSelected == true);
    page.setData({
      listData: selectedCourses,
      selectedImage: {
        contentPath: res.data.imagePath,
        id: res.data.imageId
      },
      groupName: res.data.name
    });
    wx.setStorageSync('updatedCourses', selectedCourses);
    wx.setStorageSync('allCourses', res.data.groupMangedCourses)
    page.drag = page.selectComponent('#drag');
    page.drag.init();
    if (fn) {
      fn();
    }
  });
}

function updateGroup(data, page) {
  wxRequest.postRequest(api.updateGroup(), data).then(res => {
    wx.removeStorageSync('updatedCourses');
    wx.removeStorageSync('allCourses');
    wx.setStorageSync('refreshCourse', true);
    wx.setStorageSync('refreshGroup', true);
    wx.navigateBack({
      delta: 1,
    })
  });

}

module.exports = {
  getGroupCourses: getGroupCourses,
  addMemberGroup: addMemberGroup,
  getMemberGroups: getMemberGroups,
  deleteMemberGroups: deleteMemberGroups,
  getGroupStatus: getGroupStatus,
  joinGroup: joinGroup,
  getOperationContainer: getOperationContainer,
  getGroupSelectedCourses: getGroupSelectedCourses,
  updateGroupSelectedCourses: updateGroupSelectedCourses,
  getGroupMembers: getGroupMembers,
  removeGroupMember: removeGroupMember,
  getGroupDetail: getGroupDetail,
  updateGroup: updateGroup
}