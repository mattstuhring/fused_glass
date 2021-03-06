var webpack = require('webpack')

module.exports = {
  entry: [
    'script!jquery/dist/jquery.min.js',
    'script!bootstrap/dist/js/bootstrap.min.js',
    './app/app.jsx'
  ],
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery'
    })
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  resolve: {
    root: __dirname,
    alias: {
      applicationStyles: 'app/styles/app.scss',
      About: 'app/components/About.jsx',
      AuthService: 'app/components/services/AuthService',
      Cart: 'app/components/Cart.jsx',
      Categories: 'app/components/products/product/Categories.jsx',
      Collections: 'app/components/products/product/Collections.jsx',
      Contact: 'app/components/Contact.jsx',
      Gallery: 'app/components/Gallery.jsx',
      Header: 'app/components/Header.jsx',
      Home: 'app/components/Home.jsx',
      Login: 'app/components/Login.jsx',
      Main: 'app/components/Main.jsx',
      Navigation: 'app/components/Navigation.jsx',
      ProductAdd: 'app/components/products/ProductAdd.jsx',
      ProductDetails: 'app/components/products/ProductDetails.jsx',
      ProductUpdate: 'app/components/products/ProductUpdate.jsx',
      Playground: 'app/components/playground.jsx',
      SideNav: 'app/components/SideNav.jsx'
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        },
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        // Limiting the size of the woff fonts breaks font-awesome ONLY for the extract text plugin
        // loader: "url?limit=10000"
        loader: "url"
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        loader: 'file'
      },
      {
        test: /\.exec\.js$/,
        loader: 'script-loader'
      }
    ]
  },
  devtool: 'inline-source-map'
};
