<script setup>
// 引入区域
// import { onShow, onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
// 观察者区

// 定义变量区
const defaultAvartaUrl = '../../static/images/defaultAvatar.png'
const avatar = ref(defaultAvartaUrl)
const nickname = ref('') //为了清空提交后的输入框
// 定义方法区
const login = async e => {
  if (avatar.value === defaultAvartaUrl || !e.detail.value.nickname) {
    return uni.showToast({
      title: '头像或者昵称不能为空',
      icon: 'none'
    })
  }

  //上传用户头像到数据库
  const { success } = await _uplaodAvatar(avatar.value)
  if (!success)
    return uni.showToast({
      title: '用户头像保存失败',
      icon: 'none'
    })

  // 准备注册的数据
  uni.showLoading({
    title: '登录中...',
    mask: true
  })

  uni
    .login()
    .then(({ code }) => {
      console.log('code', code) //拿到用户的code 请求后台获取openid
      uniCloud
        .callFunction({
          name: 'zhenzilv',
          data: {
            api: 'userlogin',
            code,
            avatar: avatar.value,
            nickname: e.detail.value.nickname
          }
        })
        .then(res => {
          uni.hideLoading()
          uni.showToast({
            title: '登录成功',
            icon: 'success'
          })
          console.log('拿到用户信息为：', res.result)
          // 把用户信息保存到localStorage里
          uni.setStorageSync('user', JSON.stringify(res.result.user))
          uni.setStorageSync('token', res.result.token)
          uni.navigateBack()
        })
        .catch(err => {
          uni.hideLoading()
          uni.showToast({
            title: '登录失败'
          })
          console.log('获取用户信息失败', err)
        })
    })
    .catch(err => {
      console.log(err)
    })
  nickname.value = null //提交后清空输入框
}
const reset = () => {
  console.log('reset')
}
const onChooseAvatar = e => {
  const { avatarUrl } = e.detail

  // 如果这里上传用户的头像就会造成被别人攻击,必须在提交的时候在再上传到云存储库中
  avatar.value = avatarUrl
}

//上传用户头像功能
const _uplaodAvatar = async avatarUrl => {
  return new Promise((resolve, reject) => {
    let avatarName = avatarUrl.substring(avatarUrl.lastIndexOf('/') + 1, avatarUrl.length)
    let avatarProfile = avatarName.substring(avatarName.lastIndexOf('.') + 1, avatarName.length)
    console.log('avatarProfile: ', avatarProfile)

    // 上传头像到云数据库，注意这里需要检查图片是否已经在云库中，如果没有再在上传（todo）

    const cloudPath = `userAvatar/${Date.now()}.${avatarName}`
    uni.showLoading({
      title: '头像上传中'
    })
    uniCloud
      .uploadFile({
        filePath: avatarUrl,
        cloudPath
      })
      .then(res => {
        uni.hideLoading()
        if (res.success) {
          uni.showToast({
            title: '头像上传成功'
          })
          // 保存返回的云地址
          avatar.value = res.fileID //拿到缓存中的头像
          resolve({ success: true })
        }
      })
      .catch(err => {
        console.log('err: ', err)
        reject({ success: false })
      })
  })
}

// 生命周期区
</script>

<template>
  <view class="login-container">
    <form class="form" @submit="login" @reset="reset">
      <button class="avt-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
        <image :src="avatar" class="avt-image"></image>
      </button>
      <input
        class="inputstyle"
        name="nickname"
        v-model="nickname"
        type="nickname"
        placeholder="请输入昵称"
      />
      <view class="btn-submit">
        <button type="primary" class="btn" form-type="submit">提交</button>
        <button type="warn" class="btn" form-type="reset">重置</button>
      </view>
    </form>
  </view>
</template>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;

  .form {
    width: 100%;
    margin-top: 300rpx;
    display: flex;
    flex-direction: column;
  }
}

.avt-btn {
  border: none !important;
  background-color: inherit !important;
  border-radius: 0 !important;
  width: fit-content !important;
  height: fit-content !important;
  line-height: 0;
  padding: 0;
  .avt-image {
    width: 130rpx;
    height: 130rpx;
    border-radius: 50%;
  }
}
.avt-btn::after {
  border: none;
}

.inputstyle {
  padding: 20rpx;
  margin: 50rpx;
  font-size: 30rpx;
  border: 1px solid #9d9d9d;
}
.btn-submit {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40rpx;
  .btn {
    padding: 0 60rpx;
    margin: 0;
  }
}
</style>
