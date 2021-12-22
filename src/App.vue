<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
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
