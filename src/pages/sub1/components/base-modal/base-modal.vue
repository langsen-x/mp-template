<template>
  <view v-if="show" class="modal-wrapper" @touchmove.prevent>
    <view class="mask"></view>
    <view class="modal">
      <!-- @slot header -->
      <slot name="header"/>
      <!-- @slot content -->
      <slot name="content"/>
      <!-- @slot footer -->
      <slot name="footer"/>
    </view>
  </view>
</template>

<script>
/**
 * modal组件
 */
export default {
  model: {
    prop: 'show',
    event: 'change',
  },
  props: {
    /**
     * 显隐
     */
    show: {
      type: Boolean,
    },
  },
  methods: {
    close() {
      this.$emit('change', false)
    },
  },
}
</script>

<style scoped lang="scss">
.modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(17, 17, 17, 0.7);
  z-index: 100;
}

.modal-wrapper > .modal {
  width: 600px;
  min-height: 300px;
  margin: 0 auto;
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  z-index: 100;
  animation-name: zoomIn;
  animation-duration: .2s;
  animation-timing-function: ease-in-out;
}
</style>
