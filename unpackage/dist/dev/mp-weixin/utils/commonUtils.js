"use strict";
var common_vendor = require("../common/vendor.js");
function showSuccess(text) {
  common_vendor.index.showToast({
    title: text,
    icon: "success",
    duration: 2e3
  });
}
function showModel(title, content) {
  common_vendor.index.showModal({
    title,
    content,
    showCancel: false
  });
}
function callCloudFunction(name, api, data) {
  return new Promise((resolve, reject) => {
    common_vendor.pn.callFunction({
      name,
      data: {
        api,
        data
      }
    }).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  });
}
exports.callCloudFunction = callCloudFunction;
exports.showModel = showModel;
exports.showSuccess = showSuccess;
