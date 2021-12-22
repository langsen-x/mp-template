<template>
  <base-layout>
    <template #main>
      <view class="panel">
        <view class="row">
          <button class="row__btn" @click="openCommonDialog">通用弹窗</button>
        </view>
      </view>
      <view class="panel">
        <base-cell class="cell" :icon="clearIcon" :value.sync="form.name" input-type="text"
                   is-clear label="姓名" placeholder="请输入姓名"></base-cell>
        <base-cell class="cell" :icon="clearIcon" :value.sync="form.phone" input-type="number"
                   label="手机号" placeholder="请输入手机号" :max-length="11" @icon="iconEvent"></base-cell>
        <base-cell class="cell" label="证件类型" use-slot>
          <template #component>
            <view class="picker-com">
              <picker class="picker-com__content" :value="form.cardType ? Number(form.cardType) - 1 : 0"
                      :range="cardTypePicker"
                      range-key="text"
                      @change="changePicker">
                <p :class="form.cardType ? 'value' : 'value value__placeholder'">{{ form.cardType || '请选择证件类型' }}</p>
              </picker>
              <img :src="arrowIcon" alt="" class="picker-com__icon">
            </view>
          </template>
        </base-cell>
        <base-cell class="cell" :value.sync="form.cardNo" input-type="idcard" label="证件号"
                   placeholder="请输入证件号" :max-length="18">
          <p>这是插槽</p>
        </base-cell>
        <base-cell class="cell" label="所在地区" use-slot>
          <template #component>
            <multi-picker style="width: 100%;" :arr-source="addressList" is-three
                          :picker-index.sync="form.districtIndex" placeholder="请选择省市区" placeholder-color="#666666"
                          :value="form.district" @confirm="getAddress"></multi-picker>
          </template>
        </base-cell>
        <base-cell class="cell" label="性别" use-slot>
          <template #component>
            <base-radio-group :active-icon="iconRadioSelected" :inactive-icon="iconRadioUnSelect"
                              :items.sync="genderList" @click="chooseGender"></base-radio-group>
          </template>
        </base-cell>
        <base-cell class="cell" label="出生日期" use-slot>
          <template #component>
            <view class="picker-com">
              <picker class="picker-com__content" mode="date" value="2021-12-17" start="2021-12-17" end="2022-12-17"
                      @change="chooseBirthday">
                <p :class="form.birthday ? 'value' : 'value value__placeholder'">{{ form.birthday || '请选择出生日期' }}</p>
              </picker>
              <img :src="arrowIcon" alt="" class="picker-com__icon">
            </view>
          </template>
        </base-cell>
        <base-cell class="cell" label="多列选择器" use-slot>
          <template #component>
            <multi-picker style="width: 100%;" :arr-source="multiData" placeholder="请选择"
                          placeholder-color="#666666" :value="multiDataTest" @confirm="getMulti"></multi-picker>
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
import MultiPicker from '@components/multi-picker/multi-picker'
import areaData from '@config/area.json'
import BaseButton from '@components/base-button/base-button'
import BaseModal from '@components/base-modal/base-modal'
import BaseCell from '@components/base-cell/base-cell'
import arrowIcon from '@static/images/icon-arrow-right.png'
import clearIcon from '@static/images/icon-clear.png'
import BaseRadioGroup from '@components/base-radio-group/base-radio-group'
import iconRadioSelected from '@static/images/icon-selected.png'
import iconRadioUnSelect from '@static/images/icon-unselect.png'

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
      boolenList: ['showCommonDialog'],
    }
  },
  onShow() {
    console.log('component:show')
  },
  onReady() {
    // 如果有动画渲染时间会增加
    console.log('component:ready')
    // wx.enableAlertBeforeUnload({ message: '是否返回' })
  },
  computed: {
    showPageContainer() {
      return this.boolenList.some(i => this[i] === true)
    },
  },
  methods: {
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

    changePicker(e) {
      this.form.cardType = (Number(e.target.value) + 1).toString()
    },
    chooseBirthday(e) {
      this.form.birthday = e.detail.value
    },
    getAddress(e) {
      this.form.district = (e?.[0] || []).join('')
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
  width: upx(690);
  min-height: upx(300);
  margin: 0 auto upx(30);
  background: #FFFFFF;
  border-radius: upx(18);
  box-sizing: border-box;

  &:nth-of-type(2) {
    padding: 0 upx(30);
  }

  .cell {
    width: 100%;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: upx(20);

    &__btn {
      width: upx(200);
      height: upx(100);
      line-height: upx(100);
      border: upx(1) #cccccc solid;
      font-size: upx(28);
    }

    p {
      font-size: upx(28);
      font-weight: bold;
      color: #333333;
      line-height: upx(28);
    }
  }

  .confirm-btn {
    width: 100%;

    ::v-deep button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: upx(630);
      height: upx(100);
      background: #1AAD19;
      border-radius: upx(55);
      font-size: upx(34);
      font-weight: 400;
      color: #FFFFFF;
      line-height: upx(34);
    }
  }
}

.common-modal {
  ::v-deep .modal-wrapper > .modal {
    width: upx(600);
    height: auto;
    margin: 0 auto;
  }

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: upx(40) 0 0;
    box-sizing: border-box;
    position: relative;

    .title {
      font-size: upx(32);
      font-weight: bold;
      color: #333333;
      line-height: upx(32);
    }

    .close {
      width: upx(30);
      height: upx(30);
      background-image: url("../../static/images/icon-close.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      position: absolute;
      top: upx(20);
      right: upx(20);
    }
  }

  .content {
    width: 100%;
    padding: upx(60) upx(40) upx(40);
    box-sizing: border-box;

    p {
      font-size: upx(28);
      font-weight: bold;
      color: #333333;
      line-height: upx(28);
      margin-bottom: upx(20);
    }
  }

  .footer {
    width: 100%;
    padding: 0 0 upx(40);
    box-sizing: border-box;

    .footer-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: upx(400);
      height: upx(100);
      margin: 0 auto;
      font-size: upx(34);
      font-weight: 400;
      color: #FFFFFF;
      background: #1aad19;
    }
  }
}

.picker-com {
  display: flex;
  align-items: center;
  width: 100%;

  &__content {
    flex: 1;

    .value {
      font-size: upx(30);
      color: #333333;

      &__placeholder {
        color: #666666;
      }
    }
  }

  &__icon {
    width: upx(32);
    height: upx(32);
  }
}
</style>
