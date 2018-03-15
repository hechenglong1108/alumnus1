//引入gulp及各种组件;
var gulp = require('gulp'), //gulp插件

    uglify = require('gulp-uglify'), //js代码压缩

    minifyCSS = require('gulp-minify-css'), //css代码压缩

    sass = require('gulp-sass'), //sass代码压缩

    imagemin = require('gulp-imagemin'), //图片压缩

    imageminJpegRecompress = require('imagemin-jpeg-recompress'), //jpg图片压缩

    imageminOptipng = require('imagemin-optipng'), //png图片压缩

    del = require('del'); //删除文件

//自动刷新
// var browserSync = require('browser-sync');
// var reload = browserSync.reload;

//代理
var proxy = require('http-proxy-middleware');
var connect = require("gulp-connect");

//公共文件复用
var fileinclude = require("gulp-file-include");

//js、css公用文件复用
var inject = require("gulp-inject");

//让任务安装设置的先后顺序执行 防止相互依赖的问题产生
var runSequence = require('gulp-sequence'); //插件 gulp-sequence


//清空文件夹
gulp.task('cleanup', function(cb) {
    return del([
        './dist/**/*'
    ], cb);
});

//处理JS文件:压缩,然后换个名输出;

//命令行使用gulp script启用此任务;

gulp.task('script', function() {
    return gulp.src(['./src/**/*.js','./src/**/*.swf'])
        //.pipe(uglify())
        .pipe(gulp.dest('./dist'));
});


//处理CSS文件:压缩,然后换个名输出;

//命令行使用gulp css启用此任务;
gulp.task('css', function() {
    return gulp.src(['./src/**/*.css'])
        //.pipe(minifyCSS())
        .pipe(gulp.dest('./dist'));
});


//SASS文件输出CSS,天生自带压缩特效;

//命令行使用gulp sass启用此任务;

gulp.task('sass', function() {
    return gulp.src('./src/**/*.sass')
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(gulp.dest('./dist'));

});


//图片压缩任务,支持JPEG、PNG及GIF文件;
//命令行使用gulp jpgmin启用此任务;
gulp.task('imgmin', function() {
    var jpgmin = imageminJpegRecompress({
            accurate: true, //高精度模式
            quality: "high", //图像质量:low, medium, high and veryhigh;
            method: "smallfry", //网格优化:mpe, ssim, ms-ssim and smallfry;
            min: 70, //最低质量
            loops: 0, //循环尝试次数, 默认为6;
            progressive: false, //基线优化
            subsample: "default" //子采样:default, disable;
        }),
        pngmin = imageminOptipng({
            optimizationLevel: 4
        });
    return gulp.src(['./src/**/images/**/*.*'])
        // .pipe(imagemin({
        //     use: [jpgmin, pngmin]
        // }))
        .pipe(gulp.dest('./dist'));
});


//把所有html页面扔进dist文件夹(不作处理);
//命令行使用gulp html启用此任务;
gulp.task('html', function() {
    return gulp.src(['./src/**/*.html','./src/**/*.eot','./src/**/*.svg','./src/**/*.ttf','./src/**/*.woff'])
        .pipe(gulp.dest('./dist'));
});


//监控改动并自动刷新任务;
//命令行使用gulp auto启动;
gulp.task('auto', function() {
    gulp.watch('./src/**/*.js', ['script']);
    gulp.watch('./src/**/*.css', ['css']);
    gulp.watch('./src/**/*.sass', ['sass']);
    gulp.watch('./src/**/images/*.*', ['imgmin']);
    gulp.watch('./src/**/*.html', ['html']);
    gulp.watch('./src/**/*.html', ['fileinclude']);
});

//公共页面复用的文件范围，排除include文件夹下的文件
//公共页面复用的文件范围，排除include文件夹下的文件
gulp.task('fileinclude', function() {
    //适配src下面所有的html文件，排除src下component文件夹下的html
    return gulp.src(['src/**/*.html', '!src/**/component/**.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(inject(gulp.src([
            './src/js/base/jquery.js',
            './src/js/base/layer.js',
            './src/js/base/vue.js',
            './src/js/base/base.js'
        ], {
            read: false
        }), {
            relative: true, //是相对路径
            //ignorePath:['js/main.js'], //忽略文件路径
            addPrefix: "", //文件路径前缀
            addSuffix: "?v=1.0.0", //文件路径后缀
            addRootSlash: false, //是否要追加路径前面的 /
            removeTags: false, //是否删除标记
            name: "inject" //标记名称
        }))
        .pipe(inject(gulp.src(['./src/js/base/head.css',
            './src/js/base/reset.css'
        ], {
            read: false
        }), {
            relative: true, //是相对路径
            //ignorePath:['js/main.js'], //忽略文件路径
            addPrefix: "", //文件路径前缀
            addSuffix: "?v=1.0.0", //文件路径后缀
            addRootSlash: false, //是否要追加路径前面的 /
            removeTags: false, //是否删除标记
            name: "inject" //标记名称
        }))
        .pipe(gulp.dest('dist'));
});

//自动打开浏览器 编译转换文件
// gulp.task('server',function(){
//      browserSync.init({
//         server: {
//             baseDir: "/dist"
//         }
//     });
//     // browserSync({
//     //     proxy: '127.0.0.1:8010',
//     //     port: 8080,
//     //     open: true,
//     //     notify: false
//     // });
// });
gulp.task('webserver',function(){
    connect.server({
        root:"dist",
        port: 8080,
        livereload: false, //不实时修改联动
        middleware: function(connect, opt) {
            return [
                proxy('/api',  {
                    target: 'http://172.16.0.77:9001',
                    pathRewrite:{
                        '^/api' : '/'
                    },
                    changeOrigin:true,
                    prependPath:false
                })
            ]
        }
    });
});

//gulp默认任务 借用sequence插件 解决任务同步问题
gulp.task('default', function(cb) {
    runSequence('cleanup', ['script', 'css', 'imgmin','auto', 'fileinclude'])(cb);
});
