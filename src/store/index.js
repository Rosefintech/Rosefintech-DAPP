import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from 'js-cookie';
import { login, loginFront } from '@/api/user';
import { isKestrel } from '@/api/falco';
import { cookieDomain } from '@/api/contract';
import { Locale, Toast } from 'vant';
import Router from 'vue-router';
Vue.use(Router);
import i18n from '@/i18n/i18n'; 



import { addError } from '../api/user';

Vue.use(Vuex)



const modulesFiles = require.context('./modules', true, /\.js$/)


const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  
  
  
  
  
  modules,
  state: {
    language: 'en-US',
    appVm: null, 
    isShowGuide: !localStorage.getItem('gd'),
    isGoBought: !localStorage.getItem('bt'),
    inviter: localStorage.getItem('inviter'), 
    address: '',
    token: '',
    auth: '',
    chainId: '',
    bought: localStorage.getItem('bought') == 'true', 
    isSealing: localStorage.getItem('sealing') === 'sealing', 
    unreadNum: 0, 
    btcList: null, 
    btcTimestamp: null, 
    rewardDeadline: '2021/07/25 20:00', 
    falcoOpenTime: new Date(2031, 3, 26).getTime(), 
  },
  mutations: {
    setAppVm(state, vm) {
      state.appVm = vm;
    },
    setInviter(state, address) {
      state.inviter = address;
      localStorage.setItem('inviter', address);
    },
    setChainId(state, chainId) {
      state.chainId = String(chainId);
      localStorage.setItem('chainId', chainId);
    },
    setAddress(state, address) {
      state.address = address;
      localStorage.setItem('address', address);
    },
    setToken(state, token) {
      state.token = token;
      
      localStorage.setItem('tk', token);
    },
    setAuthorization(state, token) {
      state.auth = token;
      
      localStorage.setItem('auth', token);
    },
    setLanguage(state, lang = 'en-US') {
      state.language = lang;
      i18n.locale = lang;
      Locale.use(lang, i18n.messages[lang]);
      document.documentElement.lang = lang;
      localStorage.setItem('lang', lang);
      Cookies.set('lang', lang, {
        expires: 100,
        path: '/',
        domain: cookieDomain,
      });
    },
    setIsShowGuide(state, isShow = false) {
      state.isShowGuide = isShow;
      localStorage.setItem('gd', isShow ? '' : 'no');
    },
    
    setIsSealing(state, isSealing = false) {
      state.isSealing = isSealing;
      localStorage.setItem('sealing', isSealing ? 'sealing' : 'false');
    },
    setIsBuy(state, isBuy) {
      state.bought = isBuy;
      localStorage.setItem('bought', isBuy);
    },
    setUnreadNum(state, num) {
      state.unreadNum = num;
    },
    setFalcoOpenTime(state, timestamp) {
      state.falcoOpenTime = timestamp;
    },
    SET_BTC_LIST(state, list = []) {
      state.btcList = list;
    },
    SET_BTC_TIMESTAMP(state, time) {
      state.btcTimestamp = time;
    }
  },
  actions: {
    async addError({ dispatch, state }, error) {
      try {
        error.time = Date.now();
        const params = {
          address: state.address,
          time: Date.now(),
          error: JSON.stringify(error),
        };
        dispatch('error/addErrorLog', params);
        const { success, msg } = await addError(params);
        console.log(success, msg);
      } catch (error) {
        console.warn(error);
      }
    },
    async reqIsSealing({ commit }, address) {
      if (!address) {
        console.warn('no address');
        return;
      }
      const params = {
        address: address
      }
      const { success, data } = await isKestrel(params);
      if (success) {
        commit('setIsSealing', data);
      } else {
        commit('setIsSealing', false);
      }
    },
    async reqAuthorization({ commit, state }) {
      try {
        if (!state.address) {
          console.warn('no address');
          return;
        }
        const params = { address: state.address };
        const { success, data } = await login(params);
        if (success && data) {
          commit('setAuthorization', data.token);
        } else {
          Toast.fail(i18n.messages[i18n.locale]['message']['tokenFail']);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async reqToken({ commit, state }) {
      try {
        if (!state.address) {
          console.warn('no address');
          return;
        }
        const params = { address: state.address, account: 'front', password: '21A63c985080' };
        const { success, data } = await loginFront(params);
        if (success && data) {
          commit('setToken', data);
        } else {
          Toast.fail(i18n.messages[i18n.locale]['message']['tokenFail']);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async ethereumConnect({ dispatch, commit, state }) {
      if (!window.ethereum) {
        state.appVm.showDialog();
        return;
      }
      
      commit('setAddress', '');
      commit('setToken', '');
      commit('setAuthorization', '');
      try {
        
        let acc;
        if (typeof window.ethereum.enable === 'function') {
          acc = await window.ethereum.enable();
        } else {
          acc = await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        
        
        if (acc && acc[0]) {
          await commit('setAddress', acc[0]);
          dispatch('asset/initAsset');
          dispatch('ros/reqRosInfo');
          dispatch('reqToken');
          dispatch('reqAuthorization');
          
          Toast.clear();
        } else {
          
          Toast.clear();
          Toast.fail(i18n.messages[i18n.locale]['message']['connectError']);
        }
      } catch (error) {
        if (error.code === 4001) {
          
          
          console.log('Please connect to account');
        } else {
          console.error(error);
        }
        Toast.clear();
        Toast.fail(i18n.messages[i18n.locale]['message']['connectError']);
      }
    },
    
    async onAccountsChanged({ dispatch, commit, state }) {
      if (!window.ethereum) {
        
        state.appVm.showDialog();
        return
      }
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts && accounts[0]) {
          await commit('setAddress', accounts[0]);
          dispatch('asset/initAsset');
          dispatch('ros/reqRosInfo');
          dispatch('reqToken');
          dispatch('reqAuthorization');
          
          
        
          
        } else {
          
          
          
          
          Toast.fail(i18n.messages[i18n.locale]['message']['connectError']);
        }
      });
    },
    
    async onNetworkChanged({ dispatch, state }) {
      if (!window.ethereum) {
        state.appVm.showDialog();
        return;
      }
      window.ethereum.on('chainChanged', (chainId) => {
        if (chainId) {
          dispatch('ethereumConnect');
        }
      });
    },
    showShareQR({ state }) {
      state.appVm.showQR();
    },
  },
})

export default store;
