import config from 'config.js';
var domain = config.getDomain;
var pageSize = config.getPageSize;
var defultSortFailed = config.getDefaultSortFailed;
var HOST_URI = 'https://' + domain + '/api/';

module.exports = {
  getBanners: function (data) {
    var url = HOST_URI + `home?pageSize=${pageSize}&pageNo=` + data.pageNo;
    return url;
  },
  getPhoneNumber: function (code) {
    var url = HOST_URI + `wxacode/wechat/phoneNumber?code=${code}`;
    return url;
  },
  getHotKeys: function () {
    var url = HOST_URI + 'SystemConfig/QuickSearchConfig';
    return url;
  },
  getUserInfo: function () {
    var url = HOST_URI + 'User';
    return url;
  },
  getUserCollections: function () {
    var url = HOST_URI + 'Collections';
    return url;
  },
  updateUserInfo: function () {
    var url = HOST_URI + 'User/Part';
    return url;
  },
  addCourseHistory: function () {
    var url = HOST_URI + 'BroadcastHistory/Log';
    return url;
  },
  getUserSn: function () {
    var url = HOST_URI + 'User/SeriesNumber';
    return url;
  },
  loadUserCourseHistory: function () {
    var url = HOST_URI + 'BroadcastHistory/Log';
    return url;
  },
  getCompanyTypes: function () {
    var url = HOST_URI + 'SystemConfig/BussinessType';
    return url;
  },
  courseDeepSearch: function (data) {
    var url = HOST_URI + `course/deepsearch/` + data.text;
    return url;
  },
  getCloudClassroomFilter: function () {
    var url = HOST_URI + 'SystemConfig/TagConfig';
    return url;
  },
  getOperateFilter: function () {
    var url = HOST_URI + 'SystemConfig/CourseCategoryConfig';
    return url;
  },
  getVideoFromMediaService: function (sectionId) {
    var url = HOST_URI + `video/${sectionId}.m3u8`;
    return url;
  },
  saveSn: function () {
    var url = HOST_URI + 'User/SeriesNumber';
    return url;
  },
  getCourseQRCode: function () {
    var url = HOST_URI + 'Wxacode';
    return url;
  },
  getSectionsStatus: function (courseId) {
    var url = HOST_URI + courseId + '/section';
    return url;
  },
  completeCourseSection: function (courseId) {
    var url = HOST_URI + 'sections';
    return url;
  },
  getToken: function (code) {
    var url = HOST_URI + 'login/token?code=' + code;
    return url;
  },
  register: function () {
    var url = HOST_URI + 'User'
    return url;
  },
  postCourseExam: function (params) {
    var url = HOST_URI + 'examresult'
    return url;
  },
  getAreas: function () {
    var url = HOST_URI + 'SystemConfig/Provinces'
    return url;
  },
  addCollection: function () {
    var url = HOST_URI + 'Collection'
    return url;
  },
  deleteCollection: function () {
    var url = HOST_URI + 'Collection/'
    return url;
  },
  getIndustries: function () {
    var url = HOST_URI + 'SystemConfig/Industries'
    return url;
  },
  getCloudClassroomCourses: function (obj) {
    var url = HOST_URI + `course/public?pageSize=${pageSize}&pageNo=${obj.pageNo}`;

    if (obj.sortField != 'default') {
      url += '&sortOrder=' + obj.sortOrder;
    }

    if (obj.sortField) {
      url += '&SortField=' + obj.sortField;
    } else {
      url += '&SortField=' + defultSortFailed
    }

    return url;
  },
  getOperationGuideCourse: function (obj) {
    var url = HOST_URI + `course/operation?pageSize=${pageSize}&pageNo=${obj.pageNo}`;

    if (obj.sortField != 'default') {
      url += '&sortOrder=' + obj.sortOrder;
    }

    if (obj.sortField) {
      url += '&SortField=' + obj.sortField;
    } else {
      url += '&SortField=' + defultSortFailed
    }

    return url;
  },
  completeCourseNodes: function () {
    var url = HOST_URI + 'BroadcastHistory/Batch';
    return url;
  },
  getCourse: function (courseId) {
    var url = HOST_URI + 'course/' + courseId;
    return url;
  },
  getSnGuide: function () {
    var url = HOST_URI + 'SystemConfig/GuideVideos';
    return url;
  },
  getGroupImages: function () {
    var url = HOST_URI + 'SystemConfig/GroupImages';
    return url;
  },
  getGroupCourses: function () {
    var url = HOST_URI + 'MemberGroup/GroupManagedCourse';
    return url;
  },
  getGroupSelectedCourses: function (membergroupid) {
    var url = HOST_URI + `MemberGroup/${membergroupid}/GroupMangedCourse/Status`;
    return url;
  },
  updateGroupSelectedCourses: function (membergroupid) {
    var url = HOST_URI + `MemberGroup/${membergroupid}/GroupMangedCourse/Status`;
    return url;
  },
  getGroupMembers: function (membergroupid) {
    var url = HOST_URI + `MemberGroup/${membergroupid}/MemberLearnningStatus`;
    return url;
  },
  removeGroupMember: function (membergroupid, userId) {
    var url = HOST_URI + `MemberGroup/${membergroupid}/User/${userId}`;
    return url;
  },
  addMemberGroup: function () {
    var url = HOST_URI + 'MemberGroup';
    return url;
  },
  getMemberGroups: function () {
    var url = HOST_URI + 'MemberGroups';
    return url;
  },
  deleteMemberGroups: function () {
    var url = HOST_URI + 'MemberGroup';
    return url;
  },
  getGroupStatus: function (membergroupid) {
    var url = HOST_URI + `MemberGroup/${membergroupid}/Course/Status`;
    return url;
  },
  joinGroup: function (membergroupid, sharedUserId) {
    var url = HOST_URI + `MemberGroup/${membergroupid}/User/${sharedUserId}`;
    return url;
  },
  validationSnNumber: function (sn) {
    var url = HOST_URI + `User/SeriesNumber/Exsit?snNumbers=${sn}`;
    return url;
  },
  getGroupDetail: function (membergroupid) {
    var url = HOST_URI + `MemberGroup/Detail/${membergroupid}`;
    return url;
  },
  getNewToken: function () {
    var url = HOST_URI + `Login/Token/Refresh`;
    return url;
  },
  updateGroup: function () {
    var url = HOST_URI + `MemberGroup`;
    return url;
  },
  getShareCourse: function (courseId, shareUserId) {
    var url = HOST_URI + `course/share/${courseId}/shareUserId/${shareUserId}`;
    return url;
  },
  getCourseExam: function (courseId) {
    var url = HOST_URI + 'paper/course/' + courseId;
    return url;
  },
  completeCourse: function (courseId) {
    var url = HOST_URI + `User/course/watchcompleted?courseID=${courseId}`;
    return url;
  },
  getOpenId: function (code) {
    var url = HOST_URI + `Wxacode/Wechat/Id?code=${code}`;
    return url;
  }
};