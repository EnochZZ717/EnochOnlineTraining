const app = getApp()
var commonService = require('../../services/commonService.js');
const memberGroupService = require('../../services/memberGroupService.js');

Page({
  data: {
    navHeight: 0,
    size: 1,
    listData: [],
    extraNodes: [],
    pageMetaScrollTop: 0,
    scrollTop: 0,
    showImagesPopup: false,
    images: [],
    selectedImage: null,
    groupName: '',
    showCoursePopup: false,
    submit: false,
    isDisable: false,
    marginLeft: '42px'
  },
  onLoad() {
    wx.removeStorageSync('selectedCourse');
    wx.removeStorageSync('updatedCourses');
    this.drag = this.selectComponent('#drag');
    this.drag.init();
    this.setData({
      navHeight: app.globalData.navHeight
    })
    commonService.getGroupImages(this);
  },
  addCourse() {
    wx.navigateTo({
      url: './course-item/course-item',
    })
  },
  onSave() {
    var selectedImage = this.data.selectedImage;
    var name = this.data.groupName;
    var courses = this.data.listData;
    if (!selectedImage) {
      wx.showToast({
        title: '请选择头像',
        icon: 'none'
      })
      return;
    }
    if (name.trim() == '') {
      wx.showToast({
        title: '请输入小组名称',
        icon: 'none'
      })
      return;
    }

    if (courses == 0) {
      wx.showToast({
        title: '请添加课程',
        icon: 'none'
      })
      return;
    }

    for (var i = 0; i < courses.length; i++) {
      courses[i] = {
        "courseId": courses[i].id,
        "sequence": i
      };
    }

    var data = {
      "name": name.trim(),
      "imageLibraryId": selectedImage.id,
      "memberGroupSelectdCourses": courses
    };

    memberGroupService.addMemberGroup(data, this);
  },
  onReady: function () {

  },
  onShow: function () {
    var selctedCourse = wx.getStorageSync('selectedCourse');
    if (selctedCourse) {
      this.setData({
        listData: selctedCourse
      });
      this.drag = this.selectComponent('#drag');
      this.drag.init();
    }
  },
  groupNameChange(obj) {
    this.setData({
      groupName: obj.detail
    });
  },
  getGroupImages() {
    this.setData({
      showImagesPopup: true
    });
  },
  onSelectImage(item) {
    var image = item.currentTarget.dataset['index'];
    this.setData({
      selectedImage: image,
      showImagesPopup: false
    });
  },
  onCloseImagePopup() {
    this.setData({
      showImagesPopup: false
    });
  },
  sortEnd(e) {
    this.setData({
      listData: e.detail.listData
    });
    wx.setStorageSync('selectedCourse', e.detail.listData)
  },
  change(e) {},
  sizeChange(e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.setData({
      size: e.detail.value
    });
    this.drag.columnChange();
  },
  removeCourse(e) {
    var course = e.detail.data;
    var courses = this.data.listData;
    for (var i = 0; i < courses.length; i++) {
      if (courses[i].id == course.id) {
        courses.splice(i, 1);
        break;
      }
    }
    this.setData({
      listData: courses
    });

    wx.setStorageSync('selectedCourse', courses);
    this.drag = this.selectComponent('#drag');
    this.drag.init();
  },
  toggleFixed(e) {
    let key = e.currentTarget.dataset.key;

    let {
      listData
    } = this.data;

    listData[key].fixed = !listData[key].fixed

    this.setData({
      listData: listData
    });
  },
  scroll(e) {
    this.setData({
      pageMetaScrollTop: e.detail.scrollTop
    })
  },
  // 页面滚动
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    });
  },
})