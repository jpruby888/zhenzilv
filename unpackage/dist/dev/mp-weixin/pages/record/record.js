"use strict";
var common_vendor = require("../../common/vendor.js");
var utils_commonUtils = require("../../utils/commonUtils.js");
if (!Array) {
  const _easycom_RecordList2 = common_vendor.resolveComponent("RecordList");
  _easycom_RecordList2();
}
const _easycom_RecordList = () => "../../components/RecordList/RecordList.js";
if (!Math) {
  _easycom_RecordList();
}
const _sfc_main = {
  __name: "record",
  setup(__props) {
    const state = common_vendor.reactive({
      user: {},
      records: []
    });
    const showRecord = common_vendor.ref(false);
    let _currentPage = 0;
    let _pageSize = 15;
    let _more = true;
    let _isPullDownRefresh = false;
    const _getRecords = async (init) => {
      common_vendor.index.showLoading({
        title: "\u52A0\u8F7D\u4E2D..."
      });
      if (init) {
        _currentPage = 1;
        _more = true;
      }
      if (_currentPage === 1) {
        state.records = [];
        console.log("state.records", state.records);
      }
      const data = {
        openid: state.user._id ? state.user._id : "",
        _currentPage,
        _pageSize
      };
      const res = await utils_commonUtils.callCloudFunction("zhenzilv", "getRecords", data).catch((err) => {
        utils_commonUtils.showModel("\u51FA\u73B0\u95EE\u9898\u4E86", "\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458");
        common_vendor.index.hideLoading();
      });
      common_vendor.index.hideLoading();
      console.log(res);
      if (_isPullDownRefresh) {
        common_vendor.index.stopPullDownRefresh();
        _isPullDownRefresh = false;
      }
      state.records = state.records.concat(res.result.data);
      _more = res.result.hasMore;
      if (state.records.length === 0) {
        showRecord.value = true;
      } else {
        showRecord.value = false;
      }
      console.log("state.records: ", state.records);
    };
    common_vendor.onShow(() => {
      const userInfo = JSON.parse(common_vendor.index.getStorageSync("user") || null);
      if (userInfo) {
        state.user = userInfo;
        console.log(state.user);
        _getRecords(true);
        showRecord.value = false;
        _more = true;
      } else {
        showRecord.value = true;
        _more = false;
      }
    });
    common_vendor.onShareAppMessage(() => {
      return {
        title: "\u771F\u81EA\u5F8B",
        path: "/pages/record/record"
      };
    });
    common_vendor.onReachBottom(() => {
      if (!_more)
        return;
      _currentPage += 1;
      console.log("\u5F53\u524D\u5728\u7B2C\u51E0\u9875", _currentPage);
      _getRecords();
    });
    common_vendor.onPullDownRefresh(() => {
      _isPullDownRefresh = true;
      _getRecords(true);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: showRecord.value
      }, showRecord.value ? {} : common_vendor.e({
        b: common_vendor.f(state.records, (record, index, i0) => {
          return {
            a: index,
            b: "3b6eb0a6-0-" + i0,
            c: common_vendor.p({
              record
            })
          };
        }),
        c: !common_vendor.unref(_more)
      }, !common_vendor.unref(_more) ? {} : {}));
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3b6eb0a6"], ["__file", "E:/\u5C0F\u7A0B\u5E8F\u57FA\u7840/\u5EB7\u6587\u660C\u7248\u672C/zhenzilv/pages/record/record.vue"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
