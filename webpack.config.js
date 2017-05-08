var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

var path = require("path");

module.exports = {
  entry: './src/app.js',
  output: {
      path: path.resolve(__dirname, "dist"),
      filename: 'app.bundle.js'
  },
  module:{
      rules:[
          {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: ['css-loader','sass-loader']              
            })
          },
            {
               test: /\.js$/,
               exclude: /node_modules/,
               loader: "babel-loader"
             },
             {
      　　　　　　test: /\.(png|jpg)$/ ,
      　　　　　　loader: 'url-loader?limit=64'
      　　　　}

      ]
  },
  devServer: {
    contentBase: path.join(__dirname, "/dist"),
    compress: true,
    port: 9000,
    stats:"errors-only"
  },
  plugins: [new HtmlWebpackPlugin({
      title: 'projects',
      // minify: {
      //   collapseWhitespace: true
      // },
      hash: false,
      template: './src/index.html', // Load a custom template (ejs by default see the FAQ for details)
    }),
    new ExtractTextPlugin({
      filename: 'app.css',
      disable: false,
      allChunks: true
    })
  ]
}
