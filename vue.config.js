const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  devServer: {
    open: false, 
    host: '0.0.0.0',    
    
    https: false, 
    
    proxy: {
      '/api': {
      target: 'http:
        changeOrigin: true, 
        pathRewrite: {
          '^/api': '', 
        },
      },
      '/ast': {
        target: 'https:
        changeOrigin: true, 
        pathRewrite: {
          '^/ast': '', 
        },
      },
      '/first': {
        target: 'https:
        changeOrigin: true, 
        pathRewrite: {
          '^/first': '', 
        },
      },
    },
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      
      config.optimization.minimizer = [(
        new TerserPlugin({ 
          extractComments: false,
          
          terserOptions: { compress: { drop_console: true } }, 
          parallel: true, 
        })
      )]
      config.optimization.splitChunks = {
        
        
        chunks: 'all', 
      }
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          
          require('postcss-pxtorem')({
            rootValue: 75,
            
            propList: ['*'],
            exclude: /node_modules|folder_name/i,
          }),
        ]
      },
    },
  },
  productionSourceMap: process.env.NODE_ENV !== 'production',
}
