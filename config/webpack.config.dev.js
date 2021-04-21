import webpackconfig from './webpack.config.base';

const webpackMerge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');

module.exports = webpackMerge(baseWebpackConfig, {
  mode: 'development',
  // 方便调试使用的sourcemap配置
  devtool: 'eval-source-map',
  // 配置webpack的日志消息不输出
  stats: { children: false },
});
