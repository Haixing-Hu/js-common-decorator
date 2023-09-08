/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
const resolve = require('path').resolve;
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { merge } = require('webpack-merge');

/**
 * 所有环境下的公共配置。
 */
 const commonConfig = {
  entry: resolve(__dirname, 'src/index.js'),
  output: {
    filename: 'common-decorator.min.js',
    library: {
      name: 'common-decorator',
      type: 'umd',
    },
    globalObject: 'this',
  },
  devtool: 'source-map',
  mode: 'production',
  stats: 'summary',
  target: ['web', 'es5'],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  externals: {
    vue: 'commonjs2 vue',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_debugger: true,
          },
        },
      }),
    ],
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: [
        resolve(__dirname, 'src'),
      ],
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        babelrc: false,         // replace .babelrc with babel.config.json
        rootMode: 'upward',
      },
    }],
  },
};

/**
 * 模块分析配置。
 */
 const analyzerConfig = {
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
};

module.exports = (process.env.USE_ANALYZER ? merge(commonConfig, analyzerConfig) : commonConfig);
