const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  externalClasses: ['custom-class'],
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },
  data: {

  },
  lifetimes: {
    attached: function () {
     
    }
  },
  methods: {
    _register: function () {
    wx.navigateTo({
      url: '../../pages/register/register',
    })
    },
  }
})