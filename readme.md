
# html-withimg-loader

webpack处理资源无往不利，但有个问题总是很苦恼，html中直接使用img标签src加载图片的话，因为没有被依赖，图片将不会被打包。这个loader解决这个问题，图片会被打包，而且路径也处理妥当。

______________

## 安装

    npm install html-withimg-loader --save

## 使用

    var html = require('html-withimg-loader!../xxx.html');

或者写到配置中：

    loaders: [
        {
            test: /\.(htm|html)$/i,
            loader: 'html-withimg-loader'
        }
    ]

结合html-webpack-plugin，在入口html中也可以使用img标签

    new HtmlWebpackPlugin({
        template: 'html-withimg-loader!'+path.resolve(srcDir, filename),
        filename: filename
    })


**注意，必须请求虚拟目录/__build/下的html才是处理后的html，新手可能不知道这个**

额外支持一项黑科技：

    <div>
        #include("./layout/top.html")
    </div>

子页面将被引入。该语法支持嵌套。

## 支持两个query参数：

* query.min 默认会去除html中的换行符，配置min=false可不去除
* query.deep deep=false将关闭include语法嵌套子页面的功能

    require('html-withimg-loader?min=false!xxx.html');

## 更新记录：

### 0.1.7

* 修复了min=false时的换行符问题

### 0.1.6:

* 修复了不以/、./、../开头的不规范图片路径造成模块无法找到的问题

### 0.1.5：

* 解决了页面中包含单引号会编译异常的bug