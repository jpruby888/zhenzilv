"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const defaultAvartaUrl = "../../static/images/defaultAvatar.png";
    const avatar = common_vendor.ref(defaultAvartaUrl);
    const nickname = common_vendor.ref("");
    const login = async (e) => {
      if (avatar.value === defaultAvartaUrl || !e.detail.value.nickname) {
        return common_vendor.index.showToast({
          title: "\u5934\u50CF\u6216\u8005\u6635\u79F0\u4E0D\u80FD\u4E3A\u7A7A",
          icon: "none"
        });
      }
      const { success } = await _uplaodAvatar(avatar.value);
      if (!success)
        return common_vendor.index.showToast({
          title: "\u7528\u6237\u5934\u50CF\u4FDD\u5B58\u5931\u8D25",
          icon: "none"
        });
      common_vendor.index.showLoading({
        title: "\u767B\u5F55\u4E2D...",
        mask: true
      });
      common_vendor.index.login().then(({ code }) => {
        console.log("code", code);
        common_vendor.pn.callFunction({
          name: "zhenzilv",
          data: {
            api: "userlogin",
            code,
            avatar: avatar.value,
            nickname: e.detail.value.nickname
          }
        }).then((res) => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "\u767B\u5F55\u6210\u529F",
            icon: "success"
          });
          console.log("\u62FF\u5230\u7528\u6237\u4FE1\u606F\u4E3A\uFF1A", res.result);
          common_vendor.index.setStorageSync("user", JSON.stringify(res.result.user));
          common_vendor.index.setStorageSync("token", res.result.token);
          common_vendor.index.navigateBack();
        }).catch((err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "\u767B\u5F55\u5931\u8D25"
          });
          console.log("\u83B7\u53D6\u7528\u6237\u4FE1\u606F\u5931\u8D25", err);
        });
      }).catch((err) => {
        console.log(err);
      });
      nickname.value = null;
    };
    const reset = () => {
      console.log("reset");
    };
    const onChooseAvatar = (e) => {
      const { avatarUrl } = e.detail;
      avatar.value = avatarUrl;
    };
    const _uplaodAvatar = async (avatarUrl) => {
      return new Promise((resolve, reject) => {
        let avatarName = avatarUrl.substring(avatarUrl.lastIndexOf("/") + 1, avatarUrl.length);
        let avatarProfile = avatarName.substring(avatarName.lastIndexOf(".") + 1, avatarName.length);
        console.log("avatarProfile: ", avatarProfile);
        const cloudPath = `userAvatar/${Date.now()}.${avatarName}`;
        common_vendor.index.showLoading({
          title: "\u5934\u50CF\u4E0A\u4F20\u4E2D"
        });
        common_vendor.pn.uploadFile({
          filePath: avatarUrl,
          cloudPath
        }).then((res) => {
          common_vendor.index.hideLoading();
          if (res.success) {
            common_vendor.index.showToast({
              title: "\u5934\u50CF\u4E0A\u4F20\u6210\u529F"
            });
            avatar.value = res.fileID;
            resolve({ success: true });
          }
        }).catch((err) => {
          console.log("err: ", err);
          reject({ success: false });
        });
      });
    };
    return (_ctx, _cache) => {
      return {
        a: avatar.value,
        b: common_vendor.o(onChooseAvatar),
        c: nickname.value,
        d: common_vendor.o(($event) => nickname.value = $event.detail.value),
        e: common_vendor.o(login),
        f: common_vendor.o(reset)
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b237504c"], ["__file", "E:/\u5C0F\u7A0B\u5E8F\u57FA\u7840/\u5EB7\u6587\u660C\u7248\u672C/zhenzilv/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
