<template>
  <div class="ratio-list">
    <div class="ratio-item" @click="handleDataRange(90)">
      <p class="tit" :class="{ on: activeOpt == 90 }">{{ $t('kestrel.month3') }}</p>
      <!-- <p class="value" :class="{ down: ratioData.month3 < 0 }">
        {{ formatRatio(ratioData.month3) }}
      </p> -->
    </div>
    <div class="ratio-item" @click="handleDataRange(183)">
      <p class="tit" :class="{ on: activeOpt == 183 }">{{ $t('kestrel.month6') }}</p>
      <!-- <p class="value" :class="{ down: ratioData.month6 < 0 }">
        {{ formatRatio(ratioData.month6) }}
      </p> -->
    </div>
    <div class="ratio-item" @click="handleDataRange(365)">
      <p class="tit" :class="{ on: activeOpt == 365 }">{{ $t('kestrel.year1') }}</p>
      <!-- <p class="value" :class="{ down: ratioData.month12 < 0 }">
        {{ formatRatio(ratioData.month12) }}
      </p> -->
    </div>
    <div class="ratio-item" @click="handleDataRange(1095)">
      <p class="tit" :class="{ on: activeOpt == 1095 }">{{ $t('kestrel.year3') }}</p>
      <!-- <p class="value" :class="{ down: ratioData.month36 < 0 }">
        {{ formatRatio(ratioData.month36) }}
      </p> -->
    </div>
    <div class="ratio-item" @click="handleDataRange(5000)">
      <p class="tit" :class="{ on: activeOpt == 5000 }">{{ $t('kestrel.all') }}</p>
      <!-- <p class="value" :class="{ down: ratioData.monthAll < 0 }">
        {{ formatRatio(ratioData.monthAll) }}
      </p> -->
    </div>
  </div>
</template>
<script>
import { toFixedFloor } from '@/tool/utils';

export default {
  name: 'TrendRatio',
  props: {
    ratioData: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      activeOpt: 15
    }
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
    handleDataRange(size) {
      console.log(size);
      this.activeOpt = size;
      this.$emit('change-size', size);
    },
  },
};
</script>
<style scoped>
.ratio-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  text-align: center;
}
.ratio-list .ratio-item {
  cursor: pointer;
}
.ratio-list .tit {
  height: 48px;
  line-height: 48px;
  padding: 0 20px;
  font-size: 26px;
  color: #adb0ca;
  border-radius: 24px;
}
.ratio-list .on {
  background: #f5f6fd;
  color:#091d42;
}
.ratio-list .value {
  font-size: 22px;
  color: #f90066;
  line-height: 46px;
}
.ratio-list .down {
  color: #55ad5c;
}
</style>
