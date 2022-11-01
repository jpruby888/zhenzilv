<script setup>
// 引入区域
import { showSuccess } from '../../utils/commonUtils.js'
const emit = defineEmits(['showLogin'])
// 观察者区
// 定义变量区
// 定义方法区
const login = () => {
  // uni.$emit('showLogin', false)
  //先查询数据库有没有该用户如果有直接登录不页面跳转
  uni.showLoading({
    title: '登陆中...'
  })
  uni.login().then(({ code }) => {
    uniCloud
      .callFunction({
        name: 'zhenzilv',
        data: {
          api: 'getUserFromCloud',
          code: code
        }
      })
      .then(res => {
        uni.hideLoading() // 隐藏登录框
        console.log('查找到的用户信息', res)
        if (res.result) {
          //如果用户信息就保存起来，没有就不管
          showSuccess('登录成功')
          emit('showLogin', { showLogin: false, user: res.result.user, token: res.result.token }) //弹窗消失 回传数据
          // user.value = res.result.user
          // token.value = res.result.token
          uni.setStorageSync('user', JSON.stringify(res.result.user))
          uni.setStorageSync('token', res.result.token)
        } else {
          // 如果没有该用户就去登录页面
          //登录方法
          emit('showLogin', { showLogin: false, user: null, token: '' })
          uni.navigateTo({
            url: '/pages/login/login'
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  })
}
// 生命周期区
</script>

<template>
  <view>
    <view class="modal-mask"></view>
    <view class="modal-dialog">
      <view class="modal-content">
        <img class="img" src="../../static/images/littleTip-huang.jpg" alt="" />
        <view class="content-text">
          <text class="key-bold">真自律是一款自律神器</text>
          <text class="key-bold">将生活想像成通关打怪，打败自己的心魔加分，被心魔打败减分</text>
          <text class="little-tip">举例例子：</text>
          <text class="little-content">午饭忍住没有吃麻辣烫，吃的绿色蔬菜，加5分；</text>
          <text class="little-content">但是晚饭没有还是没有忍住T_T,罪恶罪恶，减10分；</text>
        </view>
      </view>
      <view class="modal-footer">
        <button lang="zh_CN" class="btn" @click="login">授权登录</button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
//弹窗样式代码
.modal-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.5;
  overflow: hidden;
  z-index: 9000;
  color: #fff;
}
.modal-dialog {
  box-sizing: border-box;
  width: 560rpx;
  overflow: hidden;
  position: fixed;
  top: 30%;
  left: 0;
  z-index: 9999;
  background: #fff;
  margin: -150rpx 95rpx;
  border-radius: 16rpx;
}
.modal-content {
  box-sizing: border-box;
  display: flex;
  padding: 0rpx 53rpx 50rpx 53rpx;
  font-size: 32rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.content-tip {
  text-align: center;
  font-size: 36rpx;
  color: #333333;
}
.content-text {
  height: 130px;
  padding: 10px 0px 50px 0px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
}
.modal-footer {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  border-top: 1px solid #e5e5e5;
  font-size: 16px;
  font-weight: bold;
  height: 45px;
  line-height: 45px;
  text-align: center;
  background: #feb600;
}
button {
  width: 100%;
  background: #feb600;
  color: #ffffff;
  font-weight: bold;
}
.img {
  width: 280px;
  height: 90px;
}
.little-tip {
  padding-top: 15px;
  padding-bottom: 3px;
  font-size: 14px;
  font-weight: bold;
  color: #feb600;
}
.little-content {
  padding-top: 5px;
  font-size: 13px;
  color: #606060;
}
.key-bold {
  padding-top: 5px;
  font-size: 14px;
  font-weight: bold;
}
</style>
