<template>
  <div class="rosefinch-log-item">
    <div class="line-1">
      <div class="value">
        {{ toFixedFloor(item.ethNum, 6) }}
        ETH
      </div>
      <div class="status" :class="{retired: item.rosRedeem}" > {{ statusText }}</div>
    </div>
    <div class="line-2">
      <div class="time">{{ item.buildTime }}</div>
      <div
        v-if="!item.rosRedeem"
        class="btn btn-light btn-redeem"
        :disabled="!item.rosPledgeExpired"
        @click="handleRedeem(item)"
      >
        {{ $t('finance.release') }}
      </div>
    </div>
  </div>
</template>
<script>
import { toFixedFloor } from '@/tool/utils';

export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    totalValue: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {};
  },
  computed: {
    statusText() {
      if (this.totalValue <= 0) {
        return ''
      } else {
        if (this.item.rosRedeem) {
            return this.$t('finance.released');
        } else {

          return this.$t('finance.openSuccess')
        }
      }



    },
  },
  created() {
    this.reqIsExpired();
  },
  mounted() {
    this.checkPending(['release']);
  },
  methods: {
    toFixedFloor,
    formatRatio(num = 0) {
      if (num == 0) {
        return '/';
      }
      const pre = num > 0 ? '+' : '';
      return pre + toFixedFloor(num, 2) + '%';
    },
    formatTime(time = Date.now()) {
      const date = new Date(time);
      const padS = (n) => (n < 10 ? '0' + n : n);
      return `${date.getFullYear()}-${padS(date.getMonth() + 1)}-${padS(
        date.getDate()
      )} ${padS(date.getHours())}:${padS(date.getMinutes())}:${padS(date.getSeconds())}`;
    },
    async handleRedeem(item) {
      if (!item.rosRedeem) {
        this.checkIsTimeOk();
      }
    },


    async doRedeem() {
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: this.$t('message.handling')
      });
      let txHash = '';
      try {
        const res = await this.$agencyContract2nd.methods
          .ransomRos('0x' + this.item.buildId)
          .send({
            from: this.$store.state.address,
          }).on('transactionHash', (hash) => {
            txHash = hash;
            this.startCheckState(hash, 'release');
          });

        console.log('is redeem ok', res);
        this.removeByTxHash(txHash);
        this.onSendOK(res, 'release');
      } catch (error) {
        this.removeByTxHash(txHash);
        this.onSendFail(error, 'release');
      }
    },

    async onSendOK(receipt, type) {
      if (type != 'release') return;

      this.clearStateTimer();
      this.$toast.clear();
      this.item.rosPledgeExpired = true;
      this.item.rosRedeem = true;
      this.$toast.success(this.$t('message.handleOK'));
    },

    onSendFail(error, type) {
      if (type != 'release') return;

      this.clearStateTimer();
      this.$toast.clear();

      if (error.code === 4001) {
        this.$toast.fail(this.$t('message.denied'));
        return;
      }

      this.$toast.fail(this.$t('message.handleError'));
      this.$store.dispatch('addError', {
        error,
        func: `ransomRos(${this.item.id}).call()`
      });
    },

    async reqIsExpired() {
      if (this.item.rosRedeem) return;
      try {
        const { timeLock } = await this.$agencyContract2nd.methods
          .getPledgeData('0x' + this.item.buildId)
          .call();


        const timestamp = (+timeLock + 900) * 1000;


        this.item.rosPledgeExpired = Date.now() > timestamp;
        this.item.validTime = timestamp;
      } catch (error) {
        console.warn(error);
      }
    },

    async checkIsTimeOk() {
      try {
        if (this.item.rosPledgeExpired) {
          this.doRedeem();
        } else {
          const t = this.formatTime(this.item.validTime);
          this.$toast.fail(this.$t('finance.waitFor') + '\n' + t);
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch('addError', {
            error,
            func: `getPledgeData(${this.item.buildId}).call()`
          });
      }
    }
  },
};
</script>

<style scoped>
.rosefinch-log-item {
  width: 100%;
  padding: 20px 0;
  font-size: 24px;
  font-family: TsangerYunHei;
  font-weight: 400;
  color: #adb0ca;
  border-bottom: 1px solid #f5f6fd;
}
.line-1,
.line-2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.line-2 {
  margin-top: 20px;
}
.btn-redeem {
  width: 140px;
  height: 60px;
  line-height: 60px;
  background: #fff;
  border: 2px solid #330066;
  border-radius: 30px;
  margin-left: auto;
  margin-right: 0;
}
.rosefinch-log-item .value {
  font-size: 26px;
  font-weight: 500;
  color: #091d42;
}
.rosefinch-log-item .status {
  font-size: 26px;
  font-weight: 500;
  color: #4285f4;
}
.rosefinch-log-item .retired {
  color: #adb0ca;
}
</style>
