/**
 * gulp工作流
 *TODO: 1)解决sass,cssmin全部文件编译压缩的问题2)watch gulpfilejs自动重启;
 */
var projectName = '', // projectName = '',
    publicPath = '',  // publicPath = '',
    gulp = require( 'gulp' ),
    watch = require( 'gulp-watch' ),
    sass = require( 'gulp-sass' ),
    cssmin = require( 'gulp-cssmin' ),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    usemin = require('gulp-usemin'),
    htmlmin = require('gulp-htmlmin'),
    rev = require('gulp-rev'),
    uglify = require('gulp-uglify'),
    base64 = require('gulp-base64'),
    spritesmith = require("gulp-spritesmith"),
    gulpif = require("gulp-if"),
    browserSync = require( 'browser-sync' ).create(),
    reload = browserSync.reload;

gulp.task('dev', ['sprite'], function() {
    browserSync.init({
        server: {
            baseDir: "./",
        },
        startPath: projectName + "assets/index.html"
    });
    //gulp.watch( "gulpfile.js", ['dev'] ); // 监听gulpfile.js
    gulp.watch( projectName + "assets/images/sprite/*.png", ['sprite'] ); // 监听sprite,自动生成雪碧图
    gulp.watch( projectName + "assets/sass/*.scss", ['sass'] ); // 监听SASS
    gulp.watch( [projectName + "assets/**/*.html", projectName + "assets/html/**/*.html", projectName + "assets/css/**/*.css", projectName + "assets/js/**/*.js", projectName + "assets/images/**/*.(png|jpg|jpeg|gif)"],  reload ); // 监听html/css/js
});

// scss编译后的css将注入到浏览器里实现更新
gulp.task( 'sass', function() {
    return gulp.src([ projectName + "assets/sass/*.scss", '!'+projectName+"assets/sass/mixin.scss", '!'+projectName+"assets/sass/sprite.scss" ])
        .pipe( sass({ outputStyle: 'expanded' }).on( 'error', function( err ){ console.log( err ); this.emit('end'); } ) ) // nested/expanded/compact/compressed
        .pipe( gulp.dest(projectName + "assets/css") )
        //.pipe( reload({stream: true}) );
});
gulp.task('sass:watch', function () {
  gulp.watch( projectName + "assets/sass/*.scss", ['sass']);
});

// css sprite
gulp.task('sprite', function () {
    return  gulp.src(projectName + 'assets/images/sprite/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            styleName: 'sprite.scss',
            imgPath: '../images/sprite.png',
            // cssFormat: 'css',
            // Prefix all sprite names with `sprite-` (e.g. `home` -> `sprite-home`)
            cssVarMap: function (sprite) {
              sprite.name = 'sprite' + sprite.name;
            }
        }))
        .pipe(gulpif('*.png', gulp.dest(projectName + 'assets/images/')))
        .pipe(gulpif('*.scss', gulp.dest(projectName + 'assets/sass/')));
});

// css压缩
gulp.task( 'cssmin', ['sass'], function() {
    return gulp.src( [projectName + "assets/css/*.css", "!"+projectName + "assets/css/*.min.css"] )
        .pipe(cssmin()) // nested/expanded/compact/compressed
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(projectName + 'assets/css'))
        //.pipe(reload({stream: true}));
});

// 图片压缩
gulp.task( 'imagemin', [ 'clean' ], function() {
    return gulp.src(projectName + "assets/images/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest(projectName + publicPath + 'images/'))
});

// 清除dist
gulp.task( 'clean', function () {
   return gulp.src([ projectName + 'dist/', projectName + 'css/', projectName + 'js/', projectName + 'images/', projectName + 'plugins/', projectName + '*.html' ], {read: false})
        .pipe(clean());
});

// copy
gulp.task( 'copy', [ 'clean' ], function () {
    return gulp.src([ projectName + 'assets/plugins/**/*' ])
        .pipe(gulp.dest(projectName + publicPath + 'plugins/'));
});

// 生产环境usemin
gulp.task('usemin', ['copy','imagemin'], function() {
    return gulp.src(projectName + 'assets/**/*.html')
    .pipe(usemin({
        html: [
            function () {
                return htmlmin({ 
                    removeComments: true,  //清除HTML注释
                    //collapseWhitespace: true,  //压缩HTML
                    collapseBooleanAttributes: true,  //省略布尔属性的值 <input checked="true"/> ==> <input />
                    //removeAttributeQuotes: true,  //尽可能地删除html属性的引号
                    removeRedundantAttributes: true,  //当属性值是默认值时删除该属性
                    useShortDoctype: true,  //doctype使用简短形式(h5)
                    //removeOptionalTags: true,  //尽量移除不需要的闭合标签
                    removeEmptyAttributes: true,  //删除所有空格作属性值 <input id="" /> ==> <input />
                    removeScriptTypeAttributes: true,  //删除<script>的type="text/javascript"
                    removeStyleLinkTypeAttributes: true,  //删除<style>和<link>的type="text/css"
                    minifyJS: true,  //压缩页面JS
                    minifyCSS: true  //压缩页面CSS
                })
            }
        ],
        css: [ function () { return cssmin() }, function () { return base64() }, function () { return rev() } ],
        css1: [ function () { return cssmin() }, function () { return rev() } ],
        js: [ function () { return uglify() }, function () { return rev() } ],
        js1: [ function () { return uglify() }, function () { return rev() } ]
    }))
    .pipe(gulp.dest(projectName + publicPath));
});

// usemin后执行base64进行优化
gulp.task('base64', ['usemin'], function () {
    return gulp.src( projectName + publicPath + "css/**/*.css" )
        .pipe(base64({
            //baseDir: 'public',
            //extensions: ['svg', 'png', /\.jpg#datauri$/i], 
            //exclude:    [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
            maxImageSize: 2*1024, // bytes 
            //debug: true
        }))
        .pipe(gulp.dest(projectName + publicPath + "css"));
});

gulp.task('build', ['base64'], function() {
    browserSync.init({
        server: {
            baseDir: "./",
        },
        startPath: projectName + publicPath + "index.html"
    });
    //gulp.watch( [projectName + publicPath + "**/*.html", projectName + publicPath + "css/**/*.css", projectName + publicPath + "js/**/*.js"], reload ); // 监听html/css/js
});