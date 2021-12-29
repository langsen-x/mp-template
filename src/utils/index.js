import storage from '@utils/localStorage'
import { CommonUtil } from 'sn-js-utils'
import checkPlatform from '@utils/checkPlatform'

// 指定排序的比较函数
export const compareForMD5 = (property) => {
  return function(obj1, obj2) {
    const value1 = obj1[property]
    const value2 = obj2[property]
    let value1Ascii = 0
    let value2Ascii = 0
    for (let i = 0; i < value1.length; i++) {
      value1Ascii += value1.charCodeAt(i) // 只能把字符串中的字符一个一个的解码
    }
    for (let i = 0; i < value2.length; i++) {
      value2Ascii += value2.charCodeAt(i) // 只能把字符串中的字符一个一个的解码
    }
    return value1Ascii - value2Ascii // 正序排列
  }
}

export const toJSON = (object) => {
  return JSON.parse(JSON.stringify(object))
}

export const getUrl = () => {
  // iOS版微信在校验签名时，只能获取到首页的地址
  return checkPlatform.inAndroid() ? window.location.href.split('#')[0] : window.__wx_entryUrl
}

export const pad = (str, maxLength) => {
  return '0'.repeat(maxLength - String(str).length) + str
}

export const groupByFn = (list, fn) => {
  const groups = {}
  list.forEach(function(item) {
    const group = JSON.stringify(fn(item))
    groups[group] = groups[group] || []
    groups[group].push(item)
  })
  return Object.keys(groups).map(group => groups[group])
}

export const groupByField = (list, name) => {
  return list.reduce((obj, item) => {
    if (!obj[item[name]]) {
      obj[item[name]] = []
    }
    obj[item[name]].push(item)
    return obj
  }, {})
}

/**
 * 简单数组去重，支持基本类型数组，不支持对象数组
 * @param arr
 * @returns {any[]}
 */
export const unique = (arr) => {
  return Array.from(new Set(arr))
}

/**
 * 检测缓存中的key是否存在
 * @param {[string]} keys
 * @returns {boolean}
 */
export function storageKeyExist(keys = []) {
  for (const key of keys) {
    const value = storage.get(key)
    if (!value || value === 'undefined' || value === 'null') {
      return false
    }
  }
  return true
}

/**
 * uuid 生成器
 * @returns {string}
 */
export function uuid() {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  return s.join('')
}

/**
 * 根据身份证计算年龄
 * @param idCard 身份证
 * @returns {{year: number, day: number}}
 */
export function calculateAge(idCard) {
  if (!CommonUtil.idcardIsValid(idCard)) {
    throw new Error('身份证不合法')
  }
  const birth = idCard.substr(6, 8)
  return calculateAgeFromBirth(birth)
}

/**
 * 根据生日计算年龄
 * @param birthday
 * @return {{year: number, day: number}}
 */
export function calculateAgeFromBirth(birthday) {
  let returnAge
  const strBirthdayArr = new Date(birthday)
  const birthYear = strBirthdayArr.getFullYear()
  const birthMonth = strBirthdayArr.getMonth() + 1
  const birthDay = strBirthdayArr.getDate()

  const now = new Date()
  const nowYear = now.getFullYear()
  const nowMonth = now.getMonth() + 1
  const nowDay = now.getDate()

  if (nowYear === birthYear) {
    returnAge = 0// 同年 则为0岁
  } else {
    let ageDiff = nowYear - birthYear // 年之差
    if (ageDiff > 0) {
      if (nowMonth === birthMonth) {
        let dayDiff = nowDay - birthDay// 日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      } else {
        let monthDiff = nowMonth - birthMonth// 月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      }
    } else {
      returnAge = -1// 返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge
}

/**
 * 该方法只能处理小整数，最靠谱的还是直接转成字符串手动处理
 * @param num
 * @param accuracy
 * @return {string}
 */
export function toFixed(num, accuracy) {
  const tmp = Intl.NumberFormat('zh-CN', {
    style: 'decimal',
    maximumFractionDigits: accuracy,
  }).format(num)
  return tmp.replace(/[^\d.]/g, '')
}
