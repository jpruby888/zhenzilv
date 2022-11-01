<script setup>
// 引入区域
import { onShow, onLoad, onPullDownRefresh, onShareAppMessage } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { showModel, showSuccess, callCloudFunction } from '../../utils/commonUtils.js'
// 观察者区
// 定义变量区
const mark = ref(0)
const user = ref({})
const token = ref('')
const showLogin = ref(false)
let _isonPullDownRefresh = false

// 定义方法区

const updateShowLogin = e => {
  console.log(e)
  showLogin.value = e.showLogin
  user.value = e.user
  token.value = e.token
  _getCurrentMark()
}

const addMark = async add => {
  if (!token.value && !user.value) return (showLogin.value = true)

  const data = {
    openid: user.value._id,
    add: add
  }
  const res = await callCloudFunction('zhenzilv', 'createRecords', data).catch(err => {
    console.log(err)
    showModel('请求失败', '请重试哦~')
  })
  console.log('sss', res)
  mark.value += add
  if (mark.value < 0) mark.value = 0
}

const _getCurrentMark = async () => {
  const data = {
    openid: user.value ? user.value._id : ''
  }
  const res = await callCloudFunction('zhenzilv', 'getCurrentMark', data).catch(err => {
    console.log(err)
    showModel('请求失败', '请重试哦~')
  })
  console.log('后端传过来的信息', res)
  mark.value = res.result.mark
  if (_isonPullDownRefresh) {
    _isonPullDownRefresh = false
    uni.stopPullDownRefresh()
  }
}

const _getUserFormStorage = () => {
  const suser = JSON.parse(uni.getStorageSync('user') || null) // 如果转换对象不存在必须给个null返回
  const stoken = uni.getStorageSync('token') || ''
  user.value = suser
  token.value = stoken
}
const _getUserFromCloud = () => {
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
        console.log('查找到的用户信息', res)
        if (res.result) {
          //如果用户信息就保存起来，没有就不管
          user.value = res.result.user
          token.value = res.result.token
          uni.setStorageSync('user', JSON.stringify(res.result.user))
          uni.setStorageSync('token', res.result.token)
        }
      })
      .catch(err => {
        console.log(err)
      })
  })
}

const reset = () => {
  uni.showModal({
    content: '确定要清零吗？',
    success(res) {
      if (res.confirm) {
        resetMark()
      }
    }
  })
}

//异步方法
const resetMark = async () => {
  if (mark.value === 0) return
  const data = {
    openid: user.value ? user.value._id : ''
  }
  const res = await callCloudFunction('zhenzilv', 'resetMark', data).catch(err => {
    console.log(err)
    showModel('请求失败', '请重试哦~')
  })

  console.log('清零程序从后端传递过来的信息', res)
  mark.value = 0
}

const recall = async () => {
  if (mark.value === 0) return
  const data = {
    openid: user.value ? user.value._id : ''
  }
  const res = await callCloudFunction('zhenzilv', 'deleteRecord', data).catch(err => {
    console.log(err)
    showModel('请求失败', '请重试哦~')
  })

  console.log('撤销程序从后端传递过来的信息', res)
  mark.value = res.result.mark
  showSuccess('撤销成功')
}
// 生命周期区
onLoad(option => {
  _getUserFormStorage() //首次加载从缓存中拿去用户的信息，如果拿不到去数据库里找一下用户的信息
  if (token.value && user.value) return //如果拿到了用户信息就不去数据库里找了
  // _getUserFromCloud() //从数据库里获取用户信息 ，这里不要强迫用户登录
})
onShow(() => {
  _getCurrentMark() //获取数据库保存的总分
  if (token.value && user.value) return //如果首页中已经有了用户信息那就不用反复从缓存中拿
  _getUserFormStorage()
})
//界面操作api
onPullDownRefresh(() => {
  _isonPullDownRefresh = true // 下拉刷新标志位
  _getCurrentMark()
})
onShareAppMessage(() => {
  return {
    title: '真自律',
    path: '/pages/index/index'
  }
})
</script>

<template>
  <view>
    <view v-if="showLogin"><loginWindow @showLogin="updateShowLogin"></loginWindow></view>

    <!-- <button lang="zh_CN" class="btn" @click="login">授权登录</button> -->

    <view class="show">
      <view class="button2">
        <view class="btn0" @click="reset">清零</view>
        <view class="btn1" @click="recall">撤销</view>
      </view>
      <view class="mark-text">当前分数</view>
      <view class="mark">{{ mark }}</view>
    </view>
    <view class="row">
      <view class="button right" @click="addMark(1)">+1</view>
      <view class="button left" @click="addMark(-1)">-1</view>
    </view>
    <view class="row">
      <view class="button right" @click="addMark(5)">+5</view>
      <view class="button left" @click="addMark(-5)">-5</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.show {
  text-align: center;
  height: 532rpx;
  background-color: #ea5149;
  margin-bottom: 10rpx;
  color: #fff;
  font-weight: bold;
  .mark-text {
    font-size: 40rpx;
    padding: 56rpx;
  }
  .mark {
    font-size: 176rpx;
  }
}
.row {
  margin: 80rpx 112rpx;
  .button {
    width: 140rpx;
    height: 140rpx;
    line-height: 140rpx;
    border-radius: 20%;
    border: none;
    text-align: center;
    font-size: 50rpx;
    color: #fff;
    font-weight: bold;
  }
  .right {
    background-color: #ea5149;
    float: right;
  }
  .left {
    background-color: #feb600;
  }
}

.button2 {
  margin: 0 10px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  background: #ea5149;
  display: flex;
  justify-content: space-between;
  .btn0 {
    width: 60px;
    border-radius: 15px;
    border: 1px dashed #feb600;
  }
  .btn1 {
    width: 60px;
    border-radius: 15px;
    border: 1px dashed #feb600;
  }
}
</style>
