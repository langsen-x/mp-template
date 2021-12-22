import { DateUtil } from 'sn-js-utils'

/**
 * 支付宝支付 (模拟form表单提交)
 * @param subject 商品标题
 * @param productDesc 商品描述
 * @param orderNo 订单号
 * @param price 订单总金额
 * @param notifyUrl 支付通知地址
 * @param successUrl 支付成功后的跳转地址
 * @param passbackParams 公用回传参数, 如果请求时传递了该参数，则返回给商户时会回传该参数。支付宝会在异步通知时将该参数原样返回。本参数必须进行UrlEncode之后才可以发送给支付宝
 */
function applyAliPay({
  subject,
  productDesc,
  orderNo,
  price,
  notifyUrl,
  successUrl,
  passbackParams,
} = {}) {
  const timeExpire = DateUtil.formatDate(DateUtil.dateAfter(new Date(), { day: 3 }), 'yyyy-MM-dd 23:59')
  const aliConfigId = process.env.VUE_APP_ALI_PAY_INNER_ID

  // 创建一个隐藏的form表单
  const tempForm = document.createElement('form')
  tempForm.action = process.env.VUE_APP_ALIPAY_FORM_ACTION
  tempForm.method = 'post'
  tempForm.style.display = 'none'

  appendInputToForm('configId', aliConfigId, tempForm)
  appendInputToForm('subject', subject, tempForm)
  appendInputToForm('productDesc', productDesc, tempForm)
  appendInputToForm('orderNum', orderNo, tempForm)
  appendInputToForm('timeExpire', timeExpire, tempForm)
  appendInputToForm('price', parseFloat(price), tempForm)
  appendInputToForm('passbackParams', passbackParams, tempForm)
  appendInputToForm('notifyUrl', notifyUrl, tempForm)
  appendInputToForm('successUrl', encodeURIComponent(successUrl), tempForm)

  document.body.appendChild(tempForm)
  tempForm.submit()
}

function appendInputToForm(name, value, formEl) {
  if (value === null || value === undefined) {
    return
  }
  const inputEl = document.createElement('input')
  inputEl.id = name
  inputEl.name = name
  inputEl.value = value
  formEl.appendChild(inputEl)
}

export default {
  applyAliPay,
}
