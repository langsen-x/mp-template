const {
  task,
  dest,
  src,
  series,
} = require('gulp')
const uglify = require('gulp-uglify-es').default
const cleanCss = require('gulp-clean-css')
const htmlmin = require('gulp-htmlmin')
const jsonminify = require('gulp-jsonminify')
const through = require('through2')

const replaceImport = () => through.obj(function(file, enc, next) {
  if (file.isNull()) {
    next(null, file)
    return
  }
  try {
    // eslint-disable-next-line no-useless-backreference
    const reg = /(?:^|\s)?(?:@import)(?:\s)(?:url)?(?:(?:(?:\()(["'])?(?:https?:)?([^"')]+)\1(?:\))|(["'])(?:.+)\2)(?:[A-Z\s])*)+(?:;)/ig
    file.contents = Buffer.from(file.contents.toString().replace(reg, '@import "$2";'))
    next(null, file)
  } catch (error) {
    next(null, file)
  }
})

task('js', function() {
  return src('dist/**/*.js', 'dist/dev/mp-weixin/common/vendor.js')
    .pipe(uglify())
    .pipe(dest('dist/'))
})

task('wxs', function() {
  return src(['dist/**/*.wxs', '!dist/**/wxcomponents/vant/wxs/add-unit.wxs', '!dist/**/wxcomponents/vant/wxs/add-unit.wxs'])
    .pipe(uglify({
      compress: {
        ie8: true, // 支持 ie8，为了禁止 a === undefined 自动转换为 void 0 === a
        join_vars: false, // 禁止合并 var
      },
    }))
    .pipe(dest('dist/'))
})

task('wxss', function() {
  return src('dist/**/*.wxss')
    .pipe(cleanCss({
      compatibility: '*',
      inline: false,
    }))
    .pipe(replaceImport())
    .pipe(dest('dist/'))
})

task('wxml', function() {
  return src(['dist/**/*.wxml', '!dist/**/wxcomponents/**/*.wxml', '!dist/**/wxcomponents/**/*.wxml'])
    .pipe(htmlmin({
      caseSensitive: true, // 大小写敏感
      removeComments: true, // 删除 HTML 注释
      keepClosingSlash: true, // 单标签上保留斜线
      collapseWhitespace: true, // 压缩 HTML
      ignoreCustomFragments: [
        /<input([\s\S]*?)<\/input>/,
      ],
    }))
    .pipe(dest('dist/'))
})

task('json', function() {
  return src('dist/**/*.json')
    .pipe(jsonminify())
    .pipe(dest('dist/'))
})

task(
  'default',
  series([
    'js',
    'wxs',
    'wxss',
    'wxml',
    'json',
  ]),
)
