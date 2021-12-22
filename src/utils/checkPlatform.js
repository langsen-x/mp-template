export default {
  inWeiXin() {
    const ua = navigator.userAgent.toLowerCase()
    return /MicroMessenger/i.test(ua)
  },

  inAli() {
    const ua = navigator.userAgent.toLowerCase()
    return /Alipay/i.test(ua) || /AliApp/i.test(ua)
  },

  inH5() {
    return window && !this.inWeiXin() && !this.inAli()
  },

  inIOS() {
    const ua = navigator.userAgent.toLowerCase()
    return /\((iPhone)|(Mac OS X)/i.test(ua)
  },

  inAndroid() {
    const ua = navigator.userAgent.toLowerCase()
    return /Android/i.test(ua)
  },
}
