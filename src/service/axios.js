import axios from 'axios'

// 创建一个新的 axios 实例，在这里可以配置一些公共选项
const instance = axios.create({
  timeout: 0, // no timeout
})

// 请求拦截器: 添加 VERSION 头
instance.interceptors.request.use(config => {
  if (process.env.NODE_ENV === 'development' && !config.url.includes('jzpay')) {
    // 如果是开发环境并且是业务接口，则添加 VERSION 头

    // config.headers.VERSION = 'xie' // 谢小超
    config.headers.VERSION = 'wushusong' // 吴书松
  }
  return config
})

export default instance
