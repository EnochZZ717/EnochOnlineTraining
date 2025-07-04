const app = getApp()
var commonService = require('../../services/commonService.js');
var userPermissionService = require('../../services/userPermissionService.js');
var userService = require('../../services/userService.js');
var wechatService = require('../../services/wechatService.js');

Page({
  data: {
    areaColumns: [],
    areas: [],
    industries: [],
    showIndustryPopup: false,
    showSnPopup: false,
    showAreaPopup: false,
    inputUserName: '',
    inputPhoneNumber: '',
    inputEmail: '',
    inputCompany: '',
    inputTitle: '',
    inputSn: '',
    inputSchool: '',
    inputDepartment: '',
    snFocus: false,
    inputSns: [],
    inputArea: [],
    inputIndustry: '',
    inputIndustryName: '',
    inputCompanyType: '',
    inputOffice: '',
    inputCompanyTypeName: '',
    userNameFocus: true,
    phoneNumberFocus: false,
    emailFocus: false,
    companyFocus: false,
    titleFocus: false,
    industryFocus: false,
    SnFocus: false,
    areaFocus: false,
    userNameErrorMessage: '',
    phoneNumberErrorMessage: '',
    emailErrorMessage: '',
    schoolErrorMsesage: '',
    companyErrorMsesage: '',
    titleErrorMessage: '',
    industryErrorMessage: '',
    areaErrorMessage: '',
    officeErrorMsesage: '',
    companyTypeErrorMessage: '',
    departmentErrorMsesage: '',
    submit: false,
    isDisable: false,
    showCompanyTypePopup: false,
    compantTypes: [],
    checkDescription: false,
    checkStatement: false,
    industry2: '',
    disableIndustryInput: true,
    inputIndustryFocus: false,
    showStatumentPopup: false,
    displayGetPhoneNumberOps: false
  },
  onLoad() {
    var that = this;
    commonService.getIndustries(that);
    commonService.getAreas(that);
    commonService.getCommonCompanyTypes(that);
    var displayGetPhoneNumberOps = this.compareVersion(app.globalData.SDKVersion, '2.21.2') >= 0;
    that.setData({
      displayGetPhoneNumberOps: displayGetPhoneNumberOps
    });
  },
  compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }

    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])

      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }

    return 0
  },
  validateUserInput() {
    var flag = true;
    if (this.data.inputUserName.trim() == '') {
      flag = false;
      this.setData({
        userNameErrorMessage: '请输入用户名'
      });
    }

    if (this.data.inputPhoneNumber.trim() == '') {
      flag = false;
      this.setData({
        phoneNumberErrorMessage: '请输入手机号'
      });
    }

    if (this.data.inputEmail.trim() == '') {
      flag = false;
      this.setData({
        emailErrorMessage: '请输入邮箱'
      });
    }

    if (this.data.inputCompany.trim() == '') {
      flag = false;
      this.setData({
        companyErrorMsesage: '请输入公司名称'
      });
    }

    if (this.data.inputCompanyType.trim() == '') {
      flag = false;
      this.setData({
        companyTypeErrorMessage: '请选择企业类型'
      });
    }

    if (this.data.inputCompanyTypeName.trim() == '科研机构') {
      if (this.data.inputSchool.trim() == '') {
        flag = false;
        this.setData({
          schoolErrorMsesage: '请输入学院/课题组'
        });
      }
    }

    if (this.data.inputCompanyTypeName.trim() == '医院') {
      if (this.data.inputOffice.trim() == '') {
        flag = false;
        this.setData({
          officeErrorMsesage: '请输入科室'
        });
      }
    }

    if (this.data.inputCompanyTypeName.trim().indexOf('工业') != -1) {
      if (this.data.inputDepartment.trim() == '') {
        flag = false;
        this.setData({
          departmentErrorMsesage: '请输入部门'
        });
      }
    }

    if (this.data.inputTitle.trim() == '') {
      flag = false;
      this.setData({
        titleErrorMessage: '请输入职称'
      });
    }

    if (this.data.inputIndustry == '') {
      flag = false;
      this.setData({
        industryErrorMessage: '请选择所属行业'
      });
    }

    if (this.data.disableIndustryInput) {
      if (this.data.inputIndustry == null) {
        flag = false;
        this.setData({
          industryErrorMessage: '请选择所属行业'
        });
      }
    } else {
      if (this.data.industry2.trim() == '') {
        flag = false;
        this.setData({
          industryErrorMessage: '请输入所属行业'
        });
      }
    }


    if (this.data.inputArea == '') {
      flag = false;
      this.setData({
        areaErrorMessage: '请选择区域'
      });
    }

    if (flag) {
      if (!this.data.checkDescription) {
        this.setData({
          showStatumentPopup: true
        });
        return;
      }

      if (!this.data.checkStatement) {
        this.setData({
          showStatumentPopup: true
        });
        return;
      }
    }

    if (!this.isPhone(this.data.inputPhoneNumber)) {
      flag = false;
      this.setData({
        phoneNumberErrorMessage: '请输入正确的手机号'
      });
    }

    if (!this.isEmail(this.data.inputEmail)) {
      flag = false;
      this.setData({
        emailErrorMessage: '请输入正确的邮箱'
      });
    }

    return flag;
  },
  rejectStatement() {
    this.setData({
      showStatumentPopup: false
    });
  },
  agreeStatement() {
    this.setData({
      showStatumentPopup: false,
      checkDescription: true,
      checkStatement: true
    });
    this.register();
  },
  industryChange(event) {
    this.setData({
      industry2: event.detail
    });
  },
  userNameChange(obj) {
    this.setData({
      inputUserName: obj.detail
    });
    if (obj.detail != '') {
      this.setData({
        userNameErrorMessage: ''
      });
    }
  },
  compeleteUserNameInput(obj) {
    if (obj.detail.trim() != '') {
      this.setData({
        phoneNumberFocus: true
      });
    } else {
      this.setData({
        userNameErrorMessage: '请输入用户名'
      });
    }
  },
  phoneNumberChange(obj) {
    this.setData({
      inputPhoneNumber: obj.detail
    });

    if (obj.detail != '') {
      this.setData({
        phoneNumberErrorMessage: ''
      });
    }

    if (!this.isPhone(obj.detail)) {
      this.setData({
        phoneNumberErrorMessage: '请输入正确的手机号'
      });
      return;
    }
  },
  compeletePhoneNumberInput() {
    var phoneNumber = this.data.inputPhoneNumber;
    if (!this.isPhone(phoneNumber)) {
      this.setData({
        phoneNumberErrorMessage: '请输入正确的手机号'
      });
      return;
    }

    this.setData({
      emailFocus: true,
      phoneNumberErrorMessage: ''
    });
  },
  emailChange(obj) {
    this.setData({
      inputEmail: obj.detail
    });

    if (obj.detail != '') {
      this.setData({
        emailErrorMessage: ''
      });
    }

    if (!this.isEmail(obj.detail)) {
      this.setData({
        emailErrorMessage: '请输入正确的邮箱'
      });
      return;
    }
  },
  compeleteEmailInput() {
    var email = this.data.inputEmail;
    if (!this.isEmail(email)) {
      this.setData({
        emailErrorMessage: '请输入正确的邮箱'
      });
      return;
    }

    this.setData({
      titleFocus: true,
      emailErrorMessage: ''
    });
  },
  companyChange(obj) {
    this.setData({
      inputCompany: obj.detail,
    });

    if (obj.detail != '') {
      this.setData({
        companyErrorMsesage: ''
      });
    }
  },
  schoolChange(obj) {
    this.setData({
      inputSchool: obj.detail,
    });

    if (obj.detail != '') {
      this.setData({
        schoolErrorMsesage: ''
      });
    }
  },
  departmentChange(obj) {
    this.setData({
      inputDepartment: obj.detail,
    });

    if (obj.detail != '') {
      this.setData({
        departmentErrorMsesage: ''
      });
    }
  },
  officeChange(obj) {
    this.setData({
      inputOffice: obj.detail,
    });

    if (obj.detail != '') {
      this.setData({
        officeErrorMsesage: ''
      });
    }
  },
  isPhone(value) {
    if (!/^1(3|4|5|7|8|9)\d{9}$/.test(value)) {
      return false
    } else {
      return true
    }
  },
  isEmail(email) {
    if (/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(email)) {
      return true
    } else {
      return false;
    }
  },
  compeleteCompanyInput(obj) {
    if (obj.detail.trim() != '') {
      this.getIndustry();
    } else {
      this.setData({
        companyErrorMsesage: '请输入公司名称'
      });
    }
  },
  titleChange(obj) {
    this.setData({
      inputTitle: obj.detail
    });

    if (obj.detail != '') {
      this.setData({
        titleErrorMessage: ''
      });
    }
  },
  compeleteTitleInput() {
    var title = this.data.inputTitle;
    if (title.trim() == '') {
      this.setData({
        titleErrorMessage: '请输入职称'
      });
      return;
    }

    this.setData({
      titleErrorMessage: ''
    });

    this.getCompanyType();
  },
  getArea() {
    this.setData({
      showAreaPopup: true
    });
  },
  onChangeArea(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    var selectArea = event.detail.value;
    var province = this.data.areas.filter(x => x.name == selectArea[0])[0];
    picker.setColumnValues(1, province.cities.map(x => x.name));
    this.setData({
      areaErrorMessage: ''
    });
  },
  onCancelArea() {
    this.setData({
      showAreaPopup: false
    });
  },
  onConfirmArea(event) {
    const {
      values,
    } = event.detail;
    this.setData({
      showAreaPopup: false,
      inputArea: event.detail.value,
      areaErrorMessage: ''
    });
  },
  getIndustry() {
    var flag = false;
    if (this.data.disableIndustryInput) {
      flag = true;
    }
    this.setData({
      showIndustryPopup: flag
    });
  },
  getCompanyType() {
    this.setData({
      showCompanyTypePopup: true
    });
  },
  getSns() {
    this.setData({
      showSnPopup: true
    });
  },
  onCloseSnPopup() {
    this.setData({
      showSnPopup: false
    });
  },
  onSnGuide() {
    wx.navigateTo({
      url: '../snGuide/snGuide',
    })
  },
  getStatement() {
    wx.navigateTo({
      url: '../externalPage/statement/statement',
    })
  },
  register: async function () {
    var self = this;
    if (!this.validateUserInput()) {
      return;
    }

    if (this.data.submit) {
      return;
    }

    this.setData({
      submit: true,
      isDisable: true
    });

    var area = this.data.inputArea;
    var province = this.data.areas.filter(x => x.name == area[0])[0];
    var city = province.cities.filter(x => x.name == area[1])[0];
    var data = {
      "name": this.data.inputUserName,
      "phoneNumber": this.data.inputPhoneNumber,
      "email": this.data.inputEmail,
      "jobTitle": this.data.inputTitle,
      "company": this.data.inputCompany,
      "businessTypeID": this.data.inputCompanyType,
      "seriesNumbers": this.data.inputSns.join(','),
      "industryID": this.data.inputIndustry,
      "provinceId": province.id,
      "cityId": city.id,
      "districtId": null,
      "isVip": false,
      "researchGroup": "",
      "researchInterests": "",
      "sampleTypeId": null,
      "college": this.data.inputSchool,
      "weChatImagePath": "",
      "technicalOffice": this.data.inputOffice,
      "department": this.data.inputDepartment,
      "isMailReceiver": this.data.checkDescription,
      "industryText": this.data.industry2,
      "invitedBy": ""
    }

    app.log('注册', {
      "name": data.name,
      "mobile": data.phoneNumber,
      "email": data.email,
      "title": data.jobTitle,
      "miccustomerarea": this.data.inputCompanyTypeName,
      "company": data.company,
      "industry": this.data.inputIndustryName,
      "shebeixuliesnhao": this.data.inputSns.join(','),
      "rmsarea": this.data.inputArea
    });

    var userProfile = await userPermissionService.getUserProfile();
    if (userProfile.errMsg == "getUserProfile:ok") {
      data.weChatImagePath = userProfile.userInfo.avatarUrl;
    }

    //分享者
    var sharedUserId = wx.getStorageSync('sharedUserId');
    if (sharedUserId) {
      data.invitedBy = sharedUserId;
    }

    var groupId = wx.getStorageSync('groupId');
    userPermissionService.register(data).then(x => {
      if (x.status != "Failed") {
        var token = wx.getStorageSync('token');
        token.code = 1;
        token.user = data;
        wx.setStorageSync('token', token);
        self.getOpenId();
        if (groupId) {
          wx.redirectTo({
            url: '/pages/memberGroup/joinGroup/joinGroup?id=' + groupId,
          })
          return;
        } else {
          if (sharedUserId) {
            wx.removeStorageSync('sharedUserId');
          }
          wx.navigateBack({
            delta: 1
          })
        }

      } else {
        wx.showToast({
          title: '服务器繁忙,请稍后再试',
          icon: 'none'
        })
      }
    });
  },
  getOpenId() {
    wx.login({
      success(res) {
        var code = res.code;
        userPermissionService.getOpenId(code, (res) => {
          app.identify(res.data.openID, res.data.unionID);
        });
      }
    })
  },
  getPhoneNumber(e) {
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wechatService.getPhoneNumber(e.detail.code, this, app);
    }
  },
  onConfirmIndustry(event) {
    const {
      value,
    } = event.detail;
    if (value.id != -1) {
      this.setData({
        industryErrorMessage: ''
      });
    }
    this.setData({
      showIndustryPopup: false,
      inputIndustry: value.id,
      inputIndustryName: value.text
    });


    var flag = true;
    if (value.text.indexOf('其他') != -1) {
      flag = false;
      this.setData({
        disableIndustryInput: flag,
        inputIndustryName: '',
        inputIndustry: null,
      });
      setTimeout(() => {
        this.setData({
          inputIndustryFocus: true
        });
      }, 100);
    } else {
      this.setData({
        disableIndustryInput: flag,
        inputIndustryFocus: false,
        industry2: ''
      });
      this.getSns();
    }
  },
  onConfirmCompanyType(event) {
    const {
      value,
    } = event.detail;
    if (value.id != -1) {
      this.setData({
        companyTypeErrorMessage: ''
      });
    }
    this.setData({
      showCompanyTypePopup: false,
      inputCompanyType: value.id,
      inputCompanyTypeName: value.text,
      companyFocus: true
    });

  },
  onSnChange(event) {
    this.setData({
      inputSn: event.detail
    });
  },
  onCompleteSnInput() {
    var sn = this.data.inputSn;
    var sns = this.data.inputSns;
    var self = this;
    if (sn == '') {
      wx.showToast({
        title: '请输入SN号',
        icon: 'none'
      })
      return;
    }

    //是否是数字
    if (isNaN(sn)) {
      wx.showToast({
        title: 'SN输入格式不正确',
        icon: 'none'
      })
      return;
    }

    if (sns.indexOf(sn) != -1) {
      wx.showToast({
        title: 'SN号已经存在',
        icon: 'none'
      })
      return;
    }

    userService.validationSnNumber(sn, (res) => {
      if (res) {
        sns.push(sn);
        self.setData({
          inputSns: sns,
          inputSn: ''
        });
      } else {
        wx.showToast({
          title: 'SN不存在',
          icon: 'none'
        })
      }
    });
  },
  onRemoveSn(obj) {
    var sn = obj.currentTarget.dataset['index'];
    var sns = this.data.inputSns;
    var index = sns.indexOf(sn);
    sns.splice(index, 1);
    this.setData({
      inputSns: sns
    });
  },
  onChangeIndustry(event) {
    const {
      value,
    } = event.detail;
    if (value.id != -1) {
      this.setData({
        industryErrorMessage: ''
      });
    }
  },
  onChangeCompanyType(event) {
    const {
      value,
    } = event.detail;
    if (value.id != -1) {
      this.setData({
        companyTypeErrorMessage: ''
      });
    }
  },
  onCancelIndustry() {
    this.setData({
      showIndustryPopup: false
    });
  },
  onCompanyType() {
    this.setData({
      showCompanyTypePopup: false
    });
  },
  onChangeDescription(event) {
    this.setData({
      checkDescription: event.detail,
    });
  },
  onChangeStatement(event) {
    this.setData({
      checkStatement: event.detail,
    });
  },
})