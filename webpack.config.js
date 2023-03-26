const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const development = process.env.NODE_ENV === 'development';
const production = !development;

module.exports = {
  mode: development ? 'development' : 'production',
  context: resolve(__dirname, 'src'),
  entry: production ? './index.js' : './test/index.js',
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js'],
    alias: { '/': resolve(__dirname, 'src') }
  },
  optimization: {
    splitChunks: { chunks: 'all' }
  },
  target: 'node18.12',
  plugins: [new CleanWebpackPlugin()]
};
