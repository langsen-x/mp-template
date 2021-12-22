const fs = require('fs')
const name = 'area.json'
const path = `./src/config/${name}`
const { areaList } = require('./area')
const {
  // eslint-disable-next-line camelcase,no-unused-vars
  province_list,
  // eslint-disable-next-line camelcase
  city_list,
  // eslint-disable-next-line camelcase
  county_list,
} = areaList
const addressList = []
const countryList = []
// eslint-disable-next-line camelcase
const country_obj = {}
let country = {}
let tempCountryKey = ''
for (const [key, value] of Object.entries(county_list)) {
  const countryKey = (key + '').substr(0, 4)
  if (tempCountryKey !== countryKey) {
    if (country?.value) {
      countryList.push(country)
    }
    tempCountryKey = countryKey
    country = {}
    country.value = countryKey
    country.children = []
    country.children.push({
      label: value,
      value: key,
    })
  } else {
    country.children.push({
      label: value,
      value: key,
    })
  }
}
if (country?.value) {
  countryList.push(country)
}
countryList.forEach(country => {
  country_obj[country.value] = country.children
})
// console.log('countryList:', countryList)
// console.log('country_obj:', country_obj)
const cityList = []
// eslint-disable-next-line camelcase
const city_obj = {}
let city = {}
let tempCityKey = ''
for (const [key, value] of Object.entries(city_list)) {
  const cityKey = (key + '').substr(0, 2)
  const country = {
    label: value,
    value: key,
    children: country_obj[(key + '').substr(0, 4)],
  }
  if (tempCityKey !== cityKey) {
    if (city?.value) {
      cityList.push(city)
    }
    tempCityKey = cityKey
    city = {}
    city.value = cityKey
    city.children = []
    city.children.push(country)
  } else {
    city.children.push(country)
  }
}
if (city?.value) {
  cityList.push(city)
}
cityList.forEach(city => {
  city_obj[city.value] = city.children
})
// console.log('cityList:', cityList)
// console.log('city_obj:', city_obj)

for (const [key, value] of Object.entries(province_list)) {
  addressList.push({
    label: value,
    value: key,
    children: city_obj[(key + '').substr(0, 2)],
  })
}

function writeFile(path, data, callback) {
  fs.writeFile(path, data, function(err) {
    if (err) {
      console.log(err)
      // eslint-disable-next-line node/no-callback-literal
      callback({ result: false })
    }
    // eslint-disable-next-line node/no-callback-literal
    callback({ result: true })
  })
}

writeFile(path, JSON.stringify(addressList), (obj) => {
  if (obj.result) {
    console.log('数据写入成功！')
  } else {
    console.log('数据写入失败！')
  }
})
