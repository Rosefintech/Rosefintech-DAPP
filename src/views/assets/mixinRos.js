import { toFixedFloor } from '@/tool/utils';
import { erc20ABI } from '@/api/contract';

const { fromWei } = window.web3.utils; 

export default {
  data() {
    return {
      liquidityAddress: '',
      rosAddress: '',
      erc20rosContract: null, 
      isAuthRos: false,
      rosBalance: 0,
    }
  },
  methods: {
    async reqRosAndAuthInfo() {
      try {
        this.liquidityAddress = await this.getLiquidityAddress();
        this.rosAddress = await this.getRosAddress();
        console.log('liquidityAddress ', this.liquidityAddress );
        console.log('rosAddress ', this.rosAddress);
        
        this.erc20rosContract = new this.$web3.eth.Contract(erc20ABI, this.rosAddress);
        const rosWei = await this.getRosBalance(this.erc20rosContract);
        const allowance = await this.getAllowance(this.erc20rosContract, this.liquidityAddress);
        this.isAuthRos = +allowance >= +rosWei;
        this.rosBalance = +toFixedFloor(fromWei(rosWei, 'ether'), 4);
        console.log('rosWei ', rosWei, this.rosBalance);
        console.log('allowance ', allowance);
      } catch (error) {
        console.warn(error);
        
      }
    },
    
    
    getLiquidityAddress() {
      return this.$agencyContract2nd.methods.LiquidityAddress().call();
    },
    getRosAddress() {
      return this.$agencyContract2nd.methods.rosAddress().call();
    },
    getRosBalance(contract) {
      return contract.methods.balanceOf(this.address).call();
    },
    getAllowance(contract, liquidityAddress) {
      return contract.methods.allowance(this.address, liquidityAddress).call();
    },
  }
}
