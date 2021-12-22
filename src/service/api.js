import Request from './request'
import Urls from './urls'
import API_STATUS from './status'
import Vue from 'vue'

/**
 * 验证数据编码
 * @param {*} res 接口返回对象
 * @param isShow 失败时是否显示错误信息
 */
function check(res, isShow = true) {
  if (res.code === API_STATUS.SUCCESS) {
    return true
  } else {
    if (isShow) {
      Vue.prototype.$toast(res.msg)
    }
    return false
  }
}

/**
 * 获取短信验证码 (通知微服务接口)
 * @param params
 * @returns {Promise<*>}
 */
async function getVerifyCode(params) {
  return Request.postJson(Urls.PROXY_NOTIFY_API, Urls.NOTIFY_GET_SMS_CODE, params)
}

/**
 * 获取微信配置 (支付微服务接口)
 * @param params
 * @returns {Promise<*>}
 */
async function weChatConfig(params) {
  return Request.post(Urls.PROXY_PAY_CENTER_API, Urls.PAY_CENTER_GEN_WECHAT_CONFIG, params)
}

/**
 * 根据微信授权code获取用户openId (支付平台接口)
 */
async function getOpenId(params) {
  return Request.postJson(Urls.PROXY_PAY_CENTER_API, Urls.PAY_CENTER_GET_WECHAT_OPENID, params)
}

/**
 * 微信H5支付
 */
async function weChatPayForH5(params) {
  return Request.post(Urls.PROXY_PAY_CENTER_API, Urls.PAY_CENTER_APPLY_WECHAT_PAY, params)
}

/**
 * 根据微信授权code获取openId (小程序)
 */
async function getMpOpenId(params) {
  return Request.post(Urls.PROXY_PAY_CENTER_API, Urls.PAY_CENTER_GET_MP_OPENID, params)
}

/**
 * 小程序用户数据解密
 */
async function mpDecryptData(params) {
  return Request.post(Urls.PROXY_PAY_CENTER_API, Urls.PAY_CENTER_MP_DECRYPT_DATA, params)
}

/**
 * 上传文件
 * @param file
 * @returns {Promise<*>}
 */
async function uploadFile(file) {
  const innerId = process.env.VUE_APP_FILESYS_INNER_ID
  return Request.upload(Urls.PROXY_FILE_SYS_API, Urls.UPLOAD_FILE, file, { innerId })
}

export default {
  check,
  getVerifyCode,
  weChatConfig,
  getOpenId,
  weChatPayForH5,
  getMpOpenId,
  mpDecryptData,
  uploadFile,
}
