<template>
  <view class="layout">
    <view class="header-view">
      <slot name="header"/>
    </view>

    <scroll-view
      ref="scroller"
      :style="{backgroundColor: bgColor}"
      class="scroll-view"
      scroll-with-animation
      scroll-y
      @scroll="onScroll">
      <slot name="main"/>
    </scroll-view>

    <view class="footer-view">
      <slot name="footer"/>
    </view>

    <slot name="modal"/>
  </view>
</template>

<script>

export default {
  name: 'base-layout',
  props: {
    /**
     * 背景颜色
     */
    bgColor: {
      type: String,
      default: '#F9F9F9',
    },
  },
  methods: {
    onScroll(e) {
      this.$emit('scroll', e)
    },
  },
}
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
}

.header-view {
  width: 100%;
}

.scroll-view {
  width: 100%;
  flex: 1;
  overflow-y: auto;
}

.footer-view {
  width: 100%;
}
</style>
