<script setup>
// 引入区域
import { onShow, onLoad } from '@dcloudio/uni-app'
import { reactive, ref, toRaw, watch } from 'vue'
import { showSuccess, callCloudFunction, showModel } from '../../utils/commonUtils.js'

// 定义变量区
const opinion = ref('')
const wordCount = ref(0)
const src = reactive([])
const imgCount = ref(0)
const wechat = ref('')
let uploadPics = []
let user = ''
// 观察者区
watch(opinion, (opinion, prevOpinion) => {
  wordCount.value = opinion.length
  /* ... */
})
watch(src, (newValue, oldValue) => {
  imgCount.value = newValue.length
})

// 定义方法区

const uploadPictiure = () => {
  uni.chooseImage({
    count: 2,
    success(res) {
      // console.log(res.tempFilePaths)
      src.push(...res.tempFilePaths)
      // console.log('src', src.value)
    }
  })
}

const submit = async () => {
  user = JSON.parse(uni.getStorageSync('user') || null) || ''
  if (!user)
    return uni.showToast({
      title: '请先登录',
      icon: 'none'
    })

  if (!opinion.value)
    return uni.showToast({
      title: '建议内容不能为空',
      icon: 'none'
    })

  uni.showLoading({
    title: '建议提交中'
  })

  if (src.length > 0) {
    for (let item of src) {
      console.log('item', item) //图片地址
      let pictureName = item.substring(item.lastIndexOf('/') + 1, item.length)

      // 上传头像到云数据库，注意这里需要检查图片是否已经在云库中，如果没有再在上传（todo）

      const cloudPath = `userOpinion/${Date.now()}.${pictureName}`
      const res = await uniCloud.uploadFile({
        cloudPath: cloudPath,
        filePath: item
      })

      if (res.success) {
        uploadPics.push(res.fileID)
        console.log(uploadPics)
      }
    }
  }

  const data = {
    opinion: opinion.value,
    userId: user._id, //用户的openId
    wechat: wechat.value,
    src: uploadPics,
    createTime: Date.now()
  }
  console.log('data', data)

  //用自定义工具类快速上传得到结果

  const res = await callCloudFunction('zhenzilv', 'createOpinion', data).catch(err => {
    console.log(err)
    showModel('提交失败', '服务器出来一点问题，请稍后再试')
  })
  uni.hideLoading()
  if (res.success) {
    showModel('提交成功', '已将您的反馈交给了开发者')

    opinion.value = ''
    src.length = 0 //ue3必须通过myArray.length = 0的方式清空数组，不能直接让它等于[]或重新声明
    wechat.value = ''
    uni.navigateBack()
  }

  //上传用户的留言信息
  // uniCloud
  //   .callFunction({
  //     name: 'zhenzilv',
  //     data: {
  //       api: 'createOpinion',
  //       data
  //     }
  //   })
  //   .then(res => {
  //     console.log('上传用户留言成功', res)
  //     uni.hideLoading()
  //     if (res.success) {
  //       showSuccess('留言成功！')
  //     }
  //   })
}
// 生命周期区
</script>

<template>
  <view>
    <view class="container">
      <view class="row"><label class="name">意见与反馈</label></view>
      <view class="row text">
        <view>
          <textarea
            v-model="opinion"
            class="input"
            maxlength="200"
            placeholder="点击这里输入您的建议"
          />
          <label class="word-count">{{ wordCount }}/200</label>
        </view>
      </view>
      <view class="row">
        <view>
          <lable class="name">相关截图（选填）</lable>
          <label class="img-count">{{ imgCount }}/2</label>
        </view>
        <label v-for="(item, index) in src" :key="index">
          <image :src="item" class="img"></image>
        </label>
        <label v-if="imgCount < 2">
          <image
            @click="uploadPictiure"
            class="add-img"
            src="../../static/images/addimage.png"
          ></image>
        </label>
        <view class="row">
          <view class="name">备注（选填）</view>
          <input
            class="wechat-input"
            type="text"
            v-model="wechat"
            maxlength="20"
            placeholder="怎么找到你~~"
          />
        </view>
      </view>
    </view>
    <button class="btn" @click="submit">提交</button>
  </view>
</template>

<style lang="scss" scoped>
.container {
  background: #ffffff;
  font-size: 15px;
  .text {
    height: 110px;
  }
  .row {
    border-bottom: 1px #e8e8e8 solid;
    padding: 5px 15px;
    .name {
      width: 80%;
      height: 40px;
      line-height: 40px;
    }
    .input {
      width: 100%;
      height: 85px;
      font-size: 14px;
      padding-top: 5px;
    }
    .word-count {
      float: right;
      color: #808080;
    }
    .img-count {
      float: right;
      line-height: 40px;
      color: #808080;
    }
    .add-img {
      width: 80px;
      height: 80px;
    }
    .img {
      width: 66px;
      height: 66px;
      margin-bottom: 7px;
      margin-right: 10px;
    }
    .wechat-input {
      font-size: 14px;
    }
  }
}
.btn {
  margin: 20px auto;
  width: 90%;
  border-radius: 5px;
  background: #ea5149;
  font-size: 16px;
  color: #ffffff;
  font-weight: bold;
}
</style>
