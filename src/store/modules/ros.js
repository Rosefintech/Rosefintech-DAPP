import { erc20ABI } from '@/api/erc20ABI';
import { agencyContract2nd } from '@/tool/contractPlugin';

const state = {
  liquidityAddress: '',
  scheduleAddress: '',
  rosManagementAddress: '',
  uniswapPairAddress: '',
  isAuthLiquidityMining:false,
  isAuthLiquidity: false, 
  isAuthSchedule: false, 
  isAuthRosManagement: false, 
  isAuthUni2Liquidity: false, 
  isAuthSwift2Schedule: false, 
  isAuthFalco2Management: false, 
}

const mutations = {
  SET_LIQUIDITY_ADDRESS: (state, address) => {
    state.liquidityAddress = address;
    console.log('liquidityAddress ', address );
  },
  
  SET_AUTH_LIQUIDITY_Mining:(state,auth)=>{
    state.isAuthLiquidityMining = auth;
    localStorage.setItem('')
    console.log('isAuthLiquidityMining ', auth);
  },
  SET_AUTH_LIQUIDITY: (state, auth) => {
    state.isAuthLiquidity = auth;
    console.log('isAuthLiquidity ', auth);
  },
  SET_SCHEDULE_ADDRESS: (state, address) => {
    state.scheduleAddress = address;
    console.log('scheduleAddress', address );
  },
  SET_AUTH_SCHEDULE: (state, auth) => {
    state.isAuthSchedule = auth;
    console.log('isAuthSchedule ', auth);
  },
  SET_ROSMANAGEMENT_ADDRESS: (state, address) => {
    state.rosManagementAddress = address;
    console.log('rosManagementAddress ', address );
  },
  SET_AUTH_ROSMANAGEMENT: (state, auth) => {
    state.isAuthRosManagement = auth;
    console.log('isAuthRosManagement ', auth);
  },
  SET_UNISWAP_PAIR_ADDRESS: (state, address) => {
    state.uniswapPairAddress = address;
    console.log('uniswapPairAddress ', address );
  },
  SET_AUTH_UNI_2_LIQUIDITY: (state, auth) => {
    state.isAuthUni2Liquidity = auth;
    console.log('isAuthUni2Liquidity ', auth);
  },
  SET_UNI_CONTRACT: (state, contract) => {
    state.uniContract = contract;
  },
  SET_AUTH_SWIFT_2_SCHEDULE: (state, auth) => {
    state.isAuthSwift2Schedule = auth;
    console.log('isAuthSwift2Schedule ', auth);
  },
  SET_AUTH_FALCO_2_MANAGEMENT: (state, auth) => {
    state.isAuthFalco2Management = auth;
    console.log('isAuthFalco2Management ', auth);
  }
}

const actions = {
  async getUniswapPairAddress({ commit }) {
    if (state.uniswapPairAddress) {
      return state.uniswapPairAddress;
    }
    try {
      const address = await agencyContract2nd.methods.uniswapPairAddress().call();
      commit('SET_UNISWAP_PAIR_ADDRESS', address);
    } catch (error) {
      console.log(error);
    }
    return state.uniswapPairAddress;
  },
  async getUniContract({ commit, dispatch }) {
    if (state.uniContract) {
      return state.uniContract;
    }
    try {
      const uniAddress = await dispatch('getUniswapPairAddress');
      const uniContract = new window.web3.eth.Contract(erc20ABI, uniAddress);
      commit('SET_UNI_CONTRACT', uniContract);
    } catch (error) {
      console.log(error);
    }
    return state.uniContract;
  },
  async reqAuthUniswapPair({ commit, dispatch, rootState }) {
    try {
      const liquidityAddress = await dispatch('getLiquidityAddress');
      const uniContract = await dispatch('getUniContract');
      const { _balance } = await agencyContract2nd.methods
        .getLiquidityProofAmount(rootState.address)
        .call();
      const alloWei = await uniContract.methods.allowance(rootState.address, liquidityAddress).call();
      const liquNum =  new window.web3.utils.BN(_balance);
      const allowance = new window.web3.utils.BN(alloWei);
      const isAuth = allowance.gt(liquNum);
      commit('SET_AUTH_UNI_2_LIQUIDITY', isAuth);
    } catch (error) {
      console.log(error);
    }
  },
  async getLiquidityAddress({ commit }) {
    if (state.liquidityAddress) {
      return state.liquidityAddress;
    }
    try {
      const address = await agencyContract2nd.methods.LiquidityAddress().call();
      commit('SET_LIQUIDITY_ADDRESS', address);
    } catch (error) {
      console.log(error);
    }
    return state.liquidityAddress;
  },
  async getScheduleAddress({ commit }) {
    if (state.scheduleAddress) {
      return state.scheduleAddress;
    }
    try {
      const address = await agencyContract2nd.methods.ScheduleAddress().call();
      commit('SET_SCHEDULE_ADDRESS', address);
    } catch (error) {
      console.log(error);
    }
    return state.scheduleAddress;
  },
  async getRosManagementAddress({ commit }) {
    if (state.rosManagementAddress) {
      return state.rosManagementAddress;
    }
    try {
      const address = await agencyContract2nd.methods.RosManageAddress().call();
      commit('SET_ROSMANAGEMENT_ADDRESS', address);
    } catch (error) {
      console.log(error);
    }
    return state.rosManagementAddress;
  },
  
  reqRosInfo({ dispatch }) {
    
    dispatch('reqAuthLiquidity');
    dispatch('reqAuthSchedule');
    dispatch('reqAuthRosManagement');
    dispatch('reqAuthUniswapPair');
  },
    
  async reqAuthLiquidity({ dispatch }) {
    try {
      await dispatch('reqAuthRosWith', 'Liquidity');
    } catch (error) {
      console.warn(error);
    }
  },

  async reqAuthSchedule({ dispatch }) {
    try {
      await dispatch('reqAuthRosWith', 'Schedule');
    } catch (error) {
      console.warn(error);
    }
  },

  async reqAuthRosManagement({ dispatch }) {
    try {
      await dispatch('reqAuthRosWith', 'RosManagement');
    } catch (error) {
      console.warn(error);
    }
  },
  async reqAuthRosWith({ commit, dispatch, rootState }, contractName = 'Liquidity') {
    const reg = /^[A-Z]\w+$/;
    let name = contractName;
    if (typeof contractName !== "string") {
      throw TypeError("contractName must be a string");
    }
    if (!reg.test(contractName)) {
      name = contractName.slice(0, 1).toUpperCase() + contractName.slice(1);
    }
    const actionName = `get${name}Address`;
    const contractAddress = await dispatch(actionName);
    const rosContract = await dispatch('asset/getTokenContract', 'ROS', { root: true });
    const rosWei = await dispatch('asset/getTokenBalance', 'ROS', { root: true });
    const rosBalance = new window.web3.utils.BN(rosWei);
    const allowanceWei = await rosContract.methods.allowance(rootState.address, contractAddress).call();
    const allowance = new window.web3.utils.BN(allowanceWei);
    const isAuthRos = allowance.gt(rosBalance);
    const commitName = `SET_AUTH_${contractName.toUpperCase()}`
    commit(commitName, isAuthRos);
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
