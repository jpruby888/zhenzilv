"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "instruction",
  setup(__props) {
    const src = common_vendor.ref("../../static/images/littleTip-huang.jpg");
    const src1 = common_vendor.ref("../../static/images/index.jpg");
    const src2 = common_vendor.ref("../../static/images/record.jpg");
    const src3 = common_vendor.ref("../../static/images/me.jpg");
    const src4 = common_vendor.ref("../../static/images/share.png");
    return (_ctx, _cache) => {
      return {
        a: src.value,
        b: src4.value,
        c: src1.value,
        d: src2.value,
        e: src3.value
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-27007ba4"], ["__file", "E:/\u5C0F\u7A0B\u5E8F\u57FA\u7840/\u5EB7\u6587\u660C\u7248\u672C/zhenzilv/pages/instruction/instruction.vue"]]);
wx.createPage(MiniProgramPage);
