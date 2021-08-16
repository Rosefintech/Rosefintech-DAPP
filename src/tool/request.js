
import Axios from 'axios';
import store from '@/store'

import { Toast } from 'vant';

/**
 *Axios instance
 */
const AJAX = Axios.create({
  baseURL: '',
  timeout: 10000,
  withCredentials: true,
});


AJAX.interceptors.request.use(
  (config) => {

    if (!navigator.onLine === true) {

      setTimeout(() => {
        Toast({ forbidClick: true, icon: 'close', message: 'network error' });
      }, 1000);
    }

    if (!store.state.address) {
      store.dispatch('ethereumConnect')
    }


    if (store.state.auth) {

      config.headers.Authorization = 'Bearer ' + store.state.auth;
    }
    if (store.state.token) {
      config.headers.token = store.state.token;
    }
    config.headers['accept-with'] = 'zh-ts';
    config.headers['x-client-req'] = 'dapp';

    return config;
  },
  (error) => {
    Toast.clear();

    if (error && error.response) {
      console.log('err',error.response);
    }

    return Promise.reject(error);

  }
);


AJAX.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    Toast.clear();
    if (
      error.code == 'ECONNABORTED' &&
      error.message.indexOf('timeout') != -1
    ) {
      Toast({ forbidClick: true, icon: 'close', message: 'network error' });
    }
    console.log('err', error.response)

    if (error && error.response) {

      Toast({
        forbidClick: true,
        icon: 'close',
        message: error.response.status + ' ' + error.response.statusText,
      });
    }

    return Promise.reject(error);
  }
);


export default {

  _ajaxType(url, params, type) {
    type = type || 'get';
    url = url || '';
    params = params || {};
    if (url) {
      return AJAX[type](
        url,
        type == 'get'
          ? {
              params: params,
            }
          : params
      );
    }
  },


  get(url, params) {
    return this._ajaxType(url, params);
  },


  post(url, params) {

    return this._ajaxType(url, params, 'post');
  },










};
