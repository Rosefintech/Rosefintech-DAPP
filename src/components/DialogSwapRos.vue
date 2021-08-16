<template>
  <div class="dialog-swap-ros">
    <van-dialog
      class="dialog-box"
      :show-cancel-button="false"
      :show-confirm-button="false"
      v-model="visible"
    >
      <div class="dialog-content">
        <!-- <p class="p title">{{ $t('finance.stopTitle') }}</p> -->
        <p class="p p-tip" v-html="$t('message.swapTip')"></p>
        <p class="auth-tip tip" v-if="!isAuthRos">{{ $t('message.authTip') }}</p>
        <div class="btn-box">
          <button class="btn btn-dark btn-sure" v-if="!isAuthRos" @click="handleAuth">
            {{ $t('index.authorize') }}
          </button>
          <button class="btn btn-dark btn-sure" v-else :disabled="!isAuthRos" @click="handleSwap">
            {{ $t('asset.btnSwap') }}
          </button>
        </div>
      </div>
      <div class="cancel-box">
        <van-icon class="cancel-btn" name="close" @click="hide" />
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { toFixedFloor } from '@/tool/utils';
import { erc20ABI }from '@/api/erc20ABI';
import { convertABI }from '@/api/convertABI';
import { convertAddress, oldRosAddress }from '@/api/contract';

export default {
  inject: ['reload'],
  data() {
    return {
      visible: false,
      isAuthRos: false,
      ethBalance: 0,
      rosBalanceOld: 0,
      rosAddressOld: '',
      oldRosContract: null,
    }
  },
  watch: {
    '$store.state.address': {
      immediate: true,
      handler(value) {

        if (value && this.$route.path === '/index') {

          this.reqETHBalance();

          this.reqRosBalance();
        }
      }
    },
  },
  methods: {

    async reqETHBalance() {
      try {
        const ethWei = await this.$web3.eth.getBalance(this.$store.state.address);
        this.ethBalance = +toFixedFloor(
          this.$web3.utils.fromWei(ethWei, 'ether'),
          4
        );
        console.log(this.ethBalance);
      } catch (error) {
        console.warn(error);
      }
    },
    async reqRosBalance() {
      try {
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
        });
        const contract = this.getOldRosContract();
        const balanceWei = await this.reqTokenBalance(contract, oldRosAddress)
        const allowanceWei = await this.reqAllowance(contract);
        this.rosBalanceOld = +this.$web3.utils.fromWei(balanceWei);
        console.log('rosbalance old', this.rosBalanceOld);
        this.visible = this.rosBalanceOld > 0;




        this.isAuthRos = +this.$web3.utils.fromWei(allowanceWei) >= this.rosBalanceOld;
        this.$toast.clear();
      } catch (error) {
        this.$toast.clear();
        console.warn(error);
        this.$toast.fail(this.$t('message.reqAuthError'));
      }
    },

    getOldRosContract() {
      if (this.oldRosContract) {
        return this.oldRosContract;
      } else {
        this.oldRosContract = new this.$web3.eth.Contract(erc20ABI, oldRosAddress);
        return this.oldRosContract;
      }
    },


    reqTokenBalance(contract) {
      return contract.methods
        .balanceOf(this.$store.state.address)
        .call();
    },


    reqAllowance(contract) {
      return contract.methods
        .allowance(this.$store.state.address, convertAddress)
        .call();
    },


    async handleAuth() {
      if (this.ethBalance < 0.001) {
        return this.$toast.fail(this.$t('message.authTip'));
      }
      try {
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: this.$t('message.authorizing')
        })
        const contract = this.getOldRosContract();

        await contract.methods
          .approve(
            convertAddress,
            '500000000000000000000000'
          )
          .send({
            from: this.$store.state.address,
          });
        this.isAuthRos = true;
        this.$toast.clear();
        this.$toast.success(this.$t('message.authOk'));
      } catch (error) {
        this.$toast.clear();
        if (error.code === 4001) {
          this.$toast.fail(this.$t('message.denied'));
        } else {
          console.warn(error);
          this.$toast.fail(this.$t('message.authError'));
        }
      }
    },
    async handleSwap() {
      try {
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: this.$t('asset.swapping')
        })
        const convertContract = new this.$web3.eth.Contract(convertABI, convertAddress);
        await convertContract.methods.ConvertRose()
          .send({ from: this.$store.state.address });


        this.hide();
        this.$toast.clear();
        this.$toast.fail(this.$t('asset.swapOk'));

        this.reload();

        this.$store.dispatch('asset/initAsset');
      } catch (error) {
        this.$toast.clear();
        if (error.code === 4001) {
          this.$toast.clear();
          this.$toast.fail(this.$t('message.denied'));
        } else {
          this.$toast.fail(this.$t('asset.swapFail'));
        }
      }
    },
    hide() {
      this.visible = false;
    },
    show() {
      this.visible = true;
    }
  }
}
</script>
<style scoped>

.btn {
  display: block;
  max-width: 700px;
  margin: 0 auto;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border-radius: 40px;
  font-size: 30px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  color: #fff;
}
.btn-dark {
  border: 1px solid #330066;
  background: #330066;
  color: #fff;
}
.btn-light {
  background: #fff;
  color: #330066;
  border: 1px solid #330066;
}
.btn[disabled],
.btn.disabled {
  background: #f5f6fd !important;
  color: #fff !important;
  border: 1px solid #f5f6fd !important;
}
.btn-dark[disabled],
.btn-dark.disabled {
  border: 1px solid #330066 !important;
  background: #330066 !important;
  color: #fff !important;
  opacity: 0.4 !important;
}

.dialog-swap-ros .p {
  font-size: 30px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #091D42;
  line-height: 48px;
}
.dialog-swap-ros .red {
  color: #f90066;
}
.dialog-swap-ros .p-tip {
  font-size: 32px;
  font-weight: 400;
  color: #091D42;
  margin-top: 40px;
  margin-bottom: 60px;
}
.dialog-swap-ros .auth-tip {
  font-size: 24px;
  font-weight: 400;
  color: #ADB0CA;
  margin-top: 40px;
}
.dialog-swap-ros .btn {
  width: 460px;
  margin-top: 30px;
}
/* .dialog-swap-ros .btn-sure {
  display: block;
  max-width: 700px;
  margin: 0 auto;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border-radius: 40px;
  font-size: 30px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  color: #fff;
  margin-top: 40px;
  border: 1px solid #330066;
  background: #330066;
  color: #fff;
} */
</style>
