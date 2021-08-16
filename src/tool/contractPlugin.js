import Web3 from 'web3';
import { web3Url, agencyAddress, agencyAddress2nd, openAddress } from '@/api/contract';
import { agencyABI } from '@/api/agencyABI';
import { agencyABI2nd } from '@/api/agencyABI2nd';
import { openABI } from '@/api/openABI';

if (typeof window.ethereum != 'undefined') {

  window.web3 = new Web3(window.ethereum);
} else {
  window.web3 = new Web3(new Web3.providers.HttpProvider(web3Url));
}

export const web3 = window.web3;


export const agencyContract = new window.web3.eth.Contract(
  agencyABI,
  agencyAddress
);


export const agencyContract2nd = new window.web3.eth.Contract(
  agencyABI2nd,
  agencyAddress2nd
);


export const openContract = new window.web3.eth.Contract(
  openABI,
  openAddress
);

export default {
  install(Vue) {
    /**
     *
     */
    Object.defineProperty(Vue.prototype, '$web3', {
      get() {
        return web3;
      },
    });

    Object.defineProperty(Vue.prototype, '$agencyContract', {
      get() {
        return agencyContract;
      },
    });

    Object.defineProperty(Vue.prototype, '$agencyContract2nd', {
      get() {
        return agencyContract2nd;
      },
    });

    Object.defineProperty(Vue.prototype, '$openContract', {
      get() {
        return openContract;
      },
    });
  }
}
