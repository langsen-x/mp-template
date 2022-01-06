<template>
  <base-layout>
    <template #main>
      <view class="panel">
        <view class="row">
          <button class="row__btn" @click="openCommonDialog">通用弹窗</button>
        </view>
        <view class="row">
          <button class="row__btn" open-type="getUserInfo" @click="getUserProfile">授权获取信息</button>
        </view>
        <view class="row" v-show="qrCodeImg">
          <img :src="qrCodeImg" alt="" class="qrCode" show-menu-by-longpress v-if="qrCodeImg">
          <canvas id="qrCode" class="qrCode" canvas-id="qrCode" type="2d" v-else></canvas>
        </view>
      </view>
      <view class="panel">
        <base-cell class="cell" :icon="clearIcon" :value.sync="form.name" input-type="text"
                   is-clear label="姓名" placeholder="请输入姓名"></base-cell>
        <base-cell class="cell" :icon="clearIcon" :value.sync="form.phone" input-type="number"
                   label="手机号" placeholder="请输入手机号" :max-length="11" @icon="iconEvent"></base-cell>
        <base-cell class="cell" label="证件类型" use-slot>
          <template #component>
            <picker class="picker-com" :value="form.cardType ? Number(form.cardType) - 1 : 0"
                    :range="cardTypePicker"
                    range-key="text"
                    @change="chooseCardType">
              <view class="picker-com__content">
                <p :class="form.cardType ? 'value' : 'value value__placeholder'">
                  {{ cardTypeName[form.cardType] || '请选择证件类型' }}</p>
                <img :src="arrowIcon" alt="" class="picker-com__icon">
              </view>
            </picker>
          </template>
        </base-cell>
        <base-cell class="cell" :value.sync="form.cardNo" input-type="idcard" label="证件号"
                   placeholder="请输入证件号" :max-length="18">
          <p :style="{marginLeft: $toRpx(10), fontSize: $toRpx(30)}">这是插槽</p>
        </base-cell>
        <base-cell class="cell" label="所在地区" use-slot>
          <template #component>
            <picker class="picker-com" mode="region" @change="chooseAddress">
              <view class="picker-com__content">
                <p :class="form.district ? 'value' : 'value value__placeholder'">{{ form.district || '请选择所在地区' }}</p>
                <img :src="arrowIcon" alt="" class="picker-com__icon">
              </view>
            </picker>
          </template>
        </base-cell>
        <base-cell class="cell" label="性别" use-slot>
          <template #component>
            <base-radio-group :active-icon="iconRadioSelected" :inactive-icon="iconRadioUnSelect"
                              :items.sync="genderList" @click="chooseGender">
            </base-radio-group>
          </template>
        </base-cell>
        <base-cell class="cell" label="出生日期" use-slot>
          <template #component>
            <picker class="picker-com" mode="date" value="2021-12-17" start="2021-12-17" end="2022-12-17"
                    @change="chooseBirthday">
              <view class="picker-com__content">
                <p :class="form.birthday ? 'value' : 'value value__placeholder'">{{ form.birthday || '请选择出生日期' }}</p>
                <img :src="arrowIcon" alt="" class="picker-com__icon">
              </view>
            </picker>
          </template>
        </base-cell>
        <base-cell class="cell" label="多列选择器" use-slot :border="false">
          <template #component>
            <multi-picker style="width: 100%;" :arr-source="multiData" :picker-index.sync="multiDataIndex"
                          placeholder="请选择" placeholder-color="#666666"
                          :value="multiDataTest" @confirm="getMulti">
            </multi-picker>
          </template>
        </base-cell>
        <view class="row">
          <base-button :loading="confirmLoading" class="confirm-btn" loading-text="确认中"
                       @click.native="confirm">确认
          </base-button>
        </view>
      </view>
    </template>

    <template #modal>
      <!--      假性容器 页面内有弹出层之类的遮罩层容器 返回时应关闭遮罩（关闭当前这个假性容器 页面只能有一个） 而不应该直接返回页面-->
      <page-container :show="showPageContainer" :overlay="false" @beforeleave="pageBeforeLeave"></page-container>

      <base-modal :show="showCommonDialog" class="common-modal">
        <template #header>
          <view class="header">
            <p class="title">标题</p>
            <view class="close" @click="closeCommonDialog"></view>
          </view>
        </template>
        <template #content>
          <view class="content">
            <p>这是内容</p>
            <p>这是内容这是内容这是内容这是内容这是内容</p>
          </view>
        </template>
        <template #footer>
          <view class="footer">
            <button class="footer-btn" @click="confirmCommonDialog">确定</button>
          </view>
        </template>
      </base-modal>
    </template>
  </base-layout>
</template>

<script>
import MultiPicker from '../components/multi-picker/multi-picker'
import BaseButton from '../components/base-button/base-button'
import BaseModal from '../components/base-modal/base-modal'
import BaseCell from '../components/base-cell/base-cell'
import BaseRadioGroup from '../components/base-radio-group/base-radio-group'
import areaData from '@config/area.json'
import arrowIcon from '@static/images/icon-arrow-right.png'
import clearIcon from '@static/images/icon-clear.png'
import iconRadioSelected from '@static/images/icon-selected.png'
import iconRadioUnSelect from '@static/images/icon-unselect.png'
import drawQrcode from '@utils/weapp.qrcode.esm.js'
import qrCodeCover from '@static/uni.png'

const CARD_TYPE = {
  SFZ: '1',
  HZ: '2',
}
const CARD_TYPE_NAME = {
  [CARD_TYPE.SFZ]: '身份证',
  [CARD_TYPE.HZ]: '护照',
}

export default {
  components: {
    MultiPicker,
    BaseButton,
    BaseModal,
    BaseCell,
    BaseRadioGroup,
  },
  data() {
    return {
      iconRadioSelected,
      iconRadioUnSelect,
      genderList: [
        {
          label: '男',
          value: '1',
          checked: false,
        },
        {
          label: '女',
          value: '2',
          checked: false,
        },
      ],
      addressList: areaData,
      showCommonDialog: false,
      confirmLoading: false,
      arrowIcon,
      clearIcon,
      form: {
        name: '',
        phone: '',
        cardType: '',
        cardNo: '',
        birthday: '',
        gender: '',
        district: '',
        districtIndex: [0, 0, 0],
      },
      multiDataTest: '',
      multiDataIndex: [0, 0],
      multiData: [
        {
          label: '设备',
          value: 'devices',
          children: [
            {
              label: '手机',
              value: 'mobile',
            },
            {
              label: '平板',
              value: 'ipad',
            },
            {
              label: '笔记本',
              value: 'laptop',
            },
          ],
        },
        {
          label: '交通工具',
          value: 'transports',
          children: [
            {
              label: '飞机',
              value: 'plane',
            },
            {
              label: '火车',
              value: 'train',
            },
            // {
            //   label: '汽车',
            //   value: 'car',
            // },
          ],
        },
      ],
      cardTypePicker: [
        {
          text: '身份证',
          value: '1',
        },
        {
          text: '护照',
          value: '2',
        },
      ],
      cardTypeName: CARD_TYPE_NAME,
      boolenList: ['showCommonDialog'],
      systemInfo: {
        windowWidth: 375,
      },
      qrCodeImg: null,
    }
  },
  onLoad(obj) {
    console.log('obj:', obj)
    console.log('Page Load')
    this.genQrCode()
  },
  onShow() {
    console.log('Page Show')
  },
  onReady() {
    // 如果有动画渲染时间会增加
    console.log('Page Ready')
    // wx.enableAlertBeforeUnload({ message: '是否返回' })
  },
  computed: {
    size() {
      return function(num) {
        return num * this.systemInfo.windowWidth / 375
      }
    },
    showPageContainer() {
      return this.boolenList.some(i => this[i] === true)
    },
  },
  methods: {
    getUserProfile(e) {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.userInfo = res?.userInfo
          console.log('this.userInfo:', this.userInfo)
        },
        fail: () => {
          this.$toast('用户取消授权')
        },
      })
    },
    genQrCode() {
      uni.getSystemInfo({
        success: (res) => {
          this.systemInfo = res
          // console.log(res.model)
          // console.log(res.pixelRatio)
          // console.log(res.windowWidth)
          // console.log(res.windowHeight)
          // console.log(res.language)
          // console.log(res.version)
          // console.log(res.platform)
        },
        complete: () => {
          this.initQrCode()
        },
      })
    },
    initQrCode() {
      const query = uni.createSelectorQuery()
      query.select('#qrCode')
        .fields({
          node: true,
          size: true,
        })
        .exec(async(res) => {
          const canvas = res[0].node

          const img = canvas.createImage()
          img.src = qrCodeCover
          img.onload = () => {
            const options = {
              canvas: canvas,
              canvasId: 'qrCode',
              x: 0,
              y: 0,
              width: this.size(120),
              padding: 10,
              text: 'https://gitee.com/WeiDoctor/weapp-qrcode-canvas-2d',
              image: {
                imageResource: img,
                width: this.size(40),
                height: this.size(40),
                round: false,
              },
            }
            drawQrcode(options)
            uni.canvasToTempFilePath({
              canvas: canvas,
              canvasId: 'qrCode',
              x: 0,
              y: 0,
              width: this.size(120),
              height: this.size(120),
              success: (res) => {
                console.log('二维码临时路径：', res.tempFilePath)
                this.qrCodeImg = res.tempFilePath
              },
              fail: (res) => {
                console.error(res)
              },
            })
          }
        })
    },
    pageBeforeLeave() {
      if (this.showPageContainer) {
        this.boolenList.forEach(i => {
          this[i] = false
        })
      }
    },
    //
    openCommonDialog() {
      this.showCommonDialog = true
    },
    closeCommonDialog() {
      this.showCommonDialog = false
    },
    confirmCommonDialog() {
      this.closeCommonDialog()
    },
    //
    confirm() {
      this.confirmLoading = true
      setTimeout(() => {
        this.confirmLoading = false
      }, 3000)
    },

    iconEvent() {
      this.form.phone = ''
    },

    chooseGender(e) {
      this.form.gender = e.value
    },

    chooseCardType(e) {
      this.form.cardType = (Number(e.target.value) + 1).toString()
    },
    chooseBirthday(e) {
      this.form.birthday = e.detail.value
    },
    chooseAddress(e) {
      this.form.district = (e.detail?.value || []).join('')
    },

    getMulti(e) {
      this.multiDataTest = (e?.[0] || []).join('-')
    },
  },
}
</script>

<style scoped lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 690px;
  min-height: 300px;
  margin: 0 auto 30px;
  background: #FFFFFF;
  border-radius: 18px;
  box-sizing: border-box;

  &:nth-of-type(2) {
    padding: 0 30px;
  }

  .cell {
    width: 100%;

    ::v-deep {
      .base-cell {
        height: 100px;
      }
    }
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 20px;

    &__btn {
      width: 200px;
      height: 100px;
      line-height: 100px;
      border: 1px #cccccc solid;
      font-size: 28px;
    }

    p {
      font-size: 28px;
      font-weight: bold;
      color: #333333;
      line-height: 28px;
    }

    .qrCode {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 240px;
      height: 240px;
      margin: 0 0 50px;
    }
  }

  .confirm-btn {
    width: 100%;

    ::v-deep button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 630px;
      height: 100px;
      background: #1AAD19;
      border-radius: 55px;
      font-size: 34px;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 34px;
    }
  }
}

.common-modal {
  ::v-deep .modal-wrapper > .modal {
    width: 600px;
    height: auto;
    margin: -100px auto 0;
  }

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 40px 0 0;
    box-sizing: border-box;
    position: relative;

    .title {
      font-size: 32px;
      font-weight: bold;
      color: #333333;
      line-height: 32px;
    }

    .close {
      width: 30px;
      height: 30px;
      background-image: url("../../../static/images/icon-close.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }

  .content {
    width: 100%;
    padding: 60px 40px 40px;
    box-sizing: border-box;

    p {
      font-size: 28px;
      font-weight: bold;
      color: #333333;
      line-height: 28px;
      margin-bottom: 20px;
    }
  }

  .footer {
    width: 100%;
    padding: 0 0 40px;
    box-sizing: border-box;

    .footer-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 400px;
      height: 100px;
      margin: 0 auto;
      font-size: 34px;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 34px;
      background: #1aad19;
    }
  }
}

.picker-com {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;

  &__content {
    display: flex;
    align-items: center;
    //width: 100%;
    width: 440px;
    height: 100px;

    .value {
      font-size: 30px;
      color: #333333;
      line-height: 30px;
      flex: 1;

      &__placeholder {
        color: #666666;
      }
    }
  }

  &__icon {
    width: 32px;
    height: 32px;
    margin-left: 10px;
  }
}
</style>
