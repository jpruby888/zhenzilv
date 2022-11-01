"use strict";
var common_vendor = require("../../common/vendor.js");
var utils_dateFormat = require("../../utils/dateFormat.js");
var utils_commonUtils = require("../../utils/commonUtils.js");
const _sfc_main = {
  __name: "RecordList",
  props: {
    record: {
      type: Object,
      default: {}
    }
  },
  setup(__props) {
    const props = __props;
    const createTime = utils_dateFormat.format(new Date(props.record.createTime), "yyyy.MM.dd HH:mm");
    const showInput = common_vendor.ref(false);
    const node = common_vendor.ref(props.record.node);
    const src = common_vendor.ref("/static/images/bianji.png");
    const changeShow = () => {
      showInput.value = !showInput.value;
    };
    const cancel = () => {
      showInput.value = !showInput.value;
      node.value = props.record.node;
    };
    const updateNode = async () => {
      try {
        const data = {
          _id: props.record._id,
          node: node.value
        };
        const res = await utils_commonUtils.callCloudFunction("zhenzilv", "updateNode", data);
        console.log("\u4ECE\u540E\u7AEF\u4F20\u56DE\u6765\u7684\u4FE1\u606F: ", res);
        showInput.value = false;
        props.record.node = node;
      } catch (e) {
        utils_commonUtils.showModel("\u5931\u8D25", "\u8BF7\u91CD\u65B0\u63D0\u4EA4\u54E6~");
        console.log("\u4ECE\u540E\u7AEF\u4F20\u56DE\u6765\u7684\u9519\u8BEF\u4FE1\u606F: ", e);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(common_vendor.unref(createTime)),
        b: __props.record.add > 0
      }, __props.record.add > 0 ? {
        c: common_vendor.t(__props.record.add)
      } : {}, {
        d: __props.record.add == 0
      }, __props.record.add == 0 ? {} : {}, {
        e: __props.record.add < 0
      }, __props.record.add < 0 ? {
        f: common_vendor.t(__props.record.add)
      } : {}, {
        g: common_vendor.t(__props.record.mark),
        h: node.value
      }, node.value ? {
        i: common_vendor.t(node.value)
      } : {
        j: common_vendor.o(changeShow)
      }, {
        k: showInput.value
      }, showInput.value ? {
        l: common_vendor.o(cancel)
      } : {
        m: node.value ? src.value : "",
        n: common_vendor.o(changeShow)
      }, {
        o: showInput.value
      }, showInput.value ? common_vendor.e({
        p: __props.record.node
      }, __props.record.node ? {} : {}, {
        q: common_vendor.o(updateNode),
        r: node.value,
        s: common_vendor.o(($event) => node.value = $event.detail.value)
      }) : {});
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-69859f38"], ["__file", "E:/\u5C0F\u7A0B\u5E8F\u57FA\u7840/\u5EB7\u6587\u660C\u7248\u672C/zhenzilv/components/RecordList/RecordList.vue"]]);
wx.createComponent(Component);
