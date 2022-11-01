"use strict";
var common_vendor = require("../../common/vendor.js");
var utils_commonUtils = require("../../utils/commonUtils.js");
if (!Array) {
  const _easycom_loginWindow2 = common_vendor.resolveComponent("loginWindow");
  _easycom_loginWindow2();
}
const _easycom_loginWindow = () => "../../components/loginWindow/loginWindow.js";
if (!Math) {
  _easycom_loginWindow();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const mark = common_vendor.ref(0);
    const user = common_vendor.ref({});
    const token = common_vendor.ref("");
    const showLogin = common_vendor.ref(false);
    let _isonPullDownRefresh = false;
    const updateShowLogin = (e) => {
      console.log(e);
      showLogin.value = e.showLogin;
      user.value = e.user;
      token.value = e.token;
      _getCurrentMark();
    };
    const addMark = async (add) => {
      if (!token.value && !user.value)
        return showLogin.value = true;
      const data = {
        openid: user.value._id,
        add
      };
      const res = await utils_commonUtils.callCloudFunction("zhenzilv", "createRecords", data).catch((err) => {
        console.log(err);
        utils_commonUtils.showModel("\u8BF7\u6C42\u5931\u8D25", "\u8BF7\u91CD\u8BD5\u54E6~");
      });
      console.log("sss", res);
      mark.value += add;
      if (mark.value < 0)
        mark.value = 0;
    };
    const _getCurrentMark = async () => {
      const data = {
        openid: user.value ? user.value._id : ""
      };
      const res = await utils_commonUtils.callCloudFunction("zhenzilv", "getCurrentMark", data).catch((err) => {
        console.log(err);
        utils_commonUtils.showModel("\u8BF7\u6C42\u5931\u8D25", "\u8BF7\u91CD\u8BD5\u54E6~");
      });
      console.log("\u540E\u7AEF\u4F20\u8FC7\u6765\u7684\u4FE1\u606F", res);
      mark.value = res.result.mark;
      if (_isonPullDownRefresh) {
        _isonPullDownRefresh = false;
        common_vendor.index.stopPullDownRefresh();
      }
    };
    const _getUserFormStorage = () => {
      const suser = JSON.parse(common_vendor.index.getStorageSync("user") || null);
      const stoken = common_vendor.index.getStorageSync("token") || "";
      user.value = suser;
      token.value = stoken;
    };
    const reset = () => {
      common_vendor.index.showModal({
        content: "\u786E\u5B9A\u8981\u6E05\u96F6\u5417\uFF1F",
        success(res) {
          if (res.confirm) {
            resetMark();
          }
        }
      });
    };
    const resetMark = async () => {
      if (mark.value === 0)
        return;
      const data = {
        openid: user.value ? user.value._id : ""
      };
      const res = await utils_commonUtils.callCloudFunction("zhenzilv", "resetMark", data).catch((err) => {
        console.log(err);
        utils_commonUtils.showModel("\u8BF7\u6C42\u5931\u8D25", "\u8BF7\u91CD\u8BD5\u54E6~");
      });
      console.log("\u6E05\u96F6\u7A0B\u5E8F\u4ECE\u540E\u7AEF\u4F20\u9012\u8FC7\u6765\u7684\u4FE1\u606F", res);
      mark.value = 0;
    };
    const recall = async () => {
      if (mark.value === 0)
        return;
      const data = {
        openid: user.value ? user.value._id : ""
      };
      const res = await utils_commonUtils.callCloudFunction("zhenzilv", "deleteRecord", data).catch((err) => {
        console.log(err);
        utils_commonUtils.showModel("\u8BF7\u6C42\u5931\u8D25", "\u8BF7\u91CD\u8BD5\u54E6~");
      });
      console.log("\u64A4\u9500\u7A0B\u5E8F\u4ECE\u540E\u7AEF\u4F20\u9012\u8FC7\u6765\u7684\u4FE1\u606F", res);
      mark.value = res.result.mark;
      utils_commonUtils.showSuccess("\u64A4\u9500\u6210\u529F");
    };
    common_vendor.onLoad((option) => {
      _getUserFormStorage();
      if (token.value && user.value)
        return;
    });
    common_vendor.onShow(() => {
      _getCurrentMark();
      if (token.value && user.value)
        return;
      _getUserFormStorage();
    });
    common_vendor.onPullDownRefresh(() => {
      _isonPullDownRefresh = true;
      _getCurrentMark();
    });
    common_vendor.onShareAppMessage(() => {
      return {
        title: "\u771F\u81EA\u5F8B",
        path: "/pages/index/index"
      };
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: showLogin.value
      }, showLogin.value ? {
        b: common_vendor.o(updateShowLogin)
      } : {}, {
        c: common_vendor.o(reset),
        d: common_vendor.o(recall),
        e: common_vendor.t(mark.value),
        f: common_vendor.o(($event) => addMark(1)),
        g: common_vendor.o(($event) => addMark(-1)),
        h: common_vendor.o(($event) => addMark(5)),
        i: common_vendor.o(($event) => addMark(-5))
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-57280228"], ["__file", "E:/\u5C0F\u7A0B\u5E8F\u57FA\u7840/\u5EB7\u6587\u660C\u7248\u672C/zhenzilv/pages/index/index.vue"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
