import Storage from '@utils/localStorage'
import api from '@api'
import API_STATUS from '@status'

// import WXBizDataCrypt from './WXBizDataCrypt'

/**
 * 获取微信预支付数据，同时支持小程序和h5，内部采用 JSAPI 的支付方式
 * 注意：调用之前需要保证 Storage 里面有 openId
 * @param weChatConfigId 后台配置的configId
 * @param productDesc 订单描述
 * @param orderNum 订单号
 * @param price 价格
 * @param notifyUrl 通知地址
 * @param attach 附加参数
 * @returns {Promise<*>}
 */
async function getPrepayData(weChatConfigId, productDesc, orderNum, price, notifyUrl, attach) {
  const openId = Storage.get('openId')
  const applyPayDataParams = {
    weChatConfigId,
    productDesc,
    orderNum,
    price,
    notifyUrl,
    tradeType: 'JSAPI',
    attach,
    openId,
  }

  const applyParRes = await api.weChatPayForH5(applyPayDataParams)
  const {
    code,
    msg,
    data,
  } = applyParRes.data
  if (code === API_STATUS.PAY_SUCCESS) {
    return data
  } else {
    uni.showToast({
      title: msg,
      icon: 'none',
      duration: 2000,
    })
  }
}

/**
 * 调起小程序支付
 * @param param 调用预支付接口拿到的数据
 * @returns {Promise<unknown>}
 */
async function requestPayment(param) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function(res) {
        resolve({
          success: true,
          msg: 'success',
        })
      },
      fail: function(res) {
        resolve({
          success: false,
          msg: res.errMsg,
        })
      },
    })
  })
}

/**
 *
 * @returns {Promise<unknown>}
 */
async function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          api.getMpOpenId({
            jsCode: res.code,
            weChatConfigId: process.env.VUE_APP_WE_CHAT_MP_INNER_ID,
          }).then(resp => {
            if (resp.data.data.sessionKey !== undefined) {
              resolve({
                success: true,
                data: resp.data.data,
                msg: resp.errMsg,
              })
            } else {
              resolve({
                success: false,
                msg: resp.errMsg,
              })
            }
          }).catch((resp) => {
            resolve({
              success: false,
              msg: resp.errMsg,
            })
          })
        } else {
          resolve({
            success: false,
            msg: res.errMsg,
          })
        }
      },
      fail(res) {
        resolve({
          success: false,
          msg: res.errMsg,
        })
      },
    })
  })
}

/**
 * 解密用户加密数据
 * @param sessionKey
 * @param encryptedData
 * @param iv
 * @returns {string}
 */
async function decrypt(sessionKey, encryptedData, iv) {
  // const appId = process.env.VUE_APP_WE_CHAT_MP_APPID
  // return new WXBizDataCrypt(appId, sessionKey).decryptData(encryptedData, iv)
  return new Promise((resolve, reject) => {
    api.mpDecryptData({
      sessionKey: sessionKey,
      encryptedData: encryptedData,
      iv: iv,
    }).then((res) => {
      const {
        code,
        data,
        msg,
      } = res.data
      if (code === API_STATUS.SUCCESS) {
        resolve({
          success: true,
          data: JSON.parse(data),
          msg: msg,
        })
      } else {
        resolve({
          success: false,
          msg: msg,
        })
      }
    }).catch(err => {
      console.log('decryptErr:', err)
      resolve({
        success: false,
        msg: err,
      })
    })
  })
}

export default {
  getPrepayData,
  requestPayment,
  login,
  decrypt,
}
