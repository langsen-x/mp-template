import Vue from 'vue'
import { CommonUtil } from 'sn-js-utils'
import { toFixed } from '@utils'

// 定义所有的过滤器
const filters = {
  maskPhone: function(phone) {
    return CommonUtil.mask(phone, 3, 4)
  },
  maskCard: function(card) {
    return CommonUtil.mask(card, 4, 3)
  },
  maskName: function(name) {
    return CommonUtil.maskName(name)
  },
  formatPrice: function(price) {
    if (!price) {
      return ''
    }
    return '￥' + toFixed(price, 2)
  },
}

for (const key in filters) {
  Vue.filter(key, filters[key])
}
