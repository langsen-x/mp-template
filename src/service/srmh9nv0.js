/* eslint-disable */
import crypto from 'crypto-js'
import { DateUtil } from 'sn-js-utils'
import { compareForMD5, toJSON } from '@utils/index'

export default {
  srmh9nv0: function(lz27oTCv) {
    let GikhpY3S, WpCqMTJj // PartnerId and Key
    GikhpY3S = process.env.VUE_APP_PAY_CENTER_PARTNER_ID
    WpCqMTJj = this.gwpamyV1(process.env.VUE_APP_PAY_CENTER_SECRET, process.env.VUE_APP_MP_INNER_ID)

    let NYstBFeZ = DateUtil.timestamp()
    let iM8uk2Ks, krEWj89t
    if (lz27oTCv && Object.keys(lz27oTCv).length > 0) {
      let paramArr = []
      for (let paramName in lz27oTCv) {
        if (lz27oTCv.hasOwnProperty(paramName)) {
          let item = {
            label: paramName,
            value: lz27oTCv[paramName],
          }
          paramArr.push(item)
        }
      }
      paramArr.push({
        label: 'timestamp',
        value: NYstBFeZ,
      })
      paramArr.sort(compareForMD5('label'))
      iM8uk2Ks = GikhpY3S
      for (let item of paramArr) {
        iM8uk2Ks += item.label + item.value
      }
      iM8uk2Ks += WpCqMTJj
    } else {
      iM8uk2Ks = GikhpY3S
      iM8uk2Ks += 'noparamnoparamtimestamp' + NYstBFeZ
      iM8uk2Ks += WpCqMTJj
      lz27oTCv = new Object({ noparam: 'noparam' })
    }
    krEWj89t = this.vP8o407y(iM8uk2Ks)
    lz27oTCv.timestamp = NYstBFeZ
    lz27oTCv.sign = krEWj89t
    lz27oTCv.partner_id = GikhpY3S
    if (process.env.NODE_ENV === 'development') {
      console.log('gen sign params: ', toJSON(lz27oTCv))
    }
    return toJSON(lz27oTCv)
  },
  vP8o407y(strSrc) {
    return crypto.MD5(strSrc).toString().toUpperCase()
  },
  wluM1pBL(DsRONXYL, UmLTPAsb) {
    let PKqU7zuT = crypto.enc.Utf8.parse(UmLTPAsb)
    let rY1XPiW7 = crypto.AES.encrypt(DsRONXYL, PKqU7zuT, {
      mode: crypto.mode.ECB,
      padding: crypto.pad.Pkcs7,
    })
    return rY1XPiW7.ciphertext.toString()
  },
  gwpamyV1(cMS3XtLK, UmLTPAsb) {
    let PKqU7zuT = crypto.enc.Utf8.parse(UmLTPAsb)
    let DsnvieM4 = crypto.enc.Hex.parse(cMS3XtLK)
    let blBCVKeI = crypto.enc.Base64.stringify(DsnvieM4)
    let GguJW9oH = crypto.AES.decrypt(blBCVKeI, PKqU7zuT, {
      mode: crypto.mode.ECB,
      padding: crypto.pad.Pkcs7,
    })
    return GguJW9oH.toString(crypto.enc.Utf8)
  },
}
