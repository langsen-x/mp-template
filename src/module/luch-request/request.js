/* eslint-disable */
/**
 * Request 0.0.7
 * @Class uni-app request网络请求库
 * @Author lu-ch
 * @Date 2019-07-11
 * @Email webwork.s@qq.com
 * http://ext.dcloud.net.cn/plugin?id=392
 * **/
export default class Request {
  config = {
    baseUrl: '',
    header: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success() {
    },
    fail() {
    },
    complete() {
    },
  }
  interceptor = {
    request: (f) => {
      if (f) {
        this.requestBeforeFun = f
      }
    },
    response: (f) => {
      if (f) {
        this.requestComFun = f
      }
    },
  }

  static posUrl(url) { /* 判断url是否为绝对路径 */
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
  }

  static requestBeforeFun(config) {
    return config
  }

  static requestComFun(response) {
    return response
  }

  setConfig(f) {
    this.config = f(this.config)
  }

  request(options = {}) {
    options.baseUrl = options.baseUrl || this.config.baseUrl
    options.dataType = options.dataType || this.config.dataType
    options.url = Request.posUrl(options.url) ? options.url : (options.baseUrl + options.url)
    options.data = options.data || {}
    options.header = options.header || this.config.header
    options.method = options.method || this.config.method
    return new Promise((resolve, reject) => {
      let next = true
      let _config = null
      options.complete = (response) => {
        const statusCode = response.statusCode
        response.config = _config
        response = this.requestComFun(response)
        if (statusCode === 200) { // 成功
          resolve(response)
        } else {
          reject(response)
        }
      }
      const cancel = (t = 'handle cancel') => {
        const err = {
          errMsg: t,
          config: afC,
        }
        reject(err)
        next = false
      }
      const afC = { ...this.config, ...options }
      _config = { ...afC, ...this.requestBeforeFun(afC, cancel) }
      if (!next) return
      uni.request(_config)
    })
  }

  get(url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'GET'
    return this.request(options)
  }

  post(url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'POST'
    return this.request(options)
  }
}
