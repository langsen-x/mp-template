<template>
  <view class="base-cell" :style="{borderBottom: border ? '1px #EFEFEF solid': 'unset'}">
    <p class="label">{{ label }}</p>
    <view class="right">
      <view class="slot" v-if="useSlot">
        <slot name="component"></slot>
      </view>
      <view class="slot" v-else>
        <p
            v-if="!inputType"
            :class="!value ? 'value value__placeholder' : 'value'"
            :style="{ textAlign: labelPortion }">
          {{ value ? value : placeholder }}
        </p>
        <input
            v-else
            :placeholder="placeholder"
            :style="{ textAlign: valuePortion }"
            :type="inputType"
            v-model="inputVal"
            :minlength="minLength"
            :maxlength="maxLength"
            class="value"
            @blur="blur"
            @focus="focus"
            @input="input"
        />
        <view class="icon-bg" v-if="showIcon" @click="iconClick">
          <img :src="icon" alt="" class="icon">
        </view>
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'base-cell',
  props: {
    /**
     * 行标题
     */
    label: {
      type: String,
      default: '标题',
    },
    /**
     * 行值
     */
    value: {
      type: String,
      default: 'value',
    },
    minLength: {
      type: Number,
      default: 0,
    },
    maxLength: {
      type: Number,
      default: 999,
    },
    /**
     * 行标题位置定位
     */
    labelPortion: {
      type: String,
      default: 'left',
      validator: function(value) {
        return ['left', 'center', 'right'].indexOf(value) !== -1
      },
    },
    /**
     * 行值位置定位
     */
    valuePortion: {
      type: String,
      default: 'left',
      validator: function(value) {
        return ['left', 'right'].indexOf(value) !== -1
      },
    },
    /**
     * 输入框类型
     */
    inputType: {
      type: String,
      default: '',
    },
    /**
     * 占位文字
     */
    placeholder: {
      type: String,
      default: '',
    },
    /**
     * 右边图标
     */
    icon: {
      type: String,
      default: '',
    },
    /**
     * 是否为清除图标（如果是一定要加上）
     */
    isClear: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否使用插槽
     */
    useSlot: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否有分界线
     */
    border: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    showIcon() {
      if (this.isClear) {
        return !!this.inputVal
      } else {
        return !!this.icon
      }
    },
  },
  watch: {
    value: {
      handler(val) {
        this.inputVal = val
      },
    },
    inputVal: {
      handler(val) {
        if (val !== this.value) {
          this.$emit('update:value', val)
        }
      },
    },
  },
  data() {
    return {
      isBlur: false,
      inputVal: this.value,
    }
  },
  methods: {
    input(e) {
    },
    blur() {
      setTimeout(() => {
        this.isBlur = false
      }, 50)
    },
    focus() {
      this.isBlur = true
    },

    iconClick() {
      if (this.isClear) {
        this.inputVal = ''
      } else {
        this.$emit('icon')
      }
    },
  },
}
</script>
<style scoped lang="scss">
.base-cell {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  min-height: 90px;
  background: #FFFFFF;
  box-sizing: border-box;

  .right, .slot {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }

  .label, .value {
    min-width: 190px;
    font-size: 30px;
    font-weight: 400;
    color: #333333;
    line-height: 30px;;
  }

  .value {
    flex: 1;

    &::placeholder, &__placeholder {
      color: #666666;
    }
  }

  .icon-bg {
    margin-left: 10px;

    .icon {
      width: 30px;
      height: 30px;
    }
  }
}
</style>
