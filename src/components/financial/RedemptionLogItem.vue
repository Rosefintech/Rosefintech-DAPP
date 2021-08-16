<template>
  <div class="rosefinch-log-item">
    <div class="line-1">
      <div class="ratio-wrap">
        <div class="tit">{{ $t('finance.redemptionRatio') }}</div>
        <div class="value">{{ Math.round(item.scale * 100) }}% <span class="value-tit" v-if="item.speed==='normal'">Normal</span>
        <span class="value-tit" v-if="item.speed==='fast'"> Fast </span>
        </div>
      </div>
      <div class="expect-wrap">
        <div class="tit">{{ $t('finance.expectedRedemption') }}(USDC)</div>
        <div class="value" v-if="+item.requestAmount > 0">{{ toFixedFloor(item.requestAmount, 4) }}</div>
        <div class="value" v-else>{{ $t('finance.dataSyncing') }}</div>
      </div>
      <div class="actual-wrap">
        <div class="tit">{{ $t('finance.actualRedemption') }}(USDC)</div>
        <div class="value" v-if="+item.amount > 0">{{ toFixedFloor(item.amount, 4) }}</div>
        <div class="value" v-else>{{ $t('finance.dataSyncing') }}</div>
      </div>
    </div>
    <div class="line-2">
      <div class="time">{{ formatTime(item.requestTime) }}</div>
      <div class="status" :class="{retired: item.rosRedeem}"  >

        <span :class="{fali:(item.status === 2||item.status === 3)}">{{ getStatusText() }}</span> <span v-if="item.speed === 'normal'&& item.status===0" class="tit-cancel" @click="handleWithdrawNormal(item.userAddress,item.requestFlag)">Cancel</span>
      </div>
      <i
        v-if="item.status == 2 && item.note"
        class="help-wrap"
        @mouseover.stop="showIncomeTip = true"
        @mouseout.stop="showIncomeTip = false"
      >
        <svg
          t="1620474897563"
          class="icon help-icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http:
          p-id="1132"
          width="32"
          height="32"
        >
          <path
            d="M512 85.333333C277.333333 85.333333 85.333333 277.333333 85.333333 512s192 426.666667 426.666667 426.666667c234.666667 0 426.666667-192 426.666667-426.666667S746.666667 85.333333 512 85.333333zM554.666667 810.666667l-85.333333 0 0-85.333333 85.333333 0L554.666667 810.666667zM644.266667 482.133333l-38.4 38.4C571.733333 550.4 554.666667 576 554.666667 640l-85.333333 0 0-21.333333c0-46.933333 17.066667-89.6 51.2-119.466667l51.2-55.466667C588.8 430.933333 597.333333 409.6 597.333333 384c0-46.933333-38.4-85.333333-85.333333-85.333333-46.933333 0-85.333333 38.4-85.333333 85.333333L341.333333 384c0-93.866667 76.8-170.666667 170.666667-170.666667 93.866667 0 170.666667 76.8 170.666667 170.666667C682.666667 422.4 665.6 456.533333 644.266667 482.133333z"
            p-id="1133"
            fill="#E5E6F0"
          ></path>
        </svg>
        <div class="tip-panel" v-show="showIncomeTip">
          {{ item.note }}
        </div>
      </i>
    </div>
  </div>
</template>
<script>
import { toFixedFloor } from '@/tool/utils';
import { swiftWithdraw, withdrawNormal } from '@/api/swift';

export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showIncomeTip: false
    };
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
    getStatusText() {
      if (this.item.status == 0) {
        return this.$t('message.Hoadling');
      } else if (this.item.status == 1) {
        return this.$t('message.Success');
      } else if (this.item.status == 2) {
        return this.$t('message.Failure');
      }else if(this.item.status == 3){
        return this.$t('message.Failure');
      }
    },
    async handleRedeem(item) {
      if (!item.rosRedeem) {
        this.checkIsTimeOk(item);
      }
    },


    async retryWithdraw(item) {
      if (this.redeIng) return;
      this.redeIng = true;

      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: this.$t('message.handling'),
      });
      const params = {
        scale: item.scale * 100,
        speed: item.speed || 'fast',
        userAddress: this.$store.state.address,
      };
      try {
        const { success } = await swiftWithdraw(params);
        this.redeIng = false;
        this.$toast.clear();
        if (success) {
          this.$toast.success(this.$t('finance.redemptionSend'));

          this.$emit('refresh', true);
        } else {
          this.$toast.fail(this.$t('finance.redemptionWaitTip'));
        }
      } catch (error) {
        console.log(error);
        this.redeIng = false;
        this.$toast.clear();
        this.$toast.fail(this.$t('message.handleError'));
        this.$store.dispatch('addError', {
          error,
          func: `swiftWithdraw(${JSON.stringify(params)})`,
        });
      }
    },

    async checkIsTimeOk(item) {
      try {
        const { timeLock } = await this.$agencyContract2nd.methods
          .getPledgeData('0x' + item.buildId)
          .call();


        const timestamp = (+timeLock + 900) * 1000;
        console.log(timestamp, Date.now());

        if (Date.now() > timestamp) {
          this.doRedeem(item);
        } else {
          const t = this.formatTime(timestamp);
          this.$toast.fail(this.$t('finance.waitFor') + '\n' + t);
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch('addError', {
            error,
            func: `getPledgeData(${item.buildId}).call()`
          });
      }
    },

    handleWithdrawNormal(address,value){
        this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: this.$t('message.handling'),
      });
      const params ={userAddress:address,requestFlag:value}
      withdrawNormal(params).then(res=>{
        this.$toast.clear();
        console.log(res)
        if(res.success){
              this.$toast.success({
        duration: 3,
        forbidClick: true,
        message:res.msg ,
      });
       this.$emit('fatherMethod');
       location.reload();

        }else{
                 this.$toast.fail({
        duration: 3,
        forbidClick: true,
        message:res.msg ,
      });
        }
      })
    }
  },
};
</script>

<style scoped>
.value-tit{
  background: rgba(249, 0, 102, 0.1);
    /* opacity: 0.1; */
    border-radius: 13px;
    font-size: 20px;
    font-family: TsangerYunHei;
    font-weight: normal;
    color: #F90066;
    padding: 0px 12px;
}
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
.line-1 .tit {
  font-size: 24px;
  font-weight: 500;
  color: #ADB0CA;
  white-space: nowrap;
}
.line-1 .value {
  font-size: 26px;
  font-weight: 500;
  color: #091D42;
}
.line-1 .actual-wrap {
  text-align: right;
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
  margin-left: auto;
}
.rosefinch-log-item .status .tit-cancel{
  width: 127px;
height: 60px;
line-height: 60px;
text-align: center;
background: #FFFFFF;
border: 2px solid #330066;
border-radius: 30px;
font-size: 28px;
font-family: TsangerYunHei;
font-weight: normal;
color: #330066;
display: inline-block;
}
.rosefinch-log-item .status .fali{
color: rgba(249, 0, 102, 1);
}
.rosefinch-log-item .help-wrap {
  position: relative;
}
.rosefinch-log-item .tip-panel {
  left: unset;
  right: 0;
  word-break: break-all;
}
.rosefinch-log-item .tip-panel::before {
  left: unset;
  right: 6px;
}
.rosefinch-log-item .retired {
  color: #adb0ca;
}
</style>
