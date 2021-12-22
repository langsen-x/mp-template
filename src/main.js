import Vue from 'vue'
import App from './App'

// 注册全局过滤器
import './filters'

// 注册实例方法
import './instance'

// 全局注册 BaseLayout 组件
import BaseLayout from '@components/base-layout/base-layout'

Vue.component('BaseLayout', BaseLayout)

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  ...App,
})
app.$mount()
