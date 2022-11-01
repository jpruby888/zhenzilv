<script setup>
// 引入区域
import {
  onShow,
  onLoad,
  onPullDownRefresh,
  onShareAppMessage,
  onReachBottom
} from '@dcloudio/uni-app'
import { showModel, showSuccess, callCloudFunction } from '../../utils/commonUtils.js'
import { reactive, ref } from 'vue'
import { format } from '../../utils/dateFormat.js'
// 定义变量区
const state = reactive({
  user: {},
  records: []
})
const showRecord = ref(false)
let _currentPage = 0
let _pageSize = 15
let _more = true
let _isPullDownRefresh = false
// 观察者区
// 定义方法区
// 定义方法区(异步)
const _getRecords = async init => {
  uni.showLoading({
    title: '加载中...'
  })
  if (init) {
    _currentPage = 1
    _more = true
  }
  if (_currentPage === 1) {
    state.records = []
    console.log('state.records', state.records)
  }

  const data = {
    openid: state.user._id ? state.user._id : '',
    _currentPage,
    _pageSize
  }
  const res = await callCloudFunction('zhenzilv', 'getRecords', data).catch(err => {
    showModel('出现问题了', '请联系管理员')
    uni.hideLoading()
  })
  uni.hideLoading()
  console.log(res)
  if (_isPullDownRefresh) {
    uni.stopPullDownRefresh()
    _isPullDownRefresh = false
  }
  state.records = state.records.concat(res.result.data)
  _more = res.result.hasMore
  if (state.records.length === 0) {
    //没有记录
    showRecord.value = true
  } else {
    showRecord.value = false
  }
  console.log('state.records: ', state.records)
}
// 生命周期区
onShow(() => {
  const userInfo = JSON.parse(uni.getStorageSync('user') || null)
  if (userInfo) {
    state.user = userInfo
    console.log(state.user)
    _getRecords(true)
    showRecord.value = false
    _more = true
  } else {
    showRecord.value = true
    _more = false
  }
})

onShareAppMessage(() => {
  return {
    title: '真自律',
    path: '/pages/record/record'
  }
})

onReachBottom(() => {
  if (!_more) return

  _currentPage += 1
  console.log('当前在第几页', _currentPage)
  _getRecords()
})

onPullDownRefresh(() => {
  _isPullDownRefresh = true
  _getRecords(true)
})
</script>

<template>
  <view>
    <view v-if="showRecord"><view class="prompt">还没还有任何记录</view></view>
    <!-- 当前是有记录信息的 -->
    <view v-else>
      <view class="table th">
        <view class="date">时间</view>
        <view class="busi">分数</view>
        <view class="mark">最后得分</view>
        <view class="net">备注</view>
      </view>
      <RecordList
        v-for="(record, index) in state.records"
        :key="index"
        :record="record"
      ></RecordList>
      <p class="text-footer" v-if="!_more">没有更多的数据了</p>
      <p class="text-footer" v-else>玩命加载中...</p>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.add {
  margin-top: 20px;
  margin-bottom: 10px;
  text-align: center;
  p {
    font-size: 15px;
  }
}
.th {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background: #ea5149;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  display: flex;
}
.prompt {
  margin-top: 50px;
  margin-bottom: 30px;
  font-size: 14px;
  color: #888888;
  text-align: center;
}
.date {
  width: 23%;
  padding-left: 60px;
}
.busi {
  width: 10%;
  margin-left: 5px;
}
.mark {
  width: 20%;
  margin-left: 10px;
}
.net {
  width: 20%;
  margin-left: 20px;
}
.text-footer {
  text-align: center;
  font-size: 12px;
  margin-bottom: 5px;
  padding-top: 5px;
}
</style>
