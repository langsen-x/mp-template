import Vue from 'vue'
import api from '@api'
import API_STATUS from '@status'

Vue.prototype.$toast = function toast(message, icon = 'none') {
  uni.showToast({
    title: message,
    icon: icon,
    duration: 2000,
  })
}

Vue.prototype.$showLoading = function(message = '加载中') {
  uni.showLoading({
    title: message,
  })
}
Vue.prototype.$hideLoading = function() {
  uni.hideLoading()
}

Vue.prototype.$makePhoneCall = function(phoneNumber) {
  uni.makePhoneCall({
    phoneNumber: phoneNumber,
  })
}

Vue.prototype.$api = api
Vue.prototype.$API_STATUS = API_STATUS
