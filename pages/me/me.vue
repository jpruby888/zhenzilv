<script setup>
// 引入区域
import { onShow, onLoad } from '@dcloudio/uni-app'
import { reactive, ref } from 'vue'
// 观察者区
// 定义变量区
const user = ref({})
const quote = ref('')
let _islogin = ref(true)
let _showLogin = ref(false)

// 定义方法区
const rankArray = () => {
  let a = Math.random() + ''
  let rand1 = a.charAt(5)
  var quotes = new Array()
  //将10个励志语句放到数组中
  quotes[1] = '不奋发，则心日颓靡；不检束，则心日恣肆'
  quotes[2] = '自制是一种秩序，一种对于快乐与欲望的控制'
  quotes[3] = '哪怕一点小小的克制，也会使人变得强而有力'
  quotes[4] = '做一个自律的人，像优秀的人学习，然后做好自己'
  quotes[5] = '真正的自由是在所有时候都能控制自己'
  quotes[6] = '每天爱自己多一点！！！'
  quotes[7] = '如果连自己都不能控制，有什么资格去谈自己想要的'
  quotes[8] = '登峰造极的成就源于自律'
  quotes[9] = '自我控制是最强者的本能'
  quotes[0] = '立志言为本，修身行乃先'
  //根据随机数rand1，在数组中找出随机语句，并赋值到quote上面
  quote.value = quotes[rand1]
}

const showOpinion = () => {
  uni.navigateTo({
    url: '/pages/opinion/opinion'
  })
}
const showInstuction = () => {
  uni.navigateTo({
    url: '/pages/instruction/instruction'
  })
}
const handleLogin = () => {
  _showLogin.value = true
}

const updateShowLogin = e => {
  _showLogin.value = e.showLogin
  if (e.user) {
    user.value = e.user
  }
  _islogin.value = true
}

const clearUser = () => {
  uni.showModal({
    title: '确定要退出吗？',
    content: '退出后你的记录不会丢失，再次点击登录即可',
    success: function(res) {
      if (res.confirm) {
        uni.clearStorage()
        user.value = {}
        _islogin.value = false
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}
// 生命周期区
onShow(() => {
  rankArray()
  // 如果用户信息没有的话尝试从localstore里取一下

  if (!user.value._id) {
    const userinfo = JSON.parse(uni.getStorageSync('user') || null)
    if (userinfo) {
      user.value = userinfo
      _islogin.value = true
    } else {
      _islogin.value = false //获取不到用户信息标记为没有登录
    }
  }
})
onLoad(() => {
  const userinfo = JSON.parse(uni.getStorageSync('user') || null)
  if (userinfo) {
    user.value = userinfo
    _islogin.value = true
  } else {
    _islogin.value = false //获取不到用户信息标记为没有登录
  }
})
</script>

<template>
  <view>
    <view v-if="_showLogin"><loginWindow @showLogin="updateShowLogin"></loginWindow></view>

    <view class="top">
      <view class="userinfo"><image class="avatar-img" :src="user.avatar"></image></view>
      <view class="name" v-if="_islogin">
        <label>{{ user.nickname }}</label>
        <text class="notice">{{ quote }}</text>
      </view>
      <view class="login-btn" v-if="!_islogin">
        <button type="primary" size="mini" @click="handleLogin">点击登录</button>
      </view>
    </view>
    <view class="container">
      <view class="row" @click="showInstuction">
        <label class="left">
          <image class="img" src="../../static/images/homework.png"></image>
        </label>
        <label class="name">&nbsp;&nbsp;操作指引</label>
        <label class="right">></label>
      </view>
      <view class="row">
        <label class="left">
          <image class="img" src="../../static/images/classroom.png"></image>
        </label>
        <label class="name">&nbsp;&nbsp;小程序开发课程</label>
        <label class="right">></label>
      </view>
      <view class="row" @click="clearUser">
        <label class="left"><image class="img" src="../../static/images/delete.png"></image></label>
        <label class="name">&nbsp;&nbsp;清空记录</label>
        <label class="right">></label>
      </view>
      <view class="row" @click="showOpinion">
        <label class="left">
          <image class="img" src="../../static/images/approval.png"></image>
        </label>
        <label class="name">&nbsp;&nbsp;意见反馈</label>
        <label class="right">></label>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  margin-top: 10px;
  background: #ffffff;
  font-size: 15px;
  .row {
    padding: 0px 18px;
    border-bottom: 1px #e8e8e8 solid;
    height: 55px;
    line-height: 55px;
    .img {
      float: left;
      width: 20px;
      height: 20px;
      padding-top: 16px;
    }
    .name {
      float: left;
    }
  }
  .right {
    float: right;
    color: #c8c8c8;
    line-height: 55px;
  }
  .left {
    width: 80%;
  }
}

.top {
  height: 80px;
  width: 100%;
  background: #ea5149;
  padding-top: 30px;
  display: block;
  .userinfo {
    padding-bottom: 5px;
    float: left;
    .avatar-img {
      width: 120rpx;
      height: 120rpx;
      margin: 10rpx;
      border-radius: 50%;
      border: 1px #d0d0d0 solid;
    }
  }
  .login-btn {
    padding-top: 35px;
    padding-left: 5px;
    color: #ffffff;
    font-size: 16px;
    float: left;
  }
  .name {
    padding-top: 30px;
    padding-left: 5px;
    color: #ffffff;
    font-size: 16px;
    float: left;
    display: flex;
    flex-direction: column;
    .underline {
      border: 1px solid #ffffff;
      border-radius: 5px;
      text-align: center;
    }
    .notice {
      margin-top: 10rpx;
      color: #d8d8d8;
      font-size: 12px;
    }
    .a-line {
      background: #ea5149;
      border: none;
      display: inline;
      font-size: 16px;
      color: #ffffff;
      text-decoration: underline;
    }
  }
}
</style>
