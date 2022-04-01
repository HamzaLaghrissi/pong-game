const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const PRODUCTION = false;

module.exports = {
  entry: './src/scripts/pong.js',
  output: {
    // path: (PRODUCTION ?  path.resolve(__dirname, '../server/public/dist') : path.resolve(__dirname, 'dist')),
    path: path.resolve(__dirname, '../server/public/dist'),
    filename: 'scripts/bundle.js'
  },
  
  mode :  (PRODUCTION ? 'production' : 'development'),
  devtool : (PRODUCTION ? undefined : 'eval-source-map'),

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),

    new CopyPlugin({
      patterns: [
	      {
	        from: 'src/images/*',
	        to:   'images/[name][ext]'
	      },
	      {
          from: 'src/style/*',
          to:   'style/[name][ext]'
        }
      ]
    })
  ],

  devServer: {
    static: {
       publicPath: path.resolve(__dirname, 'dist'),
       watch : true
    },
    host: 'localhost',
    port : 8080,
    open : true
}
};