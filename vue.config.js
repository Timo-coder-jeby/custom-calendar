const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')

module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer({
            browsersList: ['Android >= 4.0', 'iOS >= 10']
          }),
          pxtorem({
            rootValue: 37.5,
            propList: ['*'],
          })
        ]
      }
    }
  },
}
