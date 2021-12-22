export default {
  PROXY_AUTH_API: '/mp-template/proxy/auth/api', // TOKEN认证接口代理
  PROXY_NOTIFY_API: '/mp-template/proxy/notify/api', // 通知微服务接口代理
  PROXY_PAY_CENTER_API: '/mp-template/proxy/paycenter/api', // 支付微服务接口代理
  PROXY_FILE_SYS_API: '/mp-template/proxy/filesys/api', // 文件上传服务接口代理
  PROXY_BIZ_API: '/mp-template/proxy/biz/api', // 业务平台微服务接口代理

  // 通知微服务接口【notify】
  NOTIFY_GET_SMS_CODE: `/sms${process.env.VUE_APP_AUTHOR_API}/get-sms-code`, // 发送短信验证码
  NOTIFY_GET_SMS_VERIFY_CODE: `/sms${process.env.VUE_APP_AUTHOR_API}/get-sms-verify-code`, // 发送短信验证码,需要图形验证码(暂时无用)

  // 支付微服务接口【pay-center】
  PAY_CENTER_GET_WECHAT_OPENID: '/wechat/get-wechat-openId', // 根据微信授权code获取用户openId
  PAY_CENTER_GET_WECHAT_USER_INFO: '/wechat/get-wechat-userinfo', // 根据InnerId和openId获取微信用户信息
  PAY_CENTER_GEN_WECHAT_CONFIG: '/wechat/gen-wechat-config', // 生成微信jssdk的配置信息
  PAY_CENTER_APPLY_WECHAT_PAY: '/wechat/apply-wechat-pay', // 申请微信预支付
  PAY_CENTER_GET_MP_OPENID: '/wechat/get-applets-openid', // 根据微信授权code获取小程序openId、session_key
  PAY_CENTER_MP_DECRYPT_DATA: `/wechat${process.env.VUE_APP_AUTHOR_API}/decrypt-mp-data`, // 解密小程序数据

  // 文件上传接口【file-sys】
  UPLOAD_FILE: '/file/upload-file', // 文件上传

  // 业务接口
}
