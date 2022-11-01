"use strict";
var common_vendor = require("../../common/vendor.js");
var utils_commonUtils = require("../../utils/commonUtils.js");
if (!Array) {
  const _component_lable = common_vendor.resolveComponent("lable");
  _component_lable();
}
const _sfc_main = {
  __name: "opinion",
  setup(__props) {
    const opinion = common_vendor.ref("");
    const wordCount = common_vendor.ref(0);
    const src = common_vendor.reactive([]);
    const imgCount = common_vendor.ref(0);
    const wechat = common_vendor.ref("");
    let uploadPics = [];
    let user = "";
    common_vendor.watch(opinion, (opinion2, prevOpinion) => {
      wordCount.value = opinion2.length;
    });
    common_vendor.watch(src, (newValue, oldValue) => {
      imgCount.value = newValue.length;
    });
    const uploadPictiure = () => {
      common_vendor.index.chooseImage({
        count: 2,
        success(res) {
          src.push(...res.tempFilePaths);
        }
      });
    };
    const submit = async () => {
      user = JSON.parse(common_vendor.index.getStorageSync("user") || null) || "";
      if (!user)
        return common_vendor.index.showToast({
          title: "\u8BF7\u5148\u767B\u5F55",
          icon: "none"
        });
      if (!opinion.value)
        return common_vendor.index.showToast({
          title: "\u5EFA\u8BAE\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A",
          icon: "none"
        });
      common_vendor.index.showLoading({
        title: "\u5EFA\u8BAE\u63D0\u4EA4\u4E2D"
      });
      if (src.length > 0) {
        for (let item of src) {
          console.log("item", item);
          let pictureName = item.substring(item.lastIndexOf("/") + 1, item.length);
          const cloudPath = `userOpinion/${Date.now()}.${pictureName}`;
          const res2 = await common_vendor.pn.uploadFile({
            cloudPath,
            filePath: item
          });
          if (res2.success) {
            uploadPics.push(res2.fileID);
            console.log(uploadPics);
          }
        }
      }
      const data = {
        opinion: opinion.value,
        userId: user._id,
        wechat: wechat.value,
        src: uploadPics,
        createTime: Date.now()
      };
      console.log("data", data);
      const res = await utils_commonUtils.callCloudFunction("zhenzilv", "createOpinion", data).catch((err) => {
        console.log(err);
        utils_commonUtils.showModel("\u63D0\u4EA4\u5931\u8D25", "\u670D\u52A1\u5668\u51FA\u6765\u4E00\u70B9\u95EE\u9898\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");
      });
      common_vendor.index.hideLoading();
      if (res.success) {
        utils_commonUtils.showModel("\u63D0\u4EA4\u6210\u529F", "\u5DF2\u5C06\u60A8\u7684\u53CD\u9988\u4EA4\u7ED9\u4E86\u5F00\u53D1\u8005");
        opinion.value = "";
        src.length = 0;
        wechat.value = "";
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: opinion.value,
        b: common_vendor.o(($event) => opinion.value = $event.detail.value),
        c: common_vendor.t(wordCount.value),
        d: common_vendor.t(imgCount.value),
        e: common_vendor.f(src, (item, index, i0) => {
          return {
            a: item,
            b: index
          };
        }),
        f: imgCount.value < 2
      }, imgCount.value < 2 ? {
        g: common_vendor.o(uploadPictiure)
      } : {}, {
        h: wechat.value,
        i: common_vendor.o(($event) => wechat.value = $event.detail.value),
        j: common_vendor.o(submit)
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-11adafe8"], ["__file", "E:/\u5C0F\u7A0B\u5E8F\u57FA\u7840/\u5EB7\u6587\u660C\u7248\u672C/zhenzilv/pages/opinion/opinion.vue"]]);
wx.createPage(MiniProgramPage);
