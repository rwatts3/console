const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const cssnano = require('cssnano')
const path = require('path')

const vendor = [
  'calculate-size',
  'classnames',
  'graphiql',
  'graphcool-styles',
  'immutable',
  'js-cookie',
  'lokka',
  'lokka-transport-http',
  'map-props',
  'moment',
  'normalize.css',
  'rc-tooltip',
  'react',
  'react-addons-pure-render-mixin',
  'react-autocomplete',
  'react-click-outside',
  'react-copy-to-clipboard',
  'react-datetime',
  'react-dom',
  'react-notification-system',
  'react-redux',
  'react-relay',
  'react-router',
  'react-router-relay',
  'react-tagsinput',
  'react-tether',
  'react-tooltip',
  'react-twitter-widgets',
  'redux',
  'redux-thunk',
]

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: './src/main',
    styles: 'graphcool-styles/dist/styles.css',
    vendor,
  },
  output: {
    filename: '[name].[hash].js',
    publicPath: '/',
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.ts(x?)$/,
      loader: 'tslint-loader',
      exclude: /node_modules/,
    }, {
      test: /\.json$/, // TODO check if still needed
      loader: 'json-loader',
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader',
    }, {
      test: /\.scss$/,
      // loader: 'style!css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap',
      loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader',
      exclude: /node_modules/,
    }, {
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      loader: 'babel-loader!awesome-typescript-loader',
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }, {
      test: /\.mp3$/,
      loader: 'file-loader',
    }, {
      test: /icons\/.*\.svg$/,
      loader: 'raw-loader!svgo-loader',
    }, {
      test: /graphics\/.*\.svg$/,
      loader: 'file-loader',
    }, {
      test: /(graphics|gifs)\/.*\.(png|gif)$/,
      loader: 'file-loader',
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      __BACKEND_ADDR__: JSON.stringify(process.env.BACKEND_ADDR.toString()),
      __HEARTBEAT_ADDR__: false,
      __AUTH0_DOMAIN__: '"graphcool-customers-dev.auth0.com"',
      __AUTH0_CLIENT_ID__: '"2q6oEEGaIPv45R7v60ZMnkfAgY49pNnm"',
      __METRICS_ENDPOINT__: false,
      __GA_CODE__: false,
      __SMOOCH_TOKEN__: '"505tvtkv5udrd4kc5dbpppa6x"',
      'process.env': {
        'NODE_ENV': JSON.stringify('dev')
      },
    }),
    new HtmlWebpackPlugin({
      favicon: 'static/favicon.png',
      template: 'src/index.html',
    }),
    new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, 'node-noop'),
    new webpack.optimize.CommonsChunkPlugin('vendor'),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          cssnano({
            autoprefixer: {
              add: true,
              remove: true,
              browsers: ['last 2 versions'],
            },
            discardComments: {
              removeAll: true,
            },
            safe: true,
          })
        ],
        svgo: {
          plugins: [
            {removeStyleElement: true},
          ],
        },
      }
    }),
  ],
  resolve: {
    modules: [path.resolve('./src'), 'node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
  },
}
