<template>
  <div class="bottom-btns" :class="{ hign: hasBtns }">
    <div class="btn btn-discussion" @click="handleForum">
      <img class="icon-forum" src="../../assets/img/icon-forum.png" alt="" />
      {{ $t('kestrel.discussion') }}
    </div>
    <div class="status-tip closed" v-if="!isTimeToOpen">{{ $t('kestrel.contractClosed') }}</div>
    <template v-else>
      <button
        v-if="!isFalcoOpen"
        class="btn btn-dark btn-open"
        @click="handleOpen"
      >{{ $t('kestrel.open') }}</button>
      <template v-else>
        <template v-if="isCanWithdraw">
          <button
            v-if="isAuthFalco2Manage"
            class="btn btn-dark btn-withdraw"
            :disabled="!isCanWithdraw"
            @click="handleWithdraw"
          >{{ $t('finance.withdraw') }}</button>
          <button
            v-else
            class="btn btn-dark btn-authorize"
            @click="handleAuth"
          >{{ $t('index.authorize') }}</button>
        </template>
        <div v-else class="status-tip opened">{{ $t('kestrel.opened') }}</div>
      </template>
    </template>
  </div>
</template>
<script>
import { assetManagementAddress } from '@/api/contract.js';
import { toFixedFloor, handleForum } from '@/tool/utils';

export default {
  data() {
    return {
      isFalcoOpen: false,
      falcoOpenTime: 1934899200,
      authIng: false,
      sending: false,
    }
  },
  computed: {
    isTimeToOpen() {
      return Date.now() >= +this.falcoOpenTime * 1000;
    },

    isCanWithdraw() {
      return +this.$store.state.asset.falcoBalance > 0;
    },
    isAuthFalco2Manage() {
      return this.$store.state.ros.isAuthFalco2Management;
    },
    hasBtns() {
      return (this.isTimeToOpen && !this.isFalcoOpen) || (this.isFalcoOpen && this.isCanWithdraw)
    }
  },
  methods: {
    toFixedFloor,
    handleForum,








    async reqIsUserOpen() {
      try {
        this.isFalcoOpen = await this.$openContract.methods
          .getOpenUp()
          .call();

        console.log('is open:', this.isFalcoOpen);
        this.falcoOpenTime = await this.$openContract.methods
          .openTime()
          .call();
        this.$store.commit('setFalcoOpenTime', +this.falcoOpenTime * 1000);

        setTimeout(() => {
          this.$emit('bottom-high', this.hasBtns);
        }, 0);
      } catch (error) {
        console.warn(error);
      }
    },

    handleAuth() {

      if (this.authIng) return;
      this.authIng = true;
      this.doAuthFalco2Management();
    },

    onAuthOK(type) {
      if (type != 'FALCO_2_MANAGEMENT') return;

      this.clearStateTimer();

      this.$store.commit('ros/SET_AUTH_FALCO_2_MANAGEMENT', true);
      this.authIng = false;
      this.$toast.clear();
      this.$toast.fail(this.$t('message.authOk'));
    },

    onAuthFail(error, type) {
      if (type != 'FALCO_2_MANAGEMENT') return;

      this.clearStateTimer();

      this.authIng = false;
      this.$toast.clear();
      if (error.code === 4001) {
        this.$toast.fail(this.$t('message.denied'));
      } else {
        this.$toast.fail(this.$t('message.authError'));
        const params = `${assetManagementAddress},${'1111111111111111111111111111111111111111111111111111111'}`;
        this.$store.dispatch('addError', {
          error,
          func: `falcoContract.methods.approve(${params}).call()`,
        });
      }
    },

    handleOpen() {
      if (this.sending) return;
      this.sending = true;

      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: this.$t('message.handling'),
      });

      let txHash = '';
      this.$openContract.methods
        .enableOpenUp()
        .send({
          from: this.$store.state.address
        })
        .on('transactionHash', (hash) => {
          txHash = hash;
          this.startCheckState(hash, 'openFalco');
        })
        .on('receipt', (receipt) => {
          this.removeByTxHash(txHash);
          this.onSendOK(receipt, 'openFalco');
        })
        .on('error', (error) => {
          this.removeByTxHash(txHash);
          this.onSendFail(error, 'openFalco');
        })
    },


    handleWithdraw() {
      if (this.sending) return;
      this.sending = true;

      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: this.$t('message.handling'),
      });

      let txHash = '';
      this.$openContract.methods
        .withdrawToken()
        .send({
          from: this.$store.state.address
        })
        .on('transactionHash', (hash) => {
          txHash = hash;
          this.startCheckState(hash, 'withdrawFalco');
        })
        .on('receipt', (receipt) => {
          this.removeByTxHash(txHash);
          this.onSendOK(receipt, 'withdrawFalco');
        })
        .on('error', (error) => {
          this.removeByTxHash(txHash);
          this.onSendFail(error, 'withdrawFalco');
        })
    },

    onSendOK(receipt, type) {
      if (!['withdrawFalco', 'openFalco'].includes(type)) return;

      this.clearStateTimer();
      this.sending = false;
      this.$toast.clear();
      this.$toast.success(this.$t('message.handleOK'));
      if (type === 'openFalco') {
        this.onOpenOK();
      } else if (type === 'withdrawFalco') {
        this.onWithdrawOK();
      }
    },


    onOpenOK() {
      this.isFalcoOpen = true;
    },


    onWithdrawOK() {

      this.$store.dispatch('asset/initAsset');
    },

    onSendFail(error, type) {
      this.clearStateTimer();
      this.sending = false;
      this.$toast.clear();

      if (error.code === 4001) {
        this.$toast.fail(this.$t('message.denied'));
        return;
      }

      this.$toast.fail(this.$t('message.handleError'));
      if (type === 'openFalco') {
        this.onOpenFail(error);
      } else if (type === 'withdrawFalco') {
        this.onWithdrawFail(error);
      }
    },


    onOpenFail(error) {
      this.$store.dispatch('addError', {
        error,
        func: `enableOpenUp().send()`,
      });
    },


    onWithdrawFail(error) {
      this.$store.dispatch('addError', {
        error,
        func: `withdrawToken().send()`,
      });
    }

  }
}
</script>

<style scoped>
.bottom-btns {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 140px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px 4px #ddd;
}
.bottom-btns .btn-discussion {
  width: 250px;
  border: 2px solid #f5f6fd;
  color: #adb0ca;
  margin: 0 30px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bottom-btns .icon-forum {
  width: 40px;
  height: 40px;
  margin-right: 12px;
}
.bottom-btns .status-tip {
  font-size: 26px;
  font-weight: 400;
  color: #adb0ca;
}

@media only screen and (max-width: 750px) {
  .bottom-btns {
    height: 60px;
    line-height: 60px;
  }
  .bottom-btns .btn-discussion {
    display: none;
  }
  .hign {
    height: 140px;
    line-height: 140px;
  }
  .hign .btn-dark {
    width: 470px;
  }
}
@media only screen and (min-width: 751px) {
  .bottom-btns .btn-discussion {
    display: flex;
  }
  .bottom-btns .btn-dark {
    width: 250px;
    margin: 0;
  }
}
</style>
