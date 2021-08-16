
import { erc20ABI } from '@/api/erc20ABI';
import { agencyContract, agencyContract2nd } from '@/tool/contractPlugin';
import { falcoAddress } from '@/api/contract';

const state = {
  erc20rosContract: null,
  liquidityAddress: '',
  scheduleAddress: '',
  assetNames: ['ROS', 'Swift', 'Falco', 'rFalco'],
  rosAddress: '',
  swiftAddress: '',
  falcoAddress: '',
  rfalcoAddress: '',
  rosBalance: null,
  swiftBalance: null,
  falcoBalance: null,
  rfalcoBalance: null,
  rosContract: null,
  swiftContract: null,
  falcoContract: null,
  rfalcoContract: null,
  usdcNum:null,
}

const mutations = {
  SET_ROS_ADDRESS: (state, address) => {
    state.rosAddress = address;
    console.log('rosAddress ', address);
  },
  SET_SWIFT_ADDRESS: (state, address) => {
    state.swiftAddress = address;
    console.log('swiftAddress ', address );
  },
  SET_FALCO_ADDRESS: (state, address) => {
    state.falcoAddress = address;
    console.log('falcoAddress ', address );
  },
  SET_RFALCO_ADDRESS: (state, address) => {
    state.rfalcoAddress = address;
    console.log('rfalcoAddress ', address );
  },

  SET_ROS_BALANCE: (state, num) => {
    state.rosBalance = num;
    console.log('rosBalance ', num);
  },
  SET_ROS_usdcNum: (state, num) => {
    state.usdcNum = num;
    console.log('usdcNum ', num);
  },
  SET_SWIFT_BALANCE: (state, num) => {
    state.swiftBalance = num;
    console.log('swiftBalance ', num );
  },
  SET_FALCO_BALANCE: (state, num) => {
    state.falcoBalance = num;
    console.log('falcoBalance ', num );
  },
  SET_RFALCO_BALANCE: (state, num) => {
    state.rfalcoBalance = num;
    console.log('rfalcoBalance ', num );
  },
  SET_ROS_CONTRACT: (state, contract) => {
    state.rosContract = contract;
  },
  SET_SWIFT_CONTRACT: (state, contract) => {
    state.swiftContract = contract;
  },
  SET_FALCO_CONTRACT: (state, contract) => {
    state.falcoContract = contract;
  },
  SET_RFALCO_CONTRACT: (state, contract) => {
    state.rfalcoContract = contract;
  },
}

const actions = {
  async updateRosBalance({ commit, dispatch }) {
    try {
      const rosWei = await dispatch('getRosBalance');
      const rosBalance = +window.web3.utils.fromWei(rosWei, 'ether');
      commit('SET_ROS_BALANCE', rosBalance);
      console.log(rosBalance);

    } catch (error) {
      console.warn(error);
    }
  },
  async getTokenAddress({ state, commit }, tokenName) {
    let address = '';
    try {
      const name = tokenName.toLowerCase();
      const key = `${name}Address`;
      if (state[key]) {
        address = state[key];
      } else {
        if (name == 'ros') {
          address = await agencyContract2nd.methods
            .rosAddress()
            .call();
        } else if (name == 'swift') {
          address = await agencyContract2nd.methods
            .BillAddress()
            .call();
        } else if (name === 'falco') {
          address = await agencyContract.methods
            .getProofTokenAddress()
            .call();


          if (process.env.VUE_APP_SERVER_ID === '0') {
            address = falcoAddress
          }
        } else if (name === 'rfalco') {
          address = await agencyContract.methods
            .getBillTokenAddress()
            .call();
        }
        const upName = name.toUpperCase();
        commit(`SET_${upName}_ADDRESS`, address);
      }
    } catch (error) {
      console.warn(error);
    }

    return address;
  },

  async getTokenContract({ dispatch, commit }, tokenName) {
    let contract = null;
    try {
      const name = tokenName.toLowerCase();
      const key = `${name}Contract`;
      if (state[key]) {
        contract = state[key];
      } else {
        const tokenAddress = await dispatch('getTokenAddress', tokenName);
        contract = new window.web3.eth.Contract(erc20ABI, tokenAddress);
        const upName = tokenName.toUpperCase();
        commit(`SET_${upName}_CONTRACT`, contract);
      }
    } catch (error) {
      console.log(error);
    }

    return contract;
  },

  /**
   *
   * address:String
   */
  async updateTokenBalance({ dispatch, commit, rootState }, tokenName) {
    try {
      const contract = await dispatch('getTokenContract', tokenName);
      const res = await contract.methods
        .balanceOf(rootState.address)
        .call();
      let balance = +window.web3.utils.fromWei(res);
      const upName = tokenName.toUpperCase();
      commit(`SET_${upName}_BALANCE`, balance);
    } catch (error) {
      console.warn(error);

    }
  },

  async getTokenBalance({ dispatch, state }, tokenName) {
    let balance = 0;
    try {
      const name = tokenName.toLowerCase();
      const key = `${name}Balance`;
      if (state[key] === null) {
        await dispatch('updateTokenBalance', tokenName);
      }
      balance = state[key];
    } catch (error) {
      console.log(error);
    }

    return balance;
  },



  initAsset({ state, dispatch }) {
    state.assetNames.forEach((tokenName) =>{
      dispatch('updateTokenBalance', tokenName);
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
