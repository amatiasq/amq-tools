module.exports = {
  devtool: 'source-map',
  entry: './demo/timer.ts',
  output: { filename: './dist/timer.js' },

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js']
  },

  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader'
    }]
  },

  devServer: {
    inline: true,
    stats: {
      colors: true,
      progress: true,
    },
  },
};
