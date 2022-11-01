export function showSuccess(text) {
  uni.showToast({
    title: text,
    icon: "success",
    duration: 2000
  })
}

export function showModel(title, content) {
  uni.showModal({
    title: title,
    content: content,
    showCancel: false
  })
}

export function callCloudFunction(name, api, data) {
  return new Promise((resolve, reject) => {
    uniCloud.callFunction({
      name: name,
      data: {
        api: api,
        data
      }
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  });
}
