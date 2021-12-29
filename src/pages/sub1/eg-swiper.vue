<template>
  <view class="eg-swiper">
    <scroll-view class="swiper-nav"
                 scroll-x
                 scroll-with-animation
                 :scroll-into-view="curSwiperNav"
                 enhanced
                 :show-scrollbar="false">
      <view class="nav-container"
            v-for="item in swiperList"
            :key="item.id"
            @click="changeSwiperItem(item.id)">
        <view :id="`nav${item.id}`"
              :class="curSwiper === item.id ? 'nav-container__item-active' : 'nav-container__item'">
          <p>{{ item.label }}</p>
        </view>
      </view>
    </scroll-view>
    <swiper class="swiper" :current="curSwiper" @change="getCurSwiperItem" circular>
      <swiper-item class="swiper-item" v-for="item in swiperList" :key="item.id">
        <base-layout style="height: 100%;">
          <template #header>
            <view class="header">
              <p class="header__ttf">{{ item.label }}</p>
              <p>{{ item.label }}</p>
            </view>
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
  watch: {
    curSwiper: {
      handler(val) {
        this.curSwiperNav = `nav${val}`
      },
    },
  },
  data() {
    return {
      swiperList: [
        {
          id: 0,
          label: '首页111',
          value: '',
        },
        {
          id: 1,
          label: '订单222',
          value: '',
        },
        {
          id: 2,
          label: '我的333',
          value: '',
        },
        {
          id: 3,
          label: '其他444',
          value: '',
        },
      ],
      curSwiper: 0,
      curSwiperNav: `nav${this.curSwiper}`,
    }
  },
  methods: {
    getCurSwiperItem(e) {
      this.curSwiper = e?.detail?.current
    },
    changeSwiperItem(id) {
      this.curSwiper = id
    },
  },
}
</script>

<style scoped lang="scss">
.eg-swiper {
  width: 100%;
  height: 100%;
}

.swiper-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100px;
  white-space: nowrap;

  .nav-container, .nav-container-active {
    display: inline-block;
    width: 200px;
    height: 100%;

    &__item, &__item-active {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      font-size: 28px;
      border: 1px #EFEFEF solid;
      box-sizing: border-box;
    }

    &__item-active {
      color: #1AAD19;
      border: 1px #1AAD19 solid;
      border-radius: 16px 16px 0 0;
    }
  }
}

.swiper {
  width: 100%;
  height: calc(100% - 100px);

  .swiper-item {
    .header {
      width: 100%;
      height: 300px;
      background-color: #c8c7cc;

      &__ttf {
        font-family: "DIN Alternate";
      }
    }

    .middle {
      background-color: #cccccc;
      width: 100%;
      height: 1200px;
    }

    .footer {
      width: 100%;
      height: 100px;
      background-color: #D9D9D9;
    }
  }
}
</style>
