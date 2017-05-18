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
      Main: 'app/components/Main.jsx',
      Navigation: 'app/components/Navigation.jsx',
      Header: 'app/components/Header.jsx',
      Home: 'app/components/Home.jsx',
      About: 'app/components/About.jsx',
      Gallery: 'app/components/Gallery.jsx',
      Contact: 'app/components/Contact.jsx',
      Admin: 'app/components/Admin.jsx',
      FieldGroup: 'app/components/FieldGroup.jsx',
      Cart: 'app/components/Cart.jsx',
      SideNav: 'app/components/SideNav.jsx',
      Products: 'app/components/Products.jsx',
      Collections: 'app/components/Collections.jsx',
      Item: 'app/components/Item.jsx',
      applicationStyles: 'app/styles/app.scss'
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
      }
    ]
  },
  devtool: 'inline-source-map'
};
