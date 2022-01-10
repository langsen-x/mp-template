# project-name

## 小程序发布时注意事项

1.打 **生产包**

```shell script
npm run build:mp-weixin:release
```

2.加入百度统计代码

将项目根目录下 `public` 目录下的 `utils` 目录拷贝到打包之后的结果中。(放在 `dist/build/mp-weixin/` 下面)

在 `app.js` 的顶部添加如下代码

```js
// app.js
const mtjwxsdk = require('./utils/mtj-wx-sdk.js')
```

3.小程序优化（减少代码体积，优化渲染速度）

小程序vendor.js会将生产所需依赖（生产依赖尽可能少，尽可能不通过npm方式引入）和主包代码（包含所依赖的文件）全部打包，如果过大首页面加载会很慢，影响性能

> a.分包
>> 主包main只包含首页面，src/static只包含首页面所需静态资源文件<br>分包sub包含其他页面，新建static文件夹存储所需静态文件资源

4.插件使用 **https://ext.dcloud.net.cn/** 搜索

echarts可以使用qiun-data-charts

picker使用自带的组件

其他组件可以使用uni-ui中的组件，在src下新建uni_modules，按需导入，一次性导入同样会增加代码体积

5.发现点

a.预加载分包可以优化从主包页面跳转到分包页面时需要下载分包所消耗的白屏时间（pages.json下配置preloadRule）
<br>
b.按需引入组件可以减少页面渲染时间（manifest.json下配置"lazyCodeLoading": "requiredComponents"）
<br>
c.img懒加载可以减少大量的资源请求（标签设置lazy-load，但是lazy-load在上下三屏中不起作用，超过才会有效果（也就是一个页面足够长））
