"use strict";
var common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_loginWindow2 = common_vendor.resolveComponent("loginWindow");
  _easycom_loginWindow2();
}
const _easycom_loginWindow = () => "../../components/loginWindow/loginWindow.js";
if (!Math) {
  _easycom_loginWindow();
}
const _sfc_main = {
  __name: "me",
  setup(__props) {
    const user = common_vendor.ref({});
    const quote = common_vendor.ref("");
    let _islogin = common_vendor.ref(true);
    let _showLogin = common_vendor.ref(false);
    const rankArray = () => {
      let a = Math.random() + "";
      let rand1 = a.charAt(5);
      var quotes = new Array();
      quotes[1] = "\u4E0D\u594B\u53D1\uFF0C\u5219\u5FC3\u65E5\u9893\u9761\uFF1B\u4E0D\u68C0\u675F\uFF0C\u5219\u5FC3\u65E5\u6063\u8086";
      quotes[2] = "\u81EA\u5236\u662F\u4E00\u79CD\u79E9\u5E8F\uFF0C\u4E00\u79CD\u5BF9\u4E8E\u5FEB\u4E50\u4E0E\u6B32\u671B\u7684\u63A7\u5236";
      quotes[3] = "\u54EA\u6015\u4E00\u70B9\u5C0F\u5C0F\u7684\u514B\u5236\uFF0C\u4E5F\u4F1A\u4F7F\u4EBA\u53D8\u5F97\u5F3A\u800C\u6709\u529B";
      quotes[4] = "\u505A\u4E00\u4E2A\u81EA\u5F8B\u7684\u4EBA\uFF0C\u50CF\u4F18\u79C0\u7684\u4EBA\u5B66\u4E60\uFF0C\u7136\u540E\u505A\u597D\u81EA\u5DF1";
      quotes[5] = "\u771F\u6B63\u7684\u81EA\u7531\u662F\u5728\u6240\u6709\u65F6\u5019\u90FD\u80FD\u63A7\u5236\u81EA\u5DF1";
      quotes[6] = "\u6BCF\u5929\u7231\u81EA\u5DF1\u591A\u4E00\u70B9\uFF01\uFF01\uFF01";
      quotes[7] = "\u5982\u679C\u8FDE\u81EA\u5DF1\u90FD\u4E0D\u80FD\u63A7\u5236\uFF0C\u6709\u4EC0\u4E48\u8D44\u683C\u53BB\u8C08\u81EA\u5DF1\u60F3\u8981\u7684";
      quotes[8] = "\u767B\u5CF0\u9020\u6781\u7684\u6210\u5C31\u6E90\u4E8E\u81EA\u5F8B";
      quotes[9] = "\u81EA\u6211\u63A7\u5236\u662F\u6700\u5F3A\u8005\u7684\u672C\u80FD";
      quotes[0] = "\u7ACB\u5FD7\u8A00\u4E3A\u672C\uFF0C\u4FEE\u8EAB\u884C\u4E43\u5148";
      quote.value = quotes[rand1];
    };
    const showOpinion = () => {
      common_vendor.index.navigateTo({
        url: "/pages/opinion/opinion"
      });
    };
    const showInstuction = () => {
      common_vendor.index.navigateTo({
        url: "/pages/instruction/instruction"
      });
    };
    const handleLogin = () => {
      _showLogin.value = true;
    };
    const updateShowLogin = (e) => {
      _showLogin.value = e.showLogin;
      if (e.user) {
        user.value = e.user;
      }
      _islogin.value = true;
    };
    const clearUser = () => {
      common_vendor.index.showModal({
        title: "\u786E\u5B9A\u8981\u9000\u51FA\u5417\uFF1F",
        content: "\u9000\u51FA\u540E\u4F60\u7684\u8BB0\u5F55\u4E0D\u4F1A\u4E22\u5931\uFF0C\u518D\u6B21\u70B9\u51FB\u767B\u5F55\u5373\u53EF",
        success: function(res) {
          if (res.confirm) {
            common_vendor.index.clearStorage();
            user.value = {};
            _islogin.value = false;
          } else if (res.cancel) {
            console.log("\u7528\u6237\u70B9\u51FB\u53D6\u6D88");
          }
        }
      });
    };
    common_vendor.onShow(() => {
      rankArray();
      if (!user.value._id) {
        const userinfo = JSON.parse(common_vendor.index.getStorageSync("user") || null);
        if (userinfo) {
          user.value = userinfo;
          _islogin.value = true;
        } else {
          _islogin.value = false;
        }
      }
    });
    common_vendor.onLoad(() => {
      const userinfo = JSON.parse(common_vendor.index.getStorageSync("user") || null);
      if (userinfo) {
        user.value = userinfo;
        _islogin.value = true;
      } else {
        _islogin.value = false;
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(_showLogin)
      }, common_vendor.unref(_showLogin) ? {
        b: common_vendor.o(updateShowLogin)
      } : {}, {
        c: user.value.avatar,
        d: common_vendor.unref(_islogin)
      }, common_vendor.unref(_islogin) ? {
        e: common_vendor.t(user.value.nickname),
        f: common_vendor.t(quote.value)
      } : {}, {
        g: !common_vendor.unref(_islogin)
      }, !common_vendor.unref(_islogin) ? {
        h: common_vendor.o(handleLogin)
      } : {}, {
        i: common_vendor.o(showInstuction),
        j: common_vendor.o(clearUser),
        k: common_vendor.o(showOpinion)
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-259fb574"], ["__file", "E:/\u5C0F\u7A0B\u5E8F\u57FA\u7840/\u5EB7\u6587\u660C\u7248\u672C/zhenzilv/pages/me/me.vue"]]);
wx.createPage(MiniProgramPage);
