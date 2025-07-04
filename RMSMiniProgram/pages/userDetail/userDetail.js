const app = getApp()
import config from '../../utils/config.js';
var userService = require('../../services/userService.js');
var commonService = require('../../services/commonService.js');

Page({
  data: {
    areaColumns: [],
    areas: [],
    industries: [],
    userInfo: null,
    isDisable: false,
    submit: false,
    inputUserName: '',
    inputPhoneNumber: '',
    inputEmail: '',
    inputJobTitle: '',
    inputCompany: '',
    inputSns: '',
    inputIndustry: '',
    inputIndustryName: '',
    inputArea: '',
    showSnPopup: false,
    inputSn: '',
    showIndustryPopup: false,
    showAreaPopup: false,
    industryIndex: 0,
    provinceIndex: 0,
    showCompanyTypeModal: false,
    inputCompanyType: '',
    comoanyTypeIndex: 0,
    compantTypes: [],
    inputSchool: '',
    inputOffice: '',
    inputDepartment: '',
    industry2: '',
    disableIndustryInput: true,
    inputIndustryFocus: false,
    actions: [
      {
        name: '微信头像',
        subname: '使用微信头像',
        openType: 'getUserInfo'
      },
    ],
    showImageActions: false,
    userImage: '',
    updateSnInput: '',
    saveW: 450,
    saveH: 400,
    showConfirmInput:false,
    confirmSnInput:true
  },
  getUserImage() {
    this.setData({
      showImageActions: true
    });
  },
  onUpdateSnInput(obj) {
    var self = this;
    var sn = obj.detail;
    var sns = this.data.inputSns;
    if (sn.trim() == '') {
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

    var index = sns.indexOf(this.data.updateSnInput);
    sns.splice(index, 1);

    userService.validationSnNumber(sn, (res) => {
      if (res) {
        sns.push(sn);
        self.setData({
          inputSns: sns
        });
      } else {
        sns.push(self.data.updateSnInput);
        self.setData({
          updateSnInput: ''
        });
        wx.showToast({
          title: 'SN不存在',
          icon: 'none'
        })
      }
    });

  },
  onGetUserInfo(e) {
    if (e.detail.errMsg == 'getUserProfile:ok') {
      this.setData({
        userImage: e.detail.userInfo.avatarUrl
      });
    }

    this.setData({
      showImageActions: false
    });
  },
  onSelect(event) {
  
    this.setData({
      showImageActions: false
    });
  },
  onCloseActions() {
    this.setData({
      showImageActions: false
    });
  },
  getAreaModal() {
    var picker = this.selectComponent('#areaPicker');
    var userInfo = this.data.userInfo;
    var area = this.data.areas;
    var province = userInfo.province.name;
    var city = userInfo.city.name;
    var provinces = area.map(x => x.name);
    var provinceIndex = provinces.indexOf(province);
    var province2 = this.data.areas.filter(x => x.name == province)[0];
    var city2 = province2.cities.map(x => x.name);
    picker.setColumnValues(1, province2.cities.map(x => x.name));
    var cityIndex = city2.indexOf(city);
    this.setData({
      showAreaPopup: true
    });
    picker.setIndexes([provinceIndex, cityIndex]);
  },
  onCloseSnPopup() {
    this.setData({
      showSnPopup: false
    });
  },
  onCancelIndustry() {
    this.setData({
      showIndustryPopup: false
    });
  },
  getSnsModal() {
    this.setData({
      showSnPopup: true,
      inputSns: this.data.inputSns
    });
  },
  getIndustryModal() {
    var industries = this.data.industries.map(x => x.text);
    var industryIndex = 0;
    if (this.data.userInfo.industry != null) {
      industryIndex = industries.indexOf(this.data.userInfo.industry.name);
    }
    var flag = false;
    if (this.data.disableIndustryInput) {
      flag = true;
    }
    this.setData({
      showIndustryPopup: flag,
      industryIndex: industryIndex
    });
  },
  onLoad() {
    var self = this;
    commonService.getIndustries(self);
    commonService.getAreas(self);
    commonService.getCommonCompanyTypes(self);
    this.loadUserInfo();
  },
  loadUserInfo() {
    var userInfo = wx.getStorageSync('userInfo');
    var sns = [];
    if (userInfo.seriesNumbers != "") {
      sns = userInfo.seriesNumbers.split(',');
    }

    var industryId = '';
    var industryName = '';
    if (userInfo.industry == null) {
      industryName = userInfo.industryText;

    } else {
      industryName = userInfo.industry.name;
      industryId = userInfo.industry.id;
    }

    this.setData({
      userImage: userInfo.weChatImagePath,
      inputUserName: userInfo.name,
      inputPhoneNumber: userInfo.phoneNumber,
      inputEmail: userInfo.email,
      inputJobTitle: userInfo.jobTitle,
      inputCompany: userInfo.company,
      inputSns: sns,
      inputCompanyType: userInfo.businessType.name,
      inputCompanyTypeId: userInfo.businessType.id,
      inputIndustryName: industryName,
      inputIndustry: industryId,
      inputArea: [userInfo.province.name, userInfo.city.name],
      userInfo: userInfo,
      inputSchool: userInfo.college == null ? '' : userInfo.college,
      inputOffice: userInfo.technicalOffice == null ? '' : userInfo.technicalOffice,
      inputDepartment: userInfo.department == null ? '' : userInfo.department,
      industry2: industryName
    });

    var picker = this.selectComponent('#areaPicker');
    var province = this.data.areas.filter(x => x.name == userInfo.province.name)[0];
    picker.setColumnValues(1, province.cities.map(x => x.name));
  },
  onReady: function () {

  },
  onShow: function () {

  },
  schoolChange(obj) {
    this.setData({
      inputSchool: obj.detail,
    });
  },
  officeChange(obj) {
    this.setData({
      inputOffice: obj.detail,
    });
  },
  departmentChange(obj) {
    this.setData({
      inputDepartment: obj.detail,
    });
  },
  onCloseCompanyType() {
    this.setData({
      showCompanyTypeModal: false
    });
  },
  onSave: function () {
    if (!this.validateUserInput()) {
      return;
    }
    if (this.data.isDisable) {
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
      "jobTitle": this.data.inputJobTitle,
      "company": this.data.inputCompany,
      "seriesNumbers": this.data.inputSns.join(','),
      "industryId": this.data.inputIndustry,
      "provinceId": province.id,
      "cityId": city.id,
      "businessTypeID": this.data.inputCompanyTypeId,
      "college": this.data.inputSchool,
      "technicalOffice": this.data.inputOffice,
      "department": this.data.inputDepartment,
      "industryText": this.data.industry2,
      "weChatImagePath": this.data.userImage
    }


    app.log('修改信息', {
      "name": data.name,
      "mobile": data.phoneNumber,
      "email": data.email,
      "title": data.jobTitle,
      "miccustomerarea": this.data.inputCompanyType,
      "company": data.company,
      "industry": this.data.inputIndustryName,
      "shebeixuliesnhao": this.data.inputSns.join(','),
      "rmsarea": this.data.inputArea
    });

    if (data.industryText.trim() != '') {
      data.industryId = null;
    }

    userService.updateUserInfo(data, this);
  },
  showToast(txt) {
    wx.showToast({
      title: txt,
      icon: 'none'
    })
  },
  goSnGuide() {
    wx.navigateTo({
      url: '/pages/snGuide/snGuide',
    })
  },
  onConfirmCompanyType(event) {
    const {
      value,
    } = event.detail;
    this.setData({
      showCompanyTypeModal: false,
      inputCompanyTypeId: value.id,
      inputCompanyType: value.text
    });
  },
  getCompanyTypeModal() {
    var compantTypes = this.data.compantTypes.map(x => x.text);
    var compantTypeIndex = compantTypes.indexOf(this.data.userInfo.businessType.name);
    this.setData({
      showCompanyTypeModal: true,
      comoanyTypeIndex: compantTypeIndex
    });
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
  validateUserInput() {
    var flag = true;
    if (this.data.inputUserName.trim() == '') {
      flag = false;
      this.showToast('请输入用户名');
      return;
    }

    if (this.data.inputPhoneNumber.trim() == '') {
      flag = false;
      this.showToast('请输入手机号');
      return;
    }

    if (!this.isPhone(this.data.inputPhoneNumber)) {
      flag = false;
      this.showToast('手机号格式不正确');
      return;
    }

    if (this.data.inputEmail.trim() == '') {
      flag = false;
      this.showToast('请输入邮箱');
      return;
    }

    if (!this.isEmail(this.data.inputEmail)) {
      flag = false;
      this.showToast('邮箱格式不正确');
      return;
    }

    if (this.data.inputJobTitle.trim() == '') {
      flag = false;
      this.showToast('请输入职称');
      return;
    }

    if (this.data.inputCompany.trim() == '') {
      flag = false;
      this.showToast('请输入单位');
      return;
    }

    if (this.data.disableIndustryInput) {
      if (this.data.inputIndustry == null) {
        flag = false;
        this.showToast('请选择行业');
        return;
      }
    } else {
      if (this.data.industry2.trim() == '') {
        flag = false;
        this.showToast('请输入行业');
        return;
      }
    }

    if (this.data.inputCompanyType.trim() == '科研机构') {
      if (this.data.inputSchool.trim() == '') {
        flag = false;
        this.showToast('请输入学院/课题组');
        return;
      }
    }

    if (this.data.inputCompanyType.trim() == '医院') {
      if (this.data.inputOffice.trim() == '') {
        flag = false;
        this.showToast('请输入科室');
        return;
      }
    }

    if (this.data.inputCompanyType.trim().indexOf('工业') != -1) {
      if (this.data.inputDepartment.trim() == '') {
        flag = false;
        this.showToast('请输入部门');
        return;
      }
    }

    return flag;
  },
  userNameChange(obj) {
    this.setData({
      inputUserName: obj.detail,
    });
  },
  phoneNumberChange(obj) {
    this.setData({
      inputPhoneNumber: obj.detail
    });
  },
  emailChange(obj) {
    this.setData({
      inputEmail: obj.detail
    });
  },
  jobTitleChange(obj) {
    this.setData({
      inputJobTitle: obj.detail
    });
  },
  companyChange(obj) {
    this.setData({
      inputCompany: obj.detail
    });
  },
  onCompleteSnInput() {
    var sn = this.data.inputSn;
    var sns = this.data.inputSns;
    if (sn.trim() == '') {
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
        this.setData({
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
  onSnChange(event) {
    var showConfirmInput=this.data.showConfirmInput;
    var confirmSnInput=this.data.confirmSnInput;
    if(event.detail.length>0){
      showConfirmInput=true;
    }else{
      showConfirmInput=false;
    }

    if(event.detail.length>3){
      confirmSnInput=false;
      console.log(event.detail); 
    }else{
      confirmSnInput=true;
    }
    this.setData({
      inputSn: event.detail,
      showConfirmInput:showConfirmInput,
      confirmSnInput:confirmSnInput
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
  onClickUpdateSnInput(obj) {
    var sn = obj.detail.value;
    this.setData({
      updateSnInput: sn
    });
  },
  onConfirmIndustry(event) {
    const {
      value,
    } = event.detail;
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
        industry2: '',
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
    }

  },
  industryChange(event) {
    this.setData({
      industry2: event.detail
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
    var cities = province.cities.map(x => x.name);
    picker.setColumnValues(1, cities);
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
      inputArea: event.detail.value
    });
  },
})