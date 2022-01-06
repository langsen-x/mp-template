<template>
  <base-layout>
    <template #header>
      <view class="head">
        <p>这是头部</p>
      </view>
    </template>
    <template #main>
      <view class="main">
        <p>这是中部</p>
        <p>高度会根据头部与尾部的高度自动调整</p>
        <p>不会超过整个屏幕</p>
        <p>内容过长会出现滚动条</p>
        <view class="row">
          <button @click="goToComponent">组件示例</button>
        </view>
        <view class="row">
          <button @click="goToCard">滑动卡片示例</button>
        </view>
        <view class="row">
          <button @click="goUploadFile">上传文件</button>
        </view>
      </view>
    </template>
    <template #footer>
      <view class="foot">
        <p>这是尾部</p>
      </view>
    </template>
  </base-layout>
</template>

<script>
export default {
  name: 'index',
  methods: {
    goToComponent() {
      uni.navigateTo({
        url: '/pages/sub1/pages/component',
      })
    },
    goToCard() {
      uni.navigateTo({
        url: '/pages/sub1/pages/eg-swiper',
      })
    },
    goUploadFile() {
      uni.chooseImage({
        success: (chooseImageRes) => {
          this.$showLoading('上传中')
          const tempFilePath = chooseImageRes.tempFilePaths[0]
          this.$api.uploadFile(tempFilePath).then(resp => {
            const [error, res] = resp
            if (error) {
              this.$hideLoading()
              this.$toast(error.message)
            } else {
              const {
                code,
                data,
                msg,
              } = JSON.parse(res.data)
              this.$hideLoading()
              if (code === this.$API_STATUS.SUCCESS) {
                console.log('url:', data.url)
              } else {
                this.$toast(msg)
              }
              // console.log('chooseImageRes:', res)
            }
          })
        },
      })
    },
  },
}
</script>

<style scoped lang="scss">
.main {
  width: 100%;

  .row, p {
    padding: 20px 0;
  }

  .row {
    button {
      width: 200px;
      height: 100px;
      line-height: 100px;
      border: 1px #cccccc solid;
      font-size: 28px;
    }
  }
}
</style>
