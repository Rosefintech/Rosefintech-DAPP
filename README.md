# defi-dapp

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```

打包前需确认：
  ./src/api/contract.js
  ./src/store/index.js rewardDeadline

测试服打包，需确认 .env.staging
yarn build:staging
正式服打包，需确认 .env.production
yarn build:production

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https:
