<template>
  <div class="transfer">
    <TheHeader :title="$t('message.transfer')" @click-left="handleBack" />
    <div class="transfer-content">
      <div class="content-bg mobile"></div>
      <div class="info">
        <div class="box box-top">
          <p class="tit">{{ $t('message.recAddress') }}</p>
          <div class="to-address">
            <input
              v-model.trim="toAddress"
              class="input-address"
              @change="handleAddressChange"
              :placeholder="$t('message.targetAddress')"
            />
          </div>
          <p v-show="showAddressError" class="red address-tip error-tip">
            {{ $t('message.invalidAddress') }}
          </p>
        </div>
        <div class="box">
          <p class="tit">{{ $t('message.amount') }}：</p>
          <div class="to-address">
            <input
              v-model="tranMoney"
              type="number"
              class="input-money"
              oninput="if(value.length>16)value=value.slice(0,16)"
              @change="handleInputChange"
              @focus="inputFocus = true"
              @blur="inputFocus = false"
              :placeholder="`0.0000`"
            />
          </div>
          <div class="remark-box">
            <span class="remark"
              >{{ $t('asset.balance') }}{{ toFixedFloor(tokenBalance, 4) }}
              {{ $route.query.name }}</span
            >
          </div>
        </div>
        <button
          class="next-step btn btn-dark"
          @click="handleTransfer"
          :disabled="tranMoney <= 0 || !toAddress"
        >
          {{ $t('index.confirm') }}
        </button>
        <ShareSideBtn />
      </div>
    </div>
  </div>
</template>

<script>
import ShareSideBtn from '@/components/ShareSideBtn.vue';
import { toFixedFloor } from '@/tool/utils';

export default {
  name: '',
  components: {
    ShareSideBtn,
  },
  data() {
    return {
      tranMoney: '',
      toAddress: '',
      remark: '',
      inputFocus: false,
      tokenAddress: '',
      showAddressError: false,
      transferIng: false,
      whiteList: ['ROS', 'Falco', 'rFalco'],
    };
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
    tokenName() {
      return this.$route.query.name;
    },
    tokenBalance() {
      let name = this.tokenName.toLowerCase();
      const key = `${name}Balance`;
      return this.$store.state.asset[key];
    },
  },
  created() {
    if (!this.whiteList.includes(this.$route.query.name)) {
      this.handleBack();
    }
  },
  methods: {
    toFixedFloor,
    watchAddress() {
      this.checkPending(['transfer']);
    },
    handleInputChange() {
      this.tranMoney = Math.abs(this.tranMoney);
      if (this.tranMoney > this.ZLBbalance) {
        this.tranMoney = this.ZLBbalance;
      }
    },
    handleAddressChange() {
      this.showAddressError = !this.$web3.utils.isAddress(this.toAddress);
    },
    handleTransfer(type = null) {
      if (!this.address) {
        this.$toast.fail(this.$t('message.noAuth'));
        return;
      }
      if (!this.$web3.utils.isAddress(this.toAddress)) {
        this.$toast.fail(this.$t('message.invalidAddress'));
        return;
      }
      if (!this.tranMoney || this.tranMoney <= 0) {
        this.$toast.fail(this.$t('message.invalidAmount'));
        return;
      }

      if (type !== 'refresh') {
        this.$toast.loading({
          duration: 0,
          message: this.$t('message.transferIng'),
        });
      } else {
        this.$toast.loading({
          duration: 0,
          clickForbid: true,
        });
      }

      setTimeout(() => {
        this.nextStep();
      }, 0);
    },

    handleBack() {

      this.MyGo(-1);
    },

    async nextStep() {
      if (this.transferIng) return;
      this.transferIng = true;

      const num = this.$web3.utils.toWei(String(this.tranMoney), 'ether');
      let txHash = '';
      try {
        const contract = await this.$store.dispatch(
          'asset/getTokenContract',
          this.tokenName
        );
        await contract.methods.transfer(this.toAddress, num)
          .send({
            from: this.address,
          })
          .on('transactionHash', (hash) => {
            txHash = hash;
            this.startCheckState(hash, 'transfer');
          });

        this.removeByTxHash(txHash);
        this.onSendOK(null,'transfer');
      } catch (error) {
        this.removeByTxHash(txHash);
        this.onSendFail(error, 'transfer');
      }
    },

    onSendOK(receipt, type) {
      if (type !== 'transfer') return;

      this.clearStateTimer();

      this.$store.dispatch('asset/updateTokenBalance', this.tokenName);
      this.transferIng = false;
      this.$toast.clear();
      this.$toast.success(this.$t('message.succeTransfer'));


      localStorage.setItem('assettab', 'out');
      this.$router.push('/asset?name=ROS');
    },

    onSendFail(error, type) {
      if (type !== 'transfer') return;

      this.clearStateTimer();
      this.transferIng = false;
      this.$toast.clear();
      if (error.code === 4001) {
        this.$toast.fail(this.$t('message.denied'));
        return;
      }

      this.$toast.fail(this.$t('message.authError'));
      const num = this.$web3.utils.toWei(String(this.tranMoney), 'ether');
      const params = `${this.toAddress}, ${num}`;
      this.$store.dispatch('addError', {
        error,
        func: `transfer(${params}).send()`,
      });
    }
  },
};
</script>

<style scoped>
.transfer .content-bg {
  background-color: #330066;
  border-radius: 0 0 50px 50px;
  height: 150px;
}
.transfer .info {
  position: relative;
  padding: 0 30px;
}
.transfer .info .box {
  padding: 50px 30px;
  background-color: #fff;
  border-radius: 40px;
  margin-bottom: 30px;
}
.error-tip {
  text-align: left;
  text-indent: 10px;
}
.box .tit {
  font-size: 34px;
  font-family: TsangerYunHei;
  color: #3a486f;
  text-align: left;
  line-height: 66px;
}
.to-address {
  border-bottom: 1px solid #f5f6fd;
  line-height: 90px;
  margin-top: 10px;
}
.to-address .input-address {
  border: none;
  font-size: 28px;
  width: 100%;
  padding: 0;
  text-indent: 10px;
}
.to-address .input-money {
  font-size: 48px;
  width: 95%;
  font-family: TsangerYunHei;
}
.box .remark-box {
  margin: 30px 0;
  padding-left: 20px;
  text-align: left;
}
.box .remark {
  font-size: 24px;
  font-family: TsangerYunHei;
  font-weight: 400;
  color: #adb0ca;
  margin-right: 20px;
}
.box {
  overflow: hidden;
}
.box .tit-left {
  float: left;
}
.box .money {
  float: right;
  font-size: 26px;
  font-family: TsangerYunHei;
  font-weight: 400;
  color: #adb0ca;
  line-height: 40px;
  opacity: 0.5;
  text-align: right;
  padding-right: 10px;
}
.info .next-step {
  margin-top: 110px;
  width: 588px;
  font-size: 30px;
}
@media only screen and (max-width: 750px) {
  .transfer .info {
    padding: 0 30px;
    margin: 0 auto;
    margin-top: -130px;
  }
}
@media only screen and (min-width: 751px) {
  .transfer .info {
    padding: 0 30px;
    width: 1000px;
    margin: 0 auto;
    margin-top: 52px;
  }
}
</style>
<style>
.transfer .van-nav-bar {
  background-color: #330066;
}
.transfer .van-nav-bar__content {
  height: 110px;
}
.transfer .van-nav-bar .van-icon {
  color: #fff;
  font-size: 36px;
}
.transfer .van-nav-bar__title {
  color: #fff;
  font-size: 36px;
  font-family: TsangerYunHei;
}
</style>
