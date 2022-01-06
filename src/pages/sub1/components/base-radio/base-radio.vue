<template>
  <view :style="{fontSize: `${Number(fontSize)}rpx`}" class="radio" @click="handleClick">
    <img
      :src="checked ? activeIcon : inactiveIcon"
      :style="{width: `${Number(iconSize)}rpx`, height: `${Number(iconSize)}rpx`, marginRight: `${Number(marginRight)}rpx`}"
      alt=""/>
    <p v-if="items">{{ items }}</p>
    <slot name="default"/>
  </view>
</template>

<script>
export default {
  props: {
    /**
     * 是否选中
     */
    checked: {
      type: Boolean,
      default: false,
    },
    /**
     * 选项文字字体大小
     */
    fontSize: {
      type: [Number, String],
      default: 30,
    },
    /**
     * 选项图标大小
     */
    iconSize: {
      type: [Number, String],
      default: 36,
    },
    /**
     * 选项文字（单）
     */
    items: {
      type: String,
      default: '',
    },
    /**
     * 选项图标与文字间隔
     */
    marginRight: {
      type: [Number, String],
      default: 20,
    },
    /**
     * 选项图标（选中状态）
     */
    activeIcon: {
      type: String,
      default: '',
    },
    /**
     * 选项图标（未选中状态）
     */
    inactiveIcon: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleClick() {
      this.$emit('click')
    },
  },
}
</script>

<style scoped lang="scss">
.radio {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 400;
  color: #333;
}
</style>
