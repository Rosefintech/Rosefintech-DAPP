import axios from 'axios';
import qs from 'qs';
import { Toast } from 'vant';

import i18n from '@/i18n/i18n';

const service = axios.create({
  baseURL: '',
  timeout: 100000,
  withCredentials: true,
});

const $t = i18n.messages[i18n.locale];
const whiteList = ['/user/assets/refresh', '/login'];
const pending = [];
const { CancelToken } = axios;

/**
 *
 * @param  {} {config}={} AxiosRequestConfig
 */
const addPending = ({ config }) => {


  const isIn = whiteList.some((url) => config.url.match(url))
  if (isIn) {
    return;
  }
  const url = `${config.url}&${config.method}&${qs.stringify(config.data)}`;
  config.cancelToken = new CancelToken((cancel) => {
    if (!pending.some((item) => item.url === url)) {
      pending.push({
        url,
        cancel,
      });
    }
  });
};

const removePending = ({ config }) => {
  const url = `${config.url}&${config.method}&${qs.stringify(config.data)}`;
  pending.forEach((item, index) => {
    if (item.url === url) {
      item.cancel(`${$t['message']['httpNeRepeat']}${config.url}`);
      pending.splice(index, 1);
    }
  });
};

/**
 *
 * @param  {} {config} AxiosRequestConfig
 */
const requestHeaders = ({ config }) => {

  config.headers.timestamp = Date.now();



  const auth = localStorage.getItem('auth');
  const token = localStorage.getItem('tk');
  if (auth) {
    config.headers.Authorization = auth;
  }
  if (token) {
    config.headers.token = token;
  }


  config.headers['accept-with'] = 'zh-ts';
  config.headers['x-client-req'] = 'dapp';
  config.headers['content-type'] ='application/json'

};

/**
 *
 * @param  {} {config}={} AxiosRequestConfig
 */






/**
 *&&loading=true
 * @param  {} requestHeaders 1.
 * @param  {} requestParams 2.
 * @param  {} removePending 3.
 */
const requestStart = ({ config } = {}) => {
  requestHeaders({ config });

  removePending({ config });
  addPending({ config });

};

/**
 *&&loading=false
 * @param  {} {config}={} AxiosRequestConfig
 * @param  {} {config}={} response body
 */
const requestEnd = ({ config } = {}) => {
  removePending({ config });

};

/**
 * @param  {} {status HTTP
 * @param  {} data
 * @param  {} config}={} AxiosRequestConfig
 */
const responseResolve = ({ status, data, config } = {}) => {
  const { success, msg } = data;
  if (status === 200) {
    switch (success) {
      case true:
        return Promise.resolve(data);
      case false:
        return Promise.resolve(data);
      default:

        if (!config.headers['hide-message']) {
          Toast({
            forbidClick: true,
            icon: 'close',
            message: msg || $t['message']['operationFailure'],
          });
        }
        return Promise.reject(data);
    }
  } else {
    Toast({
      forbidClick: true,
      icon: 'close',
      message: msg || $t['message']['operationFailure'],
    });

    return Promise.reject(data);
  }
};
/**
 *
 * @param  {} requestStart
 */
service.interceptors.request.use(
  (config) => {
    if (!navigator.onLine) {
      setTimeout(() => {
        Toast({
          forbidClick: true,
          icon: 'close',
          message: $t['message']['offline'],
        });
      }, 1000);
    }
    requestStart({ config });
    return config;
  },
  (error) => {
    Toast({
      forbidClick: true,
      icon: 'close',
      message: $t['message']['requestError'],
    });
    Promise.reject(error);
  },
);
/**
 *
 * @param  {} requestEnd 1.
 * @param  {} responseResolve 2.
 */
service.interceptors.response.use(
  async (response) => {
    const { status, data, config } = response;
    requestEnd({ config, data });
    return responseResolve({ status, data, config });
  },
  (error) => {
    Toast.clear();
    if (axios.isCancel(error)) {

    } else {
      const { response } = error;
      if (response) {
        Toast({
          forbidClick: true,
          icon: 'close',
          message: `${response.status} ${response.statusText}`,
        });
      }
    }

    return Promise.reject(error);
  },
);

export { pending };
export default service;
