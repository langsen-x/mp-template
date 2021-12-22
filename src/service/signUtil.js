/**
 * @Description:    加密工具类
 * @author snail
 * @date 2019-03-20
 */
import crypto from 'crypto-js'
import { DateUtil } from 'sn-js-utils'

/**
 * @Description: 设置加密工具类参数
 * @author snail
 * @date 2019-03-20
 */
const init = {
  key: crypto.enc.Utf8.parse(crypto.MD5('1laC2NxSXWADiT8RGaD1Y+woVLgRsP0qDv7pBRzt5fUA').toString()),
  cryptoOption: {
    iv: crypto.enc.Utf8.parse(crypto.MD5('DQEBAQUAA4GNADCBiQKBgQDz1TEIAjzVD0kkbhqjIvTteHgT59sGxcQqiLmh1B4').toString().substr(0, 16)),
    mode: crypto.mode.CBC,
    padding: crypto.pad.ZeroPadding,
  },
}

/**
 * @Description: 解密已经解密过的 secret 得到真正的 secret
 * @author snail
 * @date 2019-03-20
 * @param {string} parentId   合作方的 key
 * @param {string} encryptedSecret     合作方已经加密处理过的 secret
 */
function decryptForEncryptedSecret(parentId, encryptedSecret) {
  const decrypted = crypto.AES.decrypt(encryptedSecret, parentId, init.cryptoOption)
  return decrypted.toString(crypto.enc.Utf8)
}

/**
 * @Description: 加密前使用该方法进行参数排序
 * @author snail
 * @date 2019-03-20
 * @param {string}  property 排序依据的属性
 */
function compareForMD5(property) {
  return (obj1, obj2) => {
    const value1 = obj1[property]
    const value2 = obj2[property]
    let value1Ascii = 0
    let value2Ascii = 0
    for (let i = 0; i < value1.length; i += 1) {
      value1Ascii += value1.charCodeAt(i) // 只能把字符串中的字符一个一个的解码
    }
    for (let i = 0; i < value2.length; i += 1) {
      value2Ascii += value2.charCodeAt(i) // 只能把字符串中的字符一个一个的解码
    }
    return value1Ascii - value2Ascii // 正序排列
  }
}

/**
 * @Description: 加密数据,并返回带有sign的数据对象
 * @author snail
 * @date 2019-03-20
 * @param {string} parentId   合作方的 key
 * @param {string} secret     合作方的 secret
 * @param {Object} data       需要加密的数据
 */
function encode(parentId, secret, data) {
  const decodeSecret = decryptForEncryptedSecret(parentId, secret)
  const timestamp = DateUtil.timestamp()
  let signStr = ''

  if (data && Object.keys(data).length > 0) {
    const paramArr = Object.keys(data).map(key => ({
      label: key,
      value: data[key],
    }))
    const timestampObj = {
      label: 'timestamp',
      value: timestamp,
    }
    paramArr.push(timestampObj)
    paramArr.sort(compareForMD5('label'))
    signStr += parentId

    for (const str of paramArr) {
      signStr += str.label + str.value
    }
    signStr += decodeSecret
  } else {
    data = {}
    signStr = parentId
    signStr += 'noparamnoparamtimestamp' + timestamp
    signStr += decodeSecret
    data.noparam = 'noparam'
  }
  const sign = encodeData(signStr)
  data.timestamp = timestamp
  data.sign = sign
  data.partner_id = parentId
  if (process.env.NODE_ENV === 'development') {
    console.log('gen sign params: ', JSON.parse(JSON.stringify(data)))
  }
  return JSON.parse(JSON.stringify(data))
}

/**
 * @Description: 生成加密后的 sign
 * @author snail
 * @date 2019-03-20
 * @param {string} strSrc   需要加密的源字符串
 */
function encodeData(strSrc) {
  return crypto.MD5(strSrc).toString().toUpperCase()
}

/**
 * @Description: 将真正的 secret 进行加密处理
 * @author snail
 * @date 2019-03-20
 * @param {string} parentId   合作方的 key
 * @param {string} secret     合作方的 secret
 */
function genEncryptedSecret(parentId, secret) {
  const encrypted = crypto.AES.encrypt(secret, parentId, init.cryptoOption)
  return encrypted.toString()
}

export default {
  encode,
  decryptForEncryptedSecret,
  encodeData,
  genEncryptedSecret,
}
