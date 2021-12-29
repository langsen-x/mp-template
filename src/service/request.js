/* eslint-disable */
import qs from 'qs'
import Urls from './urls'
import localStorage from '@utils/localStorage'
import srmh9nv0 from './srmh9nv0'
import http from '@module/luch-request'

/**
 * 处理请求选项
 * todo: 此方法可以改造成 request interceptor / transformer
 * @param options
 * @returns {null}
 */
function processOptions(options) {
  const {
    url,
    method,
    data,
    contentType,
  } = options
  let _data = data

  const _options = Object.create(null)
  _options.url = url
  _options.method = method
  _options.header = Object.create(null)

  // 处理userId (get请求不包含userId，防止泄露用户登录信息)
  const userId = localStorage.get('userId')
  if (!_data.userId && userId && userId !== 'null' && userId !== 'undefined' && !/get/i.test(method)) {
    _data.userId = userId
  }

  // 处理签名
  if (url.includes(process.env.VUE_APP_AUTHOR_API)) {
    // author 相关api需要签名
    _data = srmh9nv0.srmh9nv0(_data)
  }

  // 处理post请求方式
  if (/post/i.test(method) && contentType !== 'json') {
    _data = qs.stringify(_data)
    _options.header['Content-Type'] = 'application/x-www-form-urlencoded'
  }

  if (/get/i.test(method)) {
    _options.params = _data
  } else {
    _options.data = _data
  }

  return _options
}

function request(options) {
  const _options = processOptions(options)

  // return axios(_options)
  return http.request(_options)
}

function get(apiRootType, url, data = {}) {
  let targetUrl
  if (apiRootType === Urls.PROXY_BIZ_API) {
    targetUrl = process.env.VUE_APP_BIZ_API_ROOT + url
  } else if (apiRootType === Urls.PROXY_PAY_CENTER_API) {
    targetUrl = process.env.VUE_APP_PAY_CENTER_API_ROOT + url
  } else if (apiRootType === Urls.PROXY_NOTIFY_API) {
    targetUrl = process.env.VUE_APP_NOTIFY_API_ROOT + url
  } else {
    // 暂不支持非代理请求路径
    throw new Error(`apiRootType: ${apiRootType} 配置错误`)
  }
  const options = {
    url: targetUrl,
    method: 'GET',
    data,
  }
  return request(options)
}

function post(apiRootType, url, data = {}, contentType = 'form') {
  let targetUrl
  if (apiRootType === Urls.PROXY_BIZ_API) {
    targetUrl = process.env.VUE_APP_BIZ_API_ROOT + url
  } else if (apiRootType === Urls.PROXY_PAY_CENTER_API) {
    targetUrl = process.env.VUE_APP_PAY_CENTER_API_ROOT + url
  } else if (apiRootType === Urls.PROXY_NOTIFY_API) {
    targetUrl = process.env.VUE_APP_NOTIFY_API_ROOT + url
  } else {
    // 暂不支持非代理请求路径
    throw new Error(`apiRootType: ${apiRootType} 配置错误`)
  }

  const options = {
    url: targetUrl,
    method: 'POST',
    data,
    contentType,
  }
  return request(options)
}

function postJson(apiRootType, url, data) {
  return post(apiRootType, url, data, 'json')
}

/**
 * 上传文件
 * @param apiRootType
 * @param url
 * @param data 非文件数据
 * @param files 文件相关数据，结构如下：{filename: {data: 'base64数据', type: 'base64'}, filename: {data: '使用choose-image工具获取的url', type: 'bloburl'}}
 * @return {Promise<Response>}
 * @example
 */
async function upload(apiRootType, url, filePath, formData) {
  let targetUrl
  if (apiRootType === Urls.PROXY_FILE_SYS_API) {
    targetUrl = process.env.VUE_APP_FILE_SYS_API_ROOT + url
  } else {
    // 暂不支持非代理请求路径
    throw new Error(`apiRootType: ${apiRootType} 配置错误`)
  }
  const option = {
    url: targetUrl,
    filePath: filePath,
    name: 'file',
    formData: formData,
  }

  console.log('uploadOption:', option)
  return uni.uploadFile(option)
}

export default {
  get,
  post,
  postJson,
  upload,
}
