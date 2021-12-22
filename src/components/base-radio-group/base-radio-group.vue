<template>
  <view class="radio-group">
    <view v-for="(i, idx) in items" :key="idx" :style="{fontSize: `${Number(fontSize)}rpx`}" class="radio"
          @click="handleClick(i)">
      <img
        :src="i.checked ? activeIcon : inactiveIcon"
        :style="{width: `${Number(iconSize)}rpx`, height: `${Number(iconSize)}rpx`, marginRight: `${Number(marginRight)}rpx`}"
        alt=""/>
      <p v-if="i.label">{{ i.label }}</p>
      <slot name="default"/>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    /**
     * 选项类型（single单选, else多选）
     */
    type: {
      type: String,
      default: 'single',
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
     * 选项数据
     */
    items: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [
        {
          id: 1,
          label: '1',
          checked: false,
        },
        {
          id: 2,
          label: '2',
          checked: false,
        },
        {
          id: 3,
          label: '3',
          checked: false,
        },
      ],
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
  data() {
    return {
      multi: [], // 多选push进里面
    }
  },
  methods: {
    handleClick(e) {
      if (this.type === 'single') {
        this.items.map((i, idx) => {
          if (i === e) {
            i.checked = !i.checked
          } else {
            i.checked = false
          }
        })
        this.$emit('click', e)
      } else {
        this.items.map((i, idx) => {
          if (i === e) {
            i.checked = !i.checked
          }
        })
        this.multi = this.items.filter(i => i.checked)
        this.$emit('click', this.multi)
      }
      this.$emit('update:items', this.items)
    },
  },
}
</script>

<style scoped lang="scss">
.radio-group {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .radio {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-weight: 400;
    color: #333333;
    margin-right: upx(60);
  }
}
</style>
