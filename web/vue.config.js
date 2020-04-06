const CompressionPlugin = require("compression-webpack-plugin")
module.exports = {

    lintOnSave: false,//取消ES6语法校验
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
    outputDir: "dist", //打包目录
    indexPath: "index.html",
    productionSourceMap: false,


devServer: {
        host:"localhost",
        port:"8080",
        proxy: {
            '/send': {
                target: 'https://localhost:5002',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/send': ''
                }
            }

        }
    },

    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
            return {
                plugins: [
                    new CompressionPlugin({
                        test: /\.js$|\.html$|.\css/, //匹配文件名
                        threshold: 10240,//对超过10k的数据压缩
                        deleteOriginalAssets: false //不删除源文件
                    })
                ]
            }
        }

    },
   
}

