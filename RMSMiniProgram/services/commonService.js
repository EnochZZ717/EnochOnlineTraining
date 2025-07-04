var api = require('../utils/api.js');
var wxRequest = require('../utils/wxRequest.js')

function getCommonCompanyTypes(page) {
  var compantTypes = wx.getStorageSync('compantTypes');
  if (compantTypes) {
    page.setData({
      compantTypes: compantTypes
    });
  } else {
    wxRequest.getRequest(api.getCompanyTypes()).then(res => {
      var filterOptions = [];
      res.data.forEach((currentValue, index, arr) => {
        var option = {
          id: currentValue.id,
          text: currentValue.name
        };
        filterOptions.push(option);
      });
      page.setData({
        compantTypes: filterOptions
      });

      wx.setStorageSync('compantTypes', filterOptions)
    });
  }
}

function getIndustries(page) {
  var registerIndustries = wx.getStorageSync('registerIndustries');
  if (registerIndustries) {
    page.setData({
      industries: registerIndustries
    });
  } else {
    wxRequest.getRequest(api.getIndustries()).then(res => {
      var filterOptions = [];
      res.data.forEach((currentValue, index, arr) => {
        var option = {
          id: currentValue.id,
          text: currentValue.name
        };
        filterOptions.push(option);
      });
      page.setData({
        industries: filterOptions
      });
      wx.setStorageSync('registerIndustries', filterOptions)
    });
  }

}

function getAreas(page) {
  var registerArea = wx.getStorageSync('registerArea');
  var registerAreaColumn = wx.getStorageSync('registerAreaColumn');
  if (registerArea) {
    page.setData({
      areaColumns: registerAreaColumn,
      areas: registerArea
    });
  } else {
    wxRequest.getRequest(api.getAreas()).then(res => {
      var newAreas = [{
          values: res.data.map(x => x.name),
          className: 'column1'
        },
        {
          values: res.data[0].cities.map(x => x.name),
          className: 'column2'
        }
        // ,
        // {
        //   values: res.data[0].cities[0].districts.map(x => x.name),
        //   className: 'column3'
        // },
      ];

      page.setData({
        areaColumns: newAreas,
        areas: res.data
      });

      wx.setStorageSync('registerArea', res.data);
      wx.setStorageSync('registerAreaColumn', newAreas);
    });
  }


}

function getSnGuide(page) {
  wxRequest.getRequest(api.getSnGuide()).then(res => {
    page.setData({
      videos: res.data
    });
  });
}

function getGroupImages(page) {
  var images = wx.getStorageSync("groupImages");
  if (images) {
    page.setData({
      images: images
    });
  } else {
    wxRequest.getRequest(api.getGroupImages()).then(res => {
      page.setData({
        images: res.data
      });
      wx.setStorageSync('groupImages', res.data)
    });
  }

}

module.exports = {
  getIndustries: getIndustries,
  getAreas: getAreas,
  getCommonCompanyTypes: getCommonCompanyTypes,
  getSnGuide: getSnGuide,
  getGroupImages: getGroupImages
}