<template>
  <div class="list-item">
    <div class="img-box">
      <img
        class="total-img"
        v-if="type == 'out'"
        src="../../assets/img/out.png"
      />
      <img class="total-img" v-else src="../../assets/img/put.png" />
    </div>
    <div class="addr-date">
      <p class="address">{{ addressChange(item) }}</p>
      <p class="date">{{ item.time }}</p>
    </div>
    <div class="money-stu">
      <p :class="item.type == 'OUT' ? 'out money' : 'money'">
        <span v-if="item.type == 'OUT'">-</span
        >{{ getMoney(item)}} &nbsp;&nbsp;{{ tokenName }}
      </p>
      <p class="state">{{ itemStatusText(item) }}</p>
    </div>
  </div>
</template>

<script>
import { toFixedFloor } from '@/tool/utils';

export default {
  name: 'ListItem',
  props: {
    tokenName: {
      type: String,
      default: 'ROS',
    },
    item: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'into'
    }
  },
  computed: {
    title() {
      return this.$route.query.name
    }
  },
  methods: {
    addressChange(item) {
      const addr = this.type == 'out' ? item.enter_address : item.out_address;

      return (
        addr.substring(0, 8) +
        '...' +
        addr.substring(addr.length - 5, addr.length)
      );
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
    getMoney(item) {

      return toFixedFloor(item.deal_money, 4);
    }
  }
}
</script>

<style scoped>
.list-item {
  display: flex;
  padding-top: 45px;
  padding-bottom: 35px;
  border-bottom: 1px solid #eeeff6;
  font-family: TsangerYunHei;
}
.list-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.list-item .img-box {
  flex: 0 0 74px;
  text-align: left;
  margin-right: 30px;
}
.img-box .total-img {
  width: 70px;
  border-radius: 50%;
  background-color: #e0ccec;
  margin-top: 10px;
}
.list-item .addr-date {
  flex: 15;
  text-align: left;
}
.list-item .addr-date .address {
  font-size: 30px;
  color: #3a486f;
}
.list-item .addr-date .date {
  font-size: 24px;
  color: #adb0ca;
  margin-top: 10px;
}
.list-item .money-stu {
  flex: 12;
  text-align: right;
}
.money-stu .money {
  font-size: 30px;
  color: #091d42;
  word-break: break-word;
}
.money-stu .out {
  color: #f90066;
}
.money-stu .state {
  font-size: 26px;
  color: #adb0ca;
  margin-top: 10px;
}
</style>
