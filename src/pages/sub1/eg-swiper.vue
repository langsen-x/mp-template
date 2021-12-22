<template>
  <view class="eg-swiper">
    <swiper class="swiper">
      <swiper-item class="swiper-item" v-for="item in swiperList" :key="item.label">
        <base-layout style="height: 100%;">
          <template #header>
            <view class="header"></view>
          </template>
          <template #main>
            <view class="middle"></view>
          </template>
          <template #footer>
            <view class="footer"></view>
          </template>
        </base-layout>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  name: 'eg-swiper',
  data() {
    return {
      swiperList: [
        {
          label: '1',
          value: '',
        },
        {
          label: '2',
          value: '',
        },
        {
          label: '3',
          value: '',
        },
        {
          label: '4',
          value: '',
        },
      ],
    }
  },
}
</script>

<style scoped lang="scss">
.eg-swiper {
  width: 100%;
  height: 100%;
  padding: upx(30) 0;
  box-sizing: border-box;
}

.swiper {
  width: 100%;
  height: 100%;
  //background: #F9F9F9;

  .swiper-item {
    padding: 0 upx(30);
    box-sizing: border-box;

    .header {
      width: 100%;
      height: upx(300);
      background-color: #c8c7cc;
      border-radius: upx(16) upx(16) 0 0;
    }

    .middle {
      background-color: #cccccc;
      width: 100%;
      height: upx(1200);
    }

    .footer {
      width: 100%;
      height: upx(100);
      background-color: #D9D9D9;
      border-radius: 0 0 upx(16) upx(16);
    }
  }
}
</style>
