<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        console.log('有新版本')
      } else {
        console.log('无新版本')
      }
    })

    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '检测到小程序有新版本，点击确定重启小程序',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        },
      })
    })

    updateManager.onUpdateFailed(function() {
      console.log('新版本下载失败')
    })
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
}
</script>

<style lang="scss">
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import 'module/uni.css';
@import 'styles/global.css';
@import 'styles/custom.scss';
@import "styles/animate.min.css"; // 未使用动画就不引入
</style>
