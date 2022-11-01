<script setup>
import { format } from '../../utils/dateFormat.js'
import { toRef, defineProps, ref } from 'vue'
import { showModel, showSuccess, callCloudFunction } from '../../utils/commonUtils.js'
// 引入区域
const props = defineProps({
  record: {
    type: Object,
    default: {}
  }
})
// 定义变量区
// const { record } = toRef(props)

const createTime = format(new Date(props.record.createTime), 'yyyy.MM.dd HH:mm')
const showInput = ref(false)
const node = ref(props.record.node)
const src = ref('/static/images/bianji.png')
// 观察者区
// 定义方法区
const changeShow = () => {
  showInput.value = !showInput.value
}
const cancel = () => {
  showInput.value = !showInput.value
  node.value = props.record.node
}
// 定义方法区(异步)
const updateNode = async () => {
  try {
    const data = {
      _id: props.record._id,
      node: node.value
    }
    const res = await callCloudFunction('zhenzilv', 'updateNode', data)
    console.log('从后端传回来的信息: ', res)
    showInput.value = false
    props.record.node = node
  } catch (e) {
    //TODO handle the exceptione
    showModel('失败', '请重新提交哦~')
    console.log('从后端传回来的错误信息: ', e)
  }
}
// 生命周期区
</script>

<template>
  <view class="book-card">
    <view class="table" style="width: 98%;">
      <view class="tr">
        <view class="date">{{ createTime }}</view>
        <view class="busi">
          <label v-if="record.add > 0">+{{ record.add }}</label>
          <label v-if="record.add == 0">&nbsp;0</label>
          <label v-if="record.add < 0">{{ record.add }}</label>
        </view>
        <view class="mark">
          <label>{{ record.mark }}</label>
        </view>
        <view class="net">
          <label v-if="node">{{ node }}</label>
          <label v-else class="no-note" @click="changeShow">点击添加</label>
        </view>
        <label v-if="showInput">
          <view class="image" @click="cancel">
            <image src="/static/images/quxiao.png" mode="" class="img"></image>
          </view>
        </label>
        <label v-else>
          <view class="image" @click="changeShow">
            <image :src="node ? src : ''" mode="" class="img"></image>
          </view>
        </label>
      </view>
    </view>

    <view class="hide" v-if="showInput">
      <button class="btn" @click="updateNode">
        <label v-if="record.node">修改</label>
        <label v-else>添加</label>
      </button>
      <input type="text" v-model="node" class="input" maxlength="10" placeholder="最多输入10个字" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.book-card {
  background: #ffffff;
  margin-bottom: 6px;
  .table {
    border: 0px solid darkgray;
    font-size: 15px;
    height: 42px;
    line-height: 42px;
    .tr {
      display: flex;
      width: 100%;
    }
    .date {
      width: 40%;
      margin-left: 10px;
    }
    .busi {
      width: 10%;
      font-weight: bold;
    }
    .mark {
      width: 15%;
      margin-left: 20px;
      font-weight: bold;
    }
    .net {
      width: 16%;
      text-align: center;
      width: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      margin-left: 5px;
      line-height: 42px;
      .no-note {
        text-decoration: underline;
        color: #c0c0c0;
        font-size: 13px;
      }
    }
    .image {
      padding-top: 1px;
      float: right;
      margin-left: 5px;
    }
  }
  .hide {
    background: #f0f0f0;
    font-size: 15px;
    padding: 10px 10px 3px 30px;
    .input {
      width: 60%;
      height: 30px;
      background: #ffffff;
      border: 1px solid black;
      border-radius: 5px;
      text-align: center;
    }
    .btn {
      color: white;
      background: #ea5a49;
      padding-left: 15px;
      margin-right: 20px;
      border-radius: 5px;
      font-size: 13px;
      line-height: 30px;
      height: 30px;
      width: 18%;
      float: right;
    }
  }
  .img {
    width: 13px;
    height: 13px;
    margin-right: 5px;
  }
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>
