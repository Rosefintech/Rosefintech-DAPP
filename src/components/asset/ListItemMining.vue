<template>
  <div class="list-item-mining list-item">
    <img
      class="item-icon"
      src="../../assets/img/swap.png"
    />
    <div class="item-info">
      <div class="tit-date">
        <span class="address">{{ titText(item) }}</span>
        <span class="date">{{ item.time }}</span>
      </div>
      <div class="value-status">
        <span class="value">
          {{ toFixedFloor(item.eth_amount, 4) }} ETH +
          {{ toFixedFloor(item.ros_amount) }} ROS
        </span>
        <span class="state">{{ itemStatusText(item) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { toFixedFloor } from '@/tool/utils';

export default {
  name: 'ListItemMining',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    toFixedFloor,
    titText(item) {
      return item.type == 1 ? this.$t('asset.inject') : this.$t('asset.recall')
    },
    itemStatusText(item = {}) {
      if (item.state === 0) {
        return this.$t('message.Handling');
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
.list-item .item-icon {
  flex: 0 0 74px;
  height: 74px;
  margin-right: 30px;
}
.list-item .item-info {
  flex: 1;
  font-size: 26px;
  color: #adb0ca;
}
.list-item .tit-date,
.list-item .value-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list-item .value-status {
  margin-top: 10px;
}
.list-item .date {
  font-size: 24px;
}
.list-item .value {
  color: #3a486f;
}

</style>
