<template>
  <div class="message-item" v-show="![10, 11, 12, 13].includes(item.type)">

    <div class="line-1">
      <svg
        t="1620820554778"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http:
        p-id="3437"
        width="26"
        height="26"
      >
        <path
          d="M514.52 958.13h-1.17C268.76 957.53 70.25 758 70.82 513.35c0.3-118.5 46.71-229.8 130.74-313.41a440.82 440.82 0 0 1 312.9-129.12h1.14c118.5 0.3 229.8 46.68 313.41 130.71A440.91 440.91 0 0 1 958.13 515.6a440.58 440.58 0 0 1-130.71 313.38 440.76 440.76 0 0 1-312.9 129.15z m-76.02-272.7a31.23 31.23 0 0 0 19.56 6.51c8.85 0 17.64-3.6 24-10.56l264.96-291.09a31.68 31.68 0 0 0-2.4-45.12 32.7 32.7 0 0 0-45.63 2.4L457.37 613.01l-129.24-139.2a31.26 31.26 0 0 0-44.61-1.32 32.37 32.37 0 0 0-1.32 45.24l150.6 162.18a32.4 32.4 0 0 0 5.7 5.52z"
          p-id="3438"
          fill="#00BEAA"
        ></path>
      </svg>
      <div class="title">
        {{ getTitleText(item) }}
      </div>
    </div>
    <div class="line-2">
      <div class="desc">
        {{ getMessageText(item) }}
      </div>
      <div class="time">{{ item.time }}</div>
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
  },
  data() {
    return {};
  },
  computed: {
    addrPrev() {
      return this.item.type == 3
        ? this.$t('message.transAddress')
        : this.$t('message.recAddress');
    },
  },
  methods: {
    toFixedFloor,
    getTitleText(item) {
      if (item.type == 20) {
        return this.$i18n.locale === 'zh-CN' ? item.title : item.e_title;
      }














      let msg = '';
      if (item.type === 19) {

        msg = `ROS: ${item.ros} ${this.$t('finance.liquidityReward')}`;
      } else if (item.type === 18) {

        msg = `ROS: ${item.ros} ${this.$t('finance.quitReward')}`;
      } else if (item.type === 17) {

        msg = `ROS: ${item.ros} ${this.$t('finance.inviteReward')}`;
      } else if (item.type === 16) {

        msg = `ROS: ${item.ros} ${this.$t('finance.pledgeOK')}`;
      } else if (item.type === 15) {

        msg = `ROS: ${item.rest} ${this.$t('finance.redemption')}`;
      } else if (item.type === 1501) {

        msg = `USDC: ${item.rest} ${this.$t('finance.redeemOK')}`;
       } else if (item.type === 1502) {

        msg = `USDC: ${item.ros} ${this.$t('finance.payChargeOK')}`;
      } else if (item.type === 1503) {

        msg = `USDC: ${item.assist} ${this.$t('finance.payCommissionOK')}`;
      } else if (item.type == 9) {

        msg = `ROS: ${item.ros} ${this.$t('finance.releaseOK')}`;
      }else if (item.type == 8) {

        msg = `ETH: ${item.eth} ${this.$t('finance.pledgeOK')}`;
      } else if (item.type == 801) {

        msg = `ETH: ${item.eth} ${this.$t('finance.openOK')}`;
      } else if (item.type == 802) {

        msg = `ROS: ${item.ros} ${this.$t('finance.pledgeOK')}`;
      } else if (item.type == 7) {

        msg =
          item.rest == '1'
            ? `ETH: ${item.eth} ➜ ROS: ${item.ros}`
            : `ROS: ${item.ros} ➜ ETH: ${item.eth}`;
      } else if (item.type == 6) {

        msg = `ETH: ${item.eth} + ROS: ${item.ros}`;
      } else if (item.type == 5) {

        msg = `ETH: ${item.eth} + ROS: ${item.ros}`;
      } else if (item.type == 3) {
        msg = `${item.assist}: ${item.ros} ${this.$t('message.receiveOk1')}`;

      } else if (item.type == 2) {


       msg = `${item.assist}: ${item.ros} ${this.$t('message.succeTransfer')}`;
      }
      else if (item.type == 4) {

        msg = ` ROS: ${item.ros} ${this.$t('finance.payChargeOK')}`;
      }

      return msg;
    },
    getMessageText(item) {
      if (item.type == 20) {
        return this.$i18n.locale === 'zh-CN' ? item.message : item.e_message;
      }

      let msg = '';
      if (item.type === 19) {

        msg = this.$t('finance.liquidityReward');
      } else if (item.type === 18) {

        msg = this.$t('finance.quitReward');
      } else if (item.type === 17) {

        msg = this.$t('finance.invitee') + this.addressChanges(item.rest);
      } else if (item.type === 16) {



     msg=" Purchase "









      } else if (Math.floor(item.type / 100) === 15) {

        msg = this.$t('finance.redemption');
      } else if (item.type == 9) {

        msg = this.$t('finance.releaseOK');
      } else if (Math.floor(item.type / 100) == 8) {

        msg = this.$t('finance.autoBank');







      } else if (item.type == 7) {

        msg = this.$t('finance.swapOK');
      } else if (item.type == 6) {

        msg = this.$t('asset.recallAssets');
      } else if (item.type == 5) {

        msg = this.$t('asset.openUpMining');
      } else if (item.type == 3) {

        msg = this.$t('message.transAddress') + this.addressChanges(item.rest);
      } else if (item.type == 2) {

        msg = this.$t('message.recAddress') + this.addressChanges(item.rest);
      } else if(item.type==16){


        msg = `ROS: ${item.ros} ${this.$t('finance.pledgeOK')}`;


      }
      else if (item.type == 4) {



        msg = this.$t('message.recAddress') + this.addressChanges(item.assist);
      }


      return msg;
    },
    addressChanges(str) {
      return (
        str.substring(0, 6) + '...' + str.substring(str.length - 6, str.length)
      );
    },
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
      )} ${padS(date.getHours())}:${padS(date.getMinutes())}`;
    },
  },
};
</script>

<style scoped>

.message-item {
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
.line-1 {
  margin-left: -20px;
}
.line-1 .icon {
  width: 32px;
  height: 32px;
}
.line-2 {
  margin-top: 20px;
  padding-left: 20px;
}
.message-item .title {
  font-size: 28px;
  font-weight: 500;
  color: #091d42;
  flex: 5;
  padding-left: 8px;
}
.message-item .time {
  font-size: 24px;
  font-weight: 500;
  flex: 4;
  white-space: pre-wrap;
  text-align: right;
}
</style>
