<template>
  <div class="list-item">
    <img
      class="item-icon"
      src="../../assets/img/swap.png"
    />
    <div class="addr-date">
      <div class="info-line">
        <p v-if="item.type == 1">
          {{ toFixedFloor(item.eth_amount) }} ETH
          ➜
          {{ toFixedFloor(item.ros_amount, 4) }} ROS
        </p>
        <p v-else>
          {{ toFixedFloor(item.ros_amount) }} ROS
          ➜
          {{ toFixedFloor(item.eth_amount, 4) }} ETH
        </p>
      </div>
      <div class="date-line">
        <p class="date">{{ item.time }}</p>
        <p class="state">{{ itemStatusText(item) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { toFixedFloor } from '@/tool/utils';

export default {
  name: 'ListItemSwap',
  props: {
    item: {
      type: Object,
      default: () =>{}
    }
  },
  methods: {
    toFixedFloor,

    addressChange(item) {
      const addr =
        item.type == 'INTO' ? item.fromUser.address : item.toUser.address;
      return (
        addr.substring(0, 10) +
        '...' +
        addr.substring(addr.length - 5, addr.length)
      );
    },
    itemStatusText(item = {}) {
      if (item.state === 0) {
        return this.$t('message.Swapping');
      } else if (item.state === 1) {
        return this.$t('message.Success');
      } else {
        return this.$t('message.Failure');
      }
    },
    formatTime(time = Date.now()) {
      const date = new Date(time);
      const padS = (n) => (n < 10 ? '0' + n : n);
      return `${date.getFullYear()}-${padS(date.getMonth() + 1)}-${padS(
        date.getDate()
      )} ${padS(date.getHours())}:${padS(date.getMinutes())}`;
    },
  }
}
</script>
<style scoped>
.list-item {
  display: flex;
  align-items: center;
  padding-top: 45px;
  padding-bottom: 35px;
  border-bottom: 1px solid #eeeff6;
  font-family: TsangerYunHei;
}
.list-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.list-item .item-icon {
  flex: 0 0 74px;
  height: 74px;
  margin-right: 30px;
}
.list-item .addr-date {
  flex: 380;
  text-align: left;
}
.list-item .addr-date .info-line {
  font-size: 30px;
  color: #3a486f;
}
.list-item .addr-date .date {
  font-size: 24px;
  font-family: TsangerYunHei;
  color: #adb0ca;
}
.list-item .date-line {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.date-line .money {
  font-size: 30px;
  font-family: TsangerYunHei;
  color: #091d42;
}
.date-line .out {
  color: #f90066;
}
.date-line .state {
  font-size: 26px;
  font-family: TsangerYunHei;
  color: #adb0ca;
}
</style>
