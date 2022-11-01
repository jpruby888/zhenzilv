"use strict";
var common_vendor = require("../../common/vendor.js");
var utils_commonUtils = require("../../utils/commonUtils.js");
const _sfc_main = {
  __name: "loginWindow",
  emits: ["showLogin"],
  setup(__props, { emit }) {
    const login = () => {
      common_vendor.index.showLoading({
        title: "\u767B\u9646\u4E2D..."
      });
      common_vendor.index.login().then(({ code }) => {
        common_vendor.pn.callFunction({
          name: "zhenzilv",
          data: {
            api: "getUserFromCloud",
            code
          }
        }).then((res) => {
          common_vendor.index.hideLoading();
          console.log("\u67E5\u627E\u5230\u7684\u7528\u6237\u4FE1\u606F", res);
          if (res.result) {
            utils_commonUtils.showSuccess("\u767B\u5F55\u6210\u529F");
            emit("showLogin", { showLogin: false, user: res.result.user, token: res.result.token });
            common_vendor.index.setStorageSync("user", JSON.stringify(res.result.user));
            common_vendor.index.setStorageSync("token", res.result.token);
          } else {
            emit("showLogin", { showLogin: false, user: null, token: "" });
            common_vendor.index.navigateTo({
              url: "/pages/login/login"
            });
          }
        }).catch((err) => {
          console.log(err);
        });
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(login)
      };
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b7777510"], ["__file", "E:/\u5C0F\u7A0B\u5E8F\u57FA\u7840/\u5EB7\u6587\u660C\u7248\u672C/zhenzilv/components/loginWindow/loginWindow.vue"]]);
wx.createComponent(Component);
