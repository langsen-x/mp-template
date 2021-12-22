<template>
  <view class="canvasBox">
    <view class="header">
      <slot name="title"></slot>
      <button class="btn" @click="clear">擦除重写</button>
    </view>
    <canvas id="canvas" :disable-scroll="true"
            type="2d"
            @touchmove="touchmove"
            @touchstart="touchstart">
    </canvas>
  </view>
</template>

<script>
/**
 * 手写签名组件
 */
export default {
  props: {
    /**
     * 签名板的placeholder
     */
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      canvas: null,
      context: null,
      write: false,
    }
  },
  onReady() {
    let query = wx.createSelectorQuery().in(this)
    query.select('#canvas').boundingClientRect(data => {
      console.log('data: ', data)
      const {
        left,
        top,
        width,
        height,
      } = data
      this.left = left
      this.top = top
      this.width = width
      this.height = height
      // this.initCanvas()
    }).exec()
    query.select('#canvas').fields({
      node: true,
      size: true,
    }).exec(res => {
      console.log('res: ', res)
      const canvas = res[1].node
      this.canvas = canvas
      this.context = canvas.getContext('2d')
      this.initCanvas()
    })
  },
  methods: {
    initCanvas() {
      // 设置画笔
      // this.context = uni.createCanvasContext('canvas', this)
      this.context.lineWidth = 2
      this.context.strokeStyle = 'black'
      this.context.lineCap = 'round'
      this.context.lineJoin = 'round'

      this._clearPixel()
      this._drawPlaceholder()
    },
    _clearPixel() {
      // 填充白色
      this.context.fillStyle = 'white'
      this.context.fillRect(0, 0, this.width, this.height)
    },
    _drawPlaceholder() {
      this.context.font = '12px serif'
      this.context.fillStyle = '#D9D7D7'
      this.context.textAlign = 'center'
      this.context.textBaseline = 'middle'
      this.context.fillText(this.placeholder, this.width / 2 - 5, this.height / 2 - 5)
      // this.context.draw(true)
    },
    touchstart(evt) {
      const point = {}
      point.x = evt.touches[0].x + 0.5
      point.y = evt.touches[0].y + 0.5

      this.context.beginPath()
    },
    touchmove(evt) {
      if (!this.hasWrite()) {
        // 清除placeholder文本
        this._clearPixel()
      }

      const point = {}
      point.x = evt.touches[0].x + 0.5
      point.y = evt.touches[0].y + 0.5

      this.context.lineTo(point.x, point.y)
      this.context.stroke()
      // this.context.draw(true)
      this.context.moveTo(point.x, point.y)

      this.write = true
    },
    clear() {
      this._clearPixel()
      this._drawPlaceholder()

      this.write = false
    },
    save() {
      return new Promise((resolve, reject) => {
        uni.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: this.width,
          height: this.height,
          destWidth: this.width,
          destHeight: this.height,
          canvas: this.canvas,
          success: (res) => {
            this.$api.uploadAndOcr(res.tempFilePath, { isAnalysis: '' }).then(resp => {
              const {
                code,
                data,
                msg,
              } = JSON.parse(resp[1].data)
              if (code === this.$API_STATUS.SUCCESS) {
                resolve({
                  success: true,
                  data: data,
                  msg: msg,
                })
              } else {
                reject({
                  success: false,
                  msg: msg,
                })
              }
            })
          },
          fail: (res) => {
            reject({
              success: false,
              msg: res.errMsg,
            })
          },
        }, this)
      })
    },
    hasWrite() {
      return this.write
    },
  },
}
</script>

<style scoped lang="scss">
.canvasBox {
  width: 100%;
  //height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 upx(40);

    .btn {
      display: flex;
      height: upx(50);
      align-items: center;
      font-size: upx(24);
      color: #4DA0FF;
      background-color: #EBF4FF;
      border-radius: upx(30);
      padding: 0 upx(22);
    }
  }

  canvas {
    border: upx(3) dashed #EDEDED;
    box-sizing: border-box;
    width: 100%;
    height: upx(320);
  }
}
</style>
