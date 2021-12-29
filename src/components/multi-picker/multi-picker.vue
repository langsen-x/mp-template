<template>
  <view class="multi-picker">
    <picker class="picker"
            mode="multiSelector"
            :range-key="pickerKey"
            :value="pickerIndex"
            :range="pickerData"
            @change="pickerChange"
            @columnchange="columnChange">
      <p class="value" :style="!value ? `color: ${placeholderColor}` : ''">
        {{ value || placeholder }}
      </p>
    </picker>
    <img src="../../static/images/icon-arrow-right.png" alt="" class="icon">
  </view>
</template>

<script>
export default {
  name: 'multi-picker',
  props: {
    pickerKey: {
      type: String,
      default: 'label',
    },
    pickerValue: {
      type: String,
      default: 'value',
    },
    pickerIndex: {
      type: Array,
      default: () => [],
    },
    arrSource: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    placeholderColor: {
      type: String,
      default: '#CCCCCC',
    },
    isThree: {
      type: Boolean,
      default: false,  // 默认两列
    },
  },
  data() {
    return {
      pickerData: [],
      col1Value: 0,
      columnNum: this.isThree ? 3 : 2,
    }
  },
  created() {
    this.getColumns()
  },
  methods: {
    // 获取数据源并分出一级二级三级
    getColumns() {
      for (let i = 1; i < this.columnNum; i++) {
        this[`colArr${i}`] = []
      }

      const dataLen = this.arrSource.length
      for (let i = 0; i < dataLen; i++) {
        // 将数据源中的二级分类 push 进 secondArr，作为二级分类的数据源
        const nextColumn = this.arrSource[i].children
        this['colArr1'].push(nextColumn || [])

        this.isThree && this.lastColumn(nextColumn)
      }
      // console.log('colArr1', this['colArr1'])
      // console.log('lastArr:', this[`colArr${this.columnNum - 1}`])

      this.pickerData.length = this.columnNum
      const col1_arr = (this.arrSource || []).map((i) => {
        delete i.children
        return i
      })
      const col2_arr = (this['colArr1'][0] || []).map((i) => {
        delete i.children
        return i
      })
      if (this.isThree) {
        this.pickerData = [col1_arr, col2_arr, this['colArr2'][0][0]]
      } else {
        this.pickerData = [col1_arr, col2_arr]
      }
      // console.log('this.pickerData:', this.pickerData)
    },

    lastColumn(data = []) {
      const temp = []
      for (let j = 0; j < data.length; j++) {
        temp.push(data[j].children)
      }
      this['colArr2'].push(temp)
    },

    pickerChange(e) {
      // console.log('e:', e)
      const [idx1, idx2, idx3] = e.target.value
      let label = '', value = ''
      if (this.isThree) {
        label = [this.pickerData?.[0][idx1][this.pickerKey], this.pickerData?.[1][idx2][this.pickerKey], this.pickerData?.[2][idx3][this.pickerKey]]
        value = [this.pickerData?.[0][idx1][this.pickerValue], this.pickerData?.[1][idx2][this.pickerValue], this.pickerData?.[2][idx3][this.pickerValue]]
      } else {
        label = [this.pickerData?.[0][idx1][this.pickerKey], this.pickerData?.[1][idx2][this.pickerKey]]
        value = [this.pickerData?.[0][idx1][this.pickerValue], this.pickerData?.[1][idx2][this.pickerValue]]
      }
      // console.log('label value:', label, value)
      this.$emit('confirm', [label, value])
    },

    columnChange(e) {
      // console.log('e:', e)
      // 当滚动切换一级分类时，为当前的一级分类添加它的子类
      if (e.detail.column === 0) {
        this.col1Value = e.detail.value
        this.pickerIndex.splice(0, 1, this.col1Value)
        this.pickerIndex.splice(1, 1, 0)
        this.pickerData.splice(1, 1, this['colArr1'][this.col1Value])
        if (this.isThree) {
          this.pickerIndex.splice(2, 1, 0)
          this.pickerData.splice(2, 1, this['colArr2'][this.col1Value][0])
        }
      } else if (e.detail.column === 1) {
        this.pickerIndex.splice(1, 1, e.detail.value)
        if (this.isThree) {
          this.pickerIndex.splice(2, 1, 0)
          this.pickerData.splice(2, 1, this['colArr2'][this.col1Value][e.detail.value])
        }
      } else if (e.detail.column === 2) {
        this.pickerIndex.splice(2, 1, e.detail.value)
      }
      // console.log('this.pickerIndex:', this.pickerIndex)
      this.$emit('update:pickerIndex', this.pickerIndex)
    },
  },
}
</script>

<style scoped lang="scss">
.multi-picker {
  display: flex;
  align-items: center;
  width: 100%;

  .picker {
    flex: 1;

    .value {
      font-size: 30px;
      color: #333333;
    }
  }

  .icon {
    width: 32px;
    height: 32px;
  }
}
</style>
