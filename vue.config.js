module.exports = {
  transpileDependencies: ['vuetify'],
  publicPath: process.env.NODE_ENV === 'production' ? '/' : 'https://sde.ru.com/',
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
