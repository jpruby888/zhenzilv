"use strict";var e=require("../../common/vendor.js"),o=require("../../utils/commonUtils.js");if(!Array){e.resolveComponent("lable")()}const a={__name:"opinion",setup(a){const t=e.ref(""),n=e.ref(0),l=e.reactive([]),i=e.ref(0),s=e.ref("");let c=[],u="";e.watch(t,((e,o)=>{n.value=e.length})),e.watch(l,((e,o)=>{i.value=e.length}));const r=()=>{e.index.chooseImage({count:2,success(e){l.push(...e.tempFilePaths)}})},d=async()=>{if(u=JSON.parse(e.index.getStorageSync("user")||null)||"",!u)return e.index.showToast({title:"请先登录",icon:"none"});if(!t.value)return e.index.showToast({title:"建议内容不能为空",icon:"none"});if(e.index.showLoading({title:"建议提交中"}),l.length>0)for(let o of l){console.log("item",o);let a=o.substring(o.lastIndexOf("/")+1,o.length);const t=`userOpinion/${Date.now()}.${a}`,n=await e.pn.uploadFile({cloudPath:t,filePath:o});n.success&&(c.push(n.fileID),console.log(c))}const a={opinion:t.value,userId:u._id,wechat:s.value,src:c,createTime:Date.now()};console.log("data",a);const n=await o.callCloudFunction("zhenzilv","createOpinion",a).catch((e=>{console.log(e),o.showModel("提交失败","服务器出来一点问题，请稍后再试")}));e.index.hideLoading(),n.success&&(o.showModel("提交成功","已将您的反馈交给了开发者"),t.value="",l.length=0,s.value="",e.index.navigateBack())};return(o,a)=>e.e({a:t.value,b:e.o((e=>t.value=e.detail.value)),c:e.t(n.value),d:e.t(i.value),e:e.f(l,((e,o,a)=>({a:e,b:o}))),f:i.value<2},i.value<2?{g:e.o(r)}:{},{h:s.value,i:e.o((e=>s.value=e.detail.value)),j:e.o(d)})}};var t=e._export_sfc(a,[["__scopeId","data-v-d8effe78"]]);wx.createPage(t);