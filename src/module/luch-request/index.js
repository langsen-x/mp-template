/* eslint-disable */
import Request from './request'
import Storage from '../../utils/localStorage'

const test = new Request()
test.setConfig((config) => { /* 设置全局配置 */
  config.baseUrl = 'http://www.aaa.cn'
  config.header = {
    a: 1,
    b: 2,
  }
  return config
})
test.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
  config.header = {
    a: 1,
    ...config.header,
  }
  /*
  if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
    cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
  }
  */
  return config
})
test.interceptor.response((response) => { /* 请求之后拦截器 */
  return response
})

const http = new Request()
http.setConfig((config) => { /* 设置全局配置 */
  config.baseUrl = '' /* 根域名不同 */
  // config.header = {
  // 	a: 1,
  // 	b: 2
  // }
  return config
})
http.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
  config.header = {
    ...config.header,
  }
  /*
  if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
    cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
  }
  */
  return config
})
http.interceptor.response((response) => { /* 请求之后拦截器 */
  // console.log('response: ', response);
  const { code } = response.data
  if (code === 2001) {
    // token失效
    // 清空storage里面的key
    Storage.remove('token')
    Storage.remove('phone')

    let url = '/pages/homePage/homePage'
    const idx = window.location.href.toLowerCase().indexOf('/rights/pages/')
    if (idx !== -1) {
      url = window.location.href.substr(idx + 7)
    }

    // 下面是一些处理自动跳转登录页的特殊逻辑

    // 商品详情页调用收藏列表接口，如果token失效不进行自动跳转
    if (window.location.href.toLowerCase().indexOf('/pages/product/detail') !== -1 &&
      response.config.url.indexOf('search-favorite-by-user-id') !== -1) {
      return response
    }

    // 除了购物车和我的页面外，调用接口失效时自动跳转登录页
    if (window.location.href.toLowerCase().indexOf('/pages/cart/cart') === -1 &&
      window.location.href.toLowerCase().indexOf('/pages/user/user') === -1) {
      // 重定向到登录页
      uni.redirectTo({ url: '/pages/login/login?redirect=' + encodeURIComponent(url) })
    }
    // 改写response，主要是为了防止弹框显示错误消息
    response.data.code = -1
  }
  return response
})

export {
  http,
  test,
}
