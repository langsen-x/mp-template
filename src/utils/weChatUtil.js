import wx from 'weixin-js-sdk'
import checkPlatform from '@utils/checkPlatform'
import localStorage from '@utils/localStorage'
import apis from '@api'
import API_STATUS from '@status'
import { getUrl } from '@utils/index'
import app from '@/main'
import { wechatVersionRe } from '@utils/regex'

function isBlank(url) {
  return !url || !url.trim()
}

// 要注入到页面的 jsApi 列表(包含了微信jssdk的所有api)
const configJSApiList = [
  // 基础接口
  'checkJsApi',

  // 分享接口
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'updateAppMessageShareData',
  'updateTimelineShareData',
  'onMenuShareQQ',
  'onMenuShareWeibo',
  'onMenuShareQZone',

  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'translateVoice',
  'startRecord',
  'stopRecord',
  'onVoiceRecordEnd',
  'playVoice',
  'onVoicePlayEnd',
  'pauseVoice',
  'stopVoice',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getNetworkType',
  'openLocation',
  'getLocation',
  'hideOptionMenu',
  'showOptionMenu',
  'closeWindow',
  'scanQRCode',
  'chooseWXPay',
  'openProductSpecificView',
  'addCard',
  'chooseCard',
  'openCard',
]

const allMenuItemList = [
  // 基本类
  'menuItem:exposeArticle', // 举报
  'menuItem:setFont', // 调整字体
  'menuItem:dayMode', // 日间模式
  'menuItem:nightMode', // 夜间模式
  'menuItem:refresh', // 刷新
  'menuItem:profile', // 查看公众号（已添加）
  'menuItem:addContact', // 查看公众号（未添加）
  // 传播类
  'menuItem:share:appMessage', // 发送给朋友
  'menuItem:share:timeline', // 分享到朋友圈
  'menuItem:share:qq', // 分享到QQ
  'menuItem:share:QZone', // 分享到QQ空间
  'menuItem:share:weiboApp', // 分享到Weibo
  'menuItem:share:facebook', // 分享到FB
  'menuItem:favorite', // 收藏
  // 保护类
  'menuItem:editTag', // 编辑标签
  'menuItem:delete', // 删除
  'menuItem:copyUrl', // 复制链接
  'menuItem:originPage', // 原网页
  'menuItem:readMode', // 阅读模式
  'menuItem:openWithQQBrowser', // 在QQ浏览器中打开
  'menuItem:openWithSafari', // 在Safari中打开
  'menuItem:share:email', // 邮件
  'menuItem:share:brand', // 一些特殊公众号
]

/* ###################################### 以下为公开API ########################################## */

/**
 * 注入权限验证配置以及所有可用的jsApi接口
 * @param jsApiList 配置页面需要使用的api接口集合
 * @author champ
 */
function weChatConfig(jsApiList = configJSApiList) {
  const url = getUrl()
  const innerId = process.env.VUE_APP_WE_CHAT_INNER_ID
  config(innerId, url, jsApiList)
}

/**
 * (基础接口) 判断当前客户端版本是否支持指定JS接口
 * @param jsApiList
 * @author champ
 */
function checkJsApi(jsApiList = configJSApiList) {
  return new Promise((resolve, reject) => {
    wx.ready(() => {
      wx.checkJsApi({
        jsApiList,
        success: function(res) {
          resolve(res)
        },
        fail: function(res) {
          reject(res)
        },
      })
    })
  })
}

/**
 * (分享接口) 自定义“分享给朋友”及“分享到QQ”按钮的分享内容 (1.4.0+)
 * @param title 标题
 * @param desc 摘要
 * @param link 分享的链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
 * @param imgUrl 图片地址
 * @param successCB 配置自定义分享成功的回调
 * @param failCB 配置自定义分享失败的回调
 * @author champ
 */
function updateAppMessageShareData({
  title,
  desc,
  link,
  imgUrl,
  successCB,
  failCB,
} = {}) {
  wx.ready(() => {
    wx.updateAppMessageShareData({
      title,
      desc,
      link,
      imgUrl,
      complete: function(res) {
        const success = res.errMsg === 'updateAppMessageShareData:ok'
        if (success) {
          typeof successCB === 'function' && successCB()
        } else {
          typeof failCB === 'function' && failCB()
        }
      },
    })
  })
}

/**
 * @description (分享接口) 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容 (1.4.0+)
 * @param title 标题
 * @param desc 摘要
 * @param link 分享的链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
 * @param imgUrl 图片地址
 * @param successCB 配置自定义分享成功的回调
 * @param failCB 配置自定义分享失败的回调
 * @author champ
 */
function updateTimelineShareData({
  title,
  desc,
  link,
  imgUrl,
  successCB,
  failCB,
} = {}) {
  wx.ready(() => {
    wx.updateTimelineShareData({
      title,
      desc,
      link,
      imgUrl,
      complete: function(res) {
        const success = res.errMsg === 'updateTimelineShareData:ok'
        if (success) {
          typeof successCB === 'function' && successCB()
        } else {
          typeof failCB === 'function' && failCB()
        }
      },
    })
  })
}

/**
 * @description (分享接口) 自定义“分享到腾讯微博”的分享内容
 * @param title 标题
 * @param desc 摘要
 * @param link 分享的链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
 * @param imgUrl 图片地址
 * @param successCB 配置自定义分享成功的回调
 * @param failCB 配置自定义分享失败的回调
 * @author champ
 */
function onMenuShareWeibo({
  title,
  desc,
  link,
  imgUrl,
  successCB,
  failCB,
} = {}) {
  wx.ready(() => {
    wx.onMenuShareWeibo({
      title,
      desc,
      link,
      imgUrl,
      complete: function(res) {
        const success = res.errMsg === 'onMenuShareWeibo:ok'
        if (success) {
          typeof successCB === 'function' && successCB()
        } else {
          typeof failCB === 'function' && failCB()
        }
      },
    })
  })
}

/**
 * (音频接口) 开始录音
 * @author champ
 */
function startRecord() {
  return new Promise((resolve, reject) => {
    wx.ready(() => {
      wx.startRecord({
        success: function(res) {
          resolve(res)
        },
        cancel: function(res) {
          reject(res)
        },
        fail: function(res) {
          reject(res)
        },
      })
    })
  })
}

/**
 * (音频接口) 停止录音
 * @returns {Promise<unknown>}
 * @author champ
 */
function stopRecord() {
  return new Promise((resolve, reject) => {
    wx.ready(() => {
      wx.stopRecord({
        success: function(res) {
          resolve(res)
        },
        fail: function(res) {
          reject(res)
        },
      })
    })
  })
}

/**
 * 录音时间超过一分钟没有停止的时候会执行 complete 回调
 * @author champ
 */
function onVoiceRecordEnd() {
  wx.ready(() => {
    wx.onVoiceRecordEnd({
      complete: function(res) {
        alert('录音时间已超过一分钟')
        console.log(res)
      },
    })
  })
}

/**
 * (音频接口) 播放语音
 * @param localId 录音接口返回的localId
 * @author champ
 */
function playVoice(localId) {
  wx.ready(() => {
    if (!localId) {
      alert('请先使用 startRecord 接口录制一段声音')
      return
    }
    wx.playVoice({
      localId,
    })
  })
}

/**
 * (音频接口) 暂停播放语音
 * @param localId 录音接口返回的localId
 * @author champ
 */
function pauseVoice(localId) {
  wx.ready(() => {
    if (!localId) {
      alert('请先使用 startRecord 接口录制一段声音')
      return
    }

    wx.pauseVoice({
      localId,
    })
  })
}

/**
 * (音频接口) 停止播放语音
 * @param localId 录音接口返回的localId
 * @author champ
 */
function stopVoice(localId) {
  wx.ready(() => {
    if (!localId) {
      alert('请先使用 startRecord 接口录制一段声音')
      return
    }

    wx.stopVoice({
      localId,
    })
  })
}

/**
 * (音频接口) 监听录音播放结束
 * @author champ
 */
function onVoicePlayEnd() {
  wx.ready(() => {
    wx.onVoicePlayEnd({
      complete: function(res) {
        alert('录音（' + res.localId + '）播放结束')
      },
    })
  })
}

/**
 * (音频接口) 上传语音 (上传语音有效期3天)
 * @param localId 录音接口返回的localId
 * @returns {Promise<unknown>}
 * @author champ
 */
function uploadVoice(localId) {
  return new Promise((resolve, reject) => {
    wx.ready(() => {
      wx.uploadVoice({
        localId,
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function(res) {
          resolve(res)
        },
        fail: function(res) {
          reject(res)
        },
      })
    })
  })
}

/**
 * (音频接口) 下载语音
 * @param serverId 服务器端的serverId
 * @returns {Promise<unknown>}
 * @author champ
 */
function downloadVoice(serverId) {
  return new Promise((resolve, reject) => {
    wx.ready(() => {
      wx.downloadVoice({
        serverId,
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function(res) {
          resolve(res)
        },
        fail: function(res) {
          reject(res)
        },
      })
    })
  })
}

/**
 * (智能接口) 识别音频并返回识别结果
 * @param {string} localId
 * @returns {Promise<unknown>}
 * @author champ
 */
function translateVoice(localId) {
  return new Promise((resolve, reject) => {
    wx.ready(() => {
      wx.translateVoice({
        localId,
        isShowProgressTips: 1, // 默认为1，显示进度提示
        complete: function(res) {
          if (Object.prototype.hasOwnProperty.call(res, 'translateResult')) {
            resolve(res.translateResult)
          } else {
            reject(new Error('无法识别'))
          }
        },
      })
    })
  })
}

/**
 * (设备信息接口) 获取当前网络状态 返回网络类型2g，3g，4g，wifi
 * @returns {Promise<unknown>}
 * @author champ
 */
function getNetworkType() {
  return new Promise((resolve, reject) => {
    wx.ready(() => {
      wx.getNetworkType({
        success: function(res) {
          resolve(res.networkType)
        },
        fail: function(res) {
          reject(res)
        },
      })
    })
  })
}

/**
 * (地理位置) 使用微信内置地图查看位置
 * @param latitude 纬度，浮点数，范围为90 ~ -90
 * @param longitude 经度，浮点数，范围为180 ~ -180
 * @param name 位置名
 * @param address 地址详情说明
 * @param scale 地图缩放级别,整形值,范围从1~28。默认为最大
 * @param infoUrl 在查看位置界面底部显示的超链接,可点击跳转
 * @author champ
 */
function openLocation({
  latitude,
  longitude,
  name,
  address,
  scale,
  infoUrl,
} = {}) {
  wx.ready(() => {
    wx.openLocation({
      latitude, // 纬度，浮点数，范围为90 ~ -90
      longitude, // 经度，浮点数，范围为180 ~ -180
      name, // 位置名
      address, // 地址详情说明
      scale, // 地图缩放级别,整形值,范围从1~28。默认为最大
      infoUrl, // 在查看位置界面底部显示的超链接,可点击跳转
    })
  })
}

/**
 * (地理位置) 获取当前地理位置
 * @returns {Promise<unknown>}
 * @author champ
 */
function getLocation() {
  return new Promise((resolve, reject) => {
    wx.ready(() => {
      wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function(res) {
          resolve(res)
        },
        cancel: function(res) {
          alert('用户拒绝授权获取地理位置')
          reject(res)
        },
        fail: function(res) {
          reject(res)
        },
      })
    })
  })
}

/**
 * (界面操作接口) 关闭当前窗口
 * @author champ
 */
function closeWindow() {
  wx.ready(() => {
    wx.closeWindow()
  })
}

/**
 * (界面操作接口) 批量隐藏功能按钮 只能隐藏“传播类”和“保护类”按钮
 * @param menuList 要隐藏的菜单列表
 * @returns {Promise<unknown>}
 * @author champ
 */
function hideMenuItems(menuList = allMenuItemList) {
  return new Promise((resolve, reject) => {
    wx.ready(() => {
      wx.hideMenuItems({
        menuList,
        success: function(res) {
          resolve(res)
        },
        fail: function(res) {
          reject(res)
        },
      })
    })
  })
}

/**
 * (界面操作接口) 批量显示功能按钮
 * @param menuList 要显示的菜单列表
 * @returns {Promise<unknown>}
 * @author champ
 */
function showMenuItems(menuList = allMenuItemList) {
  return new Promise((resolve, reject) => {
    wx.ready(() => {
      wx.showMenuItems({
        menuList,
        success: function(res) {
          resolve(res)
        },
        fail: function(res) {
          reject(res)
        },
      })
    })
  })
}

/**
 * (界面操作接口) 隐藏所有非基础按钮
 * @returns {Promise<unknown>}
 * @author champ
 */
function hideAllNonBaseMenuItem() {
  return new Promise((resolve, reject) => {
    wx.ready(() => {
      wx.hideAllNonBaseMenuItem({
        success: function(res) {
          resolve(res)
        },
        fail: function(res) {
          reject(res)
        },
      })
    })
  })
}

/**
 * (界面操作接口) 显示所有非基础按钮
 * @returns {Promise<unknown>}
 * @author champ
 */
function showAllNonBaseMenuItem() {
  return new Promise((resolve, reject) => {
    wx.ready(() => {
      wx.showAllNonBaseMenuItem({
        success: function(res) {
          resolve(res)
        },
        fail: function(res) {
          reject(res)
        },
      })
    })
  })
}

/**
 * (界面操作接口) 隐藏右上角菜单
 * @author champ
 */
function hideOptionMenu() {
  wx.ready(() => {
    wx.hideOptionMenu()
  })
}

/**
 * (界面操作接口) 显示右上角菜单
 * @author champ
 */
function showOptionMenu() {
  wx.ready(() => {
    wx.showOptionMenu()
  })
}

/**
 * (微信扫一扫) 调起微信扫一扫
 * 使用注意：
 *   当 needResult 参数为 false 时，表示不需要返回识别结果，由微信自动处理。通常用于跳转链接。这种情况下当唤起相机时会立即返回resolve状态
 *   当 needResult 参数为 true 时，表示需要返回识别结果。这种情况下只有识别出结果时才会返回resolve状态
 * @param needResult 是否需要返回结果，默认为 true
 * @returns {Promise<unknown>}
 * @author champ
 */
function scanQRCode(needResult = true) {
  return new Promise((resolve, reject) => {
    wx.ready(() => {
      wx.scanQRCode({
        needResult: needResult === true ? 1 : 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: function(res) {
          resolve(res.resultStr)
        },
        fail: function(res) {
          reject(res)
        },
      })
    })
  })
}

/**
 * 微信支付，会根据是否在微信环境自动决定支付类型 (JSAPI/MWEB)
 * @param productDesc 订单描述信息
 * @param orderNo 订单号
 * @param price 订单价格
 * @param notifyUrl 通知地址
 * @param redirectUrlForH5 h5支付完成后的跳转地址，并不保证支付成功，需要查询订单的支付状态(该参数通常是一个pending页面)
 * @param callback 只有公众号支付可以使用该回调
 * @returns {Promise<void>}
 * @author champ
 */
async function applyWechatPay({
  productDesc,
  orderNo,
  price,
  notifyUrl,
  redirectUrlForH5,
  callback,
} = {}) {
  const inWeChat = checkPlatform.inWeiXin()
  const tradeType = inWeChat ? 'JSAPI' : 'MWEB' // 微信内用公众号支付，否则用h5支付
  const openId = inWeChat ? localStorage.get('openId') : ''
  const weChatConfigId = process.env.VUE_APP_WE_CHAT_INNER_ID

  // 统一下单参数
  const applyPayDataParams = {
    weChatConfigId,
    productDesc,
    orderNum: orderNo,
    price,
    notifyUrl,
    tradeType,
    attach: 'attach', // 暂时写死
    openId,
  }
  const applyPayRes = await apis.weChatPayForH5(applyPayDataParams)
  const {
    code,
    data: payResultData,
    msg,
  } = applyPayRes.data
  if (code !== API_STATUS.SUCCESS) {
    // 统一下单接口失败
    app.$toast(msg)
    return
  }

  if (!inWeChat) {
    // h5支付
    window.location.href = `${payResultData.mwebUrl}&redirect_url=${encodeURIComponent(redirectUrlForH5)}`
    return
  }

  // 声明用于接收发起支付请求后的返回结果
  const {
    timeStamp: timestamp,
    nonceStr,
    prepayId,
    signType,
    paySign,
  } = payResultData
  wx.ready(() => {
    // 就绪后的处理
    wx.chooseWXPay({
      timestamp,
      nonceStr,
      package: `prepay_id=${prepayId}`,
      signType,
      paySign,
      success: function(res) {
        if (typeof callback === 'function') {
          callback(res)
        }
      },
      cancel: function(res) {
        if (typeof callback === 'function') {
          callback(res)
        }
      },
      fail: function(res) {
        if (typeof callback === 'function') {
          callback(res)
        }
      },
    })
  })
}

/**
 * (微信小店) 跳转微信商品页
 * @param productId 商品id
 * @param viewType 0.默认值，普通商品详情页1.扫一扫商品详情页2.小店商品详情页
 * @author champ
 */
function openProductSpecificView(productId = 'pDF3iY_m2M7EQ5EKKKWd95kAxfNw', viewType = '0') {
  wx.ready(() => {
    wx.openProductSpecificView({
      productId,
      viewType,
    })
  })
}

/**
 * (其他) 获取 OpenId 并保存到 localStorage
 * @param route 当前页面的路由
 * @param callback
 * @author champ
 * @description 需要注意的是，支付页面本身不能携带code参数，会和微信回调携带的code参数冲突
 */
function initOpenId(route, callback) {
  const { code } = route.query
  const url = route.fullPath

  // 如果存在缓存，直接返回
  const storageOpenId = localStorage.get('openId')
  if (storageOpenId) {
    typeof callback === 'function' && callback(true, storageOpenId)
    return
  }

  if (checkPlatform.inWeiXin()) {
    const innerId = process.env.VUE_APP_WE_CHAT_INNER_ID
    const appId = process.env.VUE_APP_WE_CHAT_APP_ID

    if (code) {
      // 包含code参数，说明是微信授权之后回调的，可以使用该code获取openid
      getOpenIdByCode(code, innerId, callback)
    } else {
      // 没有包含code参数，需要跳转微信授权页面拿取code
      window.location.href = genGetCodeUrl(process.env.VUE_APP_PROJECT_URL_PREFIX + url, appId)
    }
  }
}

/**
 *  (其他) 根据ua获取微信版本号
 * @returns {string}
 * @author champ
 */
function version() {
  const ua = navigator.userAgent
  return ua.match(wechatVersionRe)?.groups?.version
}

/* ###################################### 以下为私有API ########################################## */

/**
 * 微信页面配置
 * @param wxConfigId 微信公众号配置
 * @param url 要配置的url
 * @param jsApiList
 * @returns
 * @author champ
 */
function config(wxConfigId, url, jsApiList) {
  const inWeChat = checkPlatform.inWeiXin()
  if (!inWeChat || isBlank(url)) {
    console.warn('不在微信环境/url为空')
    return
  }

  const params = {
    weChatConfigId: wxConfigId,
    targetUrl: url,
  }
  apis.weChatConfig(params).then(resp => {
    const {
      code,
      data,
    } = resp.data
    if (code === API_STATUS.SUCCESS) {
      wx.config({
        debug: false, // 开启调试模式
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList,
      })
      wx.error(function(res) {
        console.warn('微信配置失败: ', res)
      })
    } else {
      console.error('获取微信配置参数失败: ', resp)
    }
  })
}

/**
 * 获取微信网页的静默授权地址
 * @param redirectUri
 * @param appid
 * @param state
 * @returns {string}
 * @author champ
 */
function genGetCodeUrl(redirectUri, appid, state = '') {
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`
}

/**
 * 根据 code 换取 openId
 * @param authorizeCode 微信授权code
 * @param wxInnerId 配置的公众号innerId
 * @param callback 回调
 * @returns {Promise<void>}
 * @author champ
 */
async function getOpenIdByCode(authorizeCode, wxInnerId, callback) {
  const resp = await apis.getOpenId({
    code: authorizeCode,
    weChatConfigId: wxInnerId,
  })
  const {
    code,
    data: openId,
  } = resp.data
  if (code === API_STATUS.SUCCESS) {
    // 保存openId
    localStorage.save('openId', openId)
    typeof callback === 'function' && callback(true, openId)
  } else {
    typeof callback === 'function' && callback(false, openId)
  }
}

export default {
  weChatConfig,

  // 基础接口
  checkJsApi,

  // 分享接口
  updateAppMessageShareData,
  updateTimelineShareData,
  onMenuShareWeibo,

  // 音频接口
  startRecord,
  stopRecord,
  onVoiceRecordEnd,
  playVoice,
  pauseVoice,
  stopVoice,
  onVoicePlayEnd,
  uploadVoice,
  downloadVoice,

  // 智能接口
  translateVoice,

  // 设备信息接口
  getNetworkType,

  // 地理位置接口
  openLocation,
  getLocation,

  // 界面操作接口
  closeWindow,
  hideMenuItems,
  showMenuItems,
  hideAllNonBaseMenuItem,
  showAllNonBaseMenuItem,
  hideOptionMenu,
  showOptionMenu,

  // 扫一扫
  scanQRCode,

  // 微信支付
  applyWechatPay,

  // 微信小店
  openProductSpecificView,

  // 其他
  initOpenId,
  version,
}
