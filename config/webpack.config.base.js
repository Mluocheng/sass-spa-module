
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const webpack = require('webpack');
const utils = require('../scripts/common/utils');
const theme = require('./theme');

const rootDir = process.cwd(); // 返回 Node.js 进程的当前工作目录
const srcDir = path.resolve(rootDir, 'src'); // 入口路径  当前目录拼接src 返回一个绝对路径  参考 https://blog.csdn.net/kikyou_csdn/article/details/83150538
const publicDir = path.resolve(rootDir, 'public'); // HTML模板路径

const envs = {  // 环境变量
  development: require('./envs/env.local'),
  dev: require('./envs/env.dev'),
  test: require('./envs/env.test'),
  prod: require('./envs/env.prod'),
};

const env = envs[process.env.NODE_ENV] || envs.dev; // 获取当前环境

module.exports = {
  entry: {
    index: path.resolve(srcDir, 'index.tsx'), // 入口路径
  },
  output: { // 出口
    path: rootDir + '/build', // 出口路径
    filename: 'chunks/[name].min.js', // 打包后被压缩的js位置及文件名 在打包中的html中使用 name根据entry的入口文件键名定
    chunkFilename: 'chunks/[name]/[chunkhash].js', // 打包后被压缩的js位置及文件名  按需加载的js
    publicPath: process.env.NODE_ENV === 'development' ? '/' : `/${utils.getProjectName}/`, // 打包后link script资源路径 对应package.json中的name
  },
  // webpack 自身只理解 JavaScript，在此处通过loader转换为webpack 能够处理的有效模块 
  // 本质上，webpack loader 将所有类型的文件，转换为应用程序的依赖图（和最终的 bundle）可以直接引用的模块。
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          colors: false,
          experimentalWatchApi: true,
          onlyCompileBundledFiles: true,
          getCustomTransformers: () => {
            return {
              before: [tsImportPluginFactory({
                libraryDirectory: 'es',
                libraryName: 'antd',
                style: true,
              })]
            };
          },
          compilerOptions: {
            module: 'es2015'
          }
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            }
          },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.less$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[path]_[local]_[hash:base64:6]',
              },
              sourceMap: false,
            }
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: theme,
              javascriptEnabled: true,
            },
          }
        ],
      },
      {
        test: /\.less$/,
        exclude: [/src/],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            }
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: theme,
              javascriptEnabled: true,
            },
          }
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'assets/images/[name]_[hash:base64:6].[ext]',
        }
      },
      {
        test: /\.(ttf|otf)$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'assets/fonts/[name]_[hash:base64:6].[ext]',
        }
      },
    ]
  },
  // 配置如何解析模块
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'], // 可省略引入时的后缀
    alias: { // 快捷引入，可直接以当前目录下查找
      pages: path.resolve(srcDir, 'pages'),
      components: path.resolve(srcDir, 'components'),
      containers: path.resolve(srcDir, 'containers'),
      common: path.resolve(srcDir, 'common'),
      api: path.resolve(srcDir, 'api'),
      assets: path.resolve(srcDir, 'assets'),
      model: path.resolve(srcDir, 'model'),
    }
  },
  // 插件功能 打包优化和压缩，一直到重新定义环境中的变量
  plugins: [
    // 编译时 生成HTML文件
    new HtmlWebpackPlugin({
      template: path.resolve(publicDir, 'index.html'), // webpack模板路径  感觉像HTML模板路径   // 入口文件
      inject: true, // 将所有资产注入给定template或templateContent。传递时，true或'body'所有javascript资源都将放置在body元素的底部。'head'会将脚本放置在head元素中
      chunksSortMode: 'none', // manual - 将chunks按引入的顺序排序,不用这个的话,引入到html的JS可能是错乱排序的 允许值为'none' | 'auto' | 'manual' | {Function}
      chunks: ['index'], // 允许您仅添加一些块（例如仅添加单元测试块）
    }),
    // 该Webpack插件将强制所有必需模块的整个路径与磁盘上实际路径的确切情况相匹配。使用此插件有助于缓解OSX上的开发人员不遵循严格的路径区分大小写的情况，
    // 这些情况会导致与其他开发人员或运行其他操作系统（需要正确使用大小写正确的路径）的构建箱发生冲突。
    new CaseSensitivePathsPlugin(), 
    // 该插件将CSS提取到单独的文件中。它为每个包含CSS的JS文件创建一个CSS文件。它支持CSS和SourceMap的按需加载。 webpack4 
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      allChunks: true,
    }),
    new webpack.optimize.ModuleConcatenationPlugin({}),    
    new webpack.DefinePlugin({
      'PROCESS_ENV': JSON.stringify({ ...env, MODULE_NAME: utils.getProjectName }),
    }),
  ],
  // optimization: {
  //   splitChunks: {
  //     name: true
  //   }
  // },
};
