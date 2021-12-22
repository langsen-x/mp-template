function save(key, value) {
  try {
    uni.setStorageSync(`${process.env.VUE_APP_STORAGE_NAMESPACE}.${key}`, value)
  } catch (e) {
    // logError('保存缓存时出错');
    console.error('保存缓存时出错')
  }
}

function get(key) {
  let result
  try {
    result = uni.getStorageSync(`${process.env.VUE_APP_STORAGE_NAMESPACE}.${key}`)
  } catch (e) {
    result = false
  }

  if (result && result !== 'undefined' && result !== 'null') {
    if (result instanceof Object || result instanceof Array) {
      if (Object.keys(result).length > 0 || result.length > 0) {
        return result
      } else {
        return false
      }
    } else {
      return result
    }
  } else {
    result = false
    return result
  }
}

function update(key, obj) {
  const localStr = get(key) || '{}'
  const local = JSON.parse(localStr)
  const updated = { ...local, ...obj }
  save(key, JSON.stringify(updated))
}

function remove(key) {
  try {
    uni.removeStorageSync(`${process.env.VUE_APP_STORAGE_NAMESPACE}.${key}`)
  } catch (e) {
    console.error('删除缓存时出错')
  }
}

function clear() {
  try {
    uni.clearStorageSync()
  } catch (e) {
    console.error('清空缓存时出错')
  }
}

export default {
  save,
  get,
  update,
  remove,
  clear,
}
