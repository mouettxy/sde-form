module.exports = {
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(js | vue)$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            fix: true,
            formatter: 'prettier',
          },
        },
      ],
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/css/main.sass"',
      },
    },
  },
}
