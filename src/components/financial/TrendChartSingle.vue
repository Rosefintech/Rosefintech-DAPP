<template>
  <div class="trend-wrapper">
    <div class="total-value">
      <span class="tit">• {{ $t('finance.totalIncome') }}</span>
      <span class="value red" :class="{ down: totalIncome < 0 }">{{ formatIncome(totalIncome) }}</span>
    </div>
    <img class="logo" src="../../assets/img/logo1.png">
    <div class="chart-box">
      <div id="singleChart" class="singleChart"></div>
    </div>
  </div>
</template>
<script>
import { toFixedFloor, toFixedFloorPercent, shortenNumber } from '@/tool/utils';
import * as echarts from 'echarts';









export default {
  name: '',
  props: {
    proName: {
      type: String,
      default: 'falco'
    },
    ratioData: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      singleChart: null,
      totalIncome: 0,
      option: {

        tooltip: {
          trigger: 'axis',
          showContent: false,
          axisPointer: {
            type: 'cross',
            label: {
              fontSize: 9,
              backgroundColor: '#574bfa',
            },
          },
        },




        grid: {
          left: '1%',
          right: '1%',
          bottom: '5%',
          top: '8%',
          containLabel: true,
        },
        xAxis: {

          type: 'category',
          splitLine: {
            show: false,
          },
          axisLabel: {
            fontSize: 9,
            color: '#adb0ca',
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#adb0ca',
              opacity: 0.1
            },
          },
          axisTick: {
            lineStyle: {
              color: '#adb0ca',
              opacity: 0.1
            }
          },

          data: ['04-26'],
        },
        yAxis: {

          type: 'value',
          axisLabel: {
            fontSize: 9,

            formatter: (value) => {
              return '$' + shortenNumber(value, 0)
            }
          },
          axisPointer: {
            label: {
              formatter: '${value}'
            }
          },
          splitLine: {
            show: false,
          },
          max: 10,


          axisLine: {
            lineStyle: {
              color: '#adb0ca',
              opacity: 0.1
            },
          },
        },
        series: [
          {


            data: [0],
            name: '',
            type: 'line',
            smooth: true,
            showSymbol: false,

            lineStyle: {
              width: 3,
              cap: 'round',
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#6a10c5',
                  },
                  {
                    offset: 1,
                    color: '#cb0585',
                  },
                ],
                global: false,
              },

            },
          },
        ],
      },
    };
  },
  created() {
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    toFixedFloor,
    toFixedFloorPercent,
    formatRatio(num = 0) {
      if (num == 0) {
        return '/';
      }
      const pre = num > 0 ? '+' : '';
      return pre + toFixedFloor(num, 2) + '%';
    },
    formatIncome(num) {
      if (num === null || num === undefined) {
        return '/';
      }
      if (num == 0) {
        return '$0.00';
      }
      const pre = num > 0 ? '+' : '-';
      return pre + '$' + toFixedFloor(Math.abs(num), 2);
    },
    onResize() {
      if (this.singleChart) {
        this.singleChart.resize();
      }
    },
    updateChart() {
      if (!this.singleChart) {
        this.singleChart = echarts.init(document.getElementById('singleChart'));
      }

      this.singleChart.setOption(this.option);
      setTimeout(() =>{
        this.onResize();
      }, 10);
      this.$toast.clear();
    },
    handleDataRange(size) {
      console.log(size);
    },
    drawLine(list = []) {
      if (list.length <= 0) {
        this.updateChart();
        return;
      }

      let dateList = [], assetList = [];
      let max = Math.ceil(list[0].profit);
      let min = Math.floor(list[0].profit);
      for (let i = list.length - 1; i >= 0; i--) {
        const { date, profit } = list[i];
        dateList.push(date.slice(5));
        assetList.push(profit);
        this.totalIncome = profit;
        max = Math.max(max, profit);
        min = Math.min(min, profit);
      }
      const range = max - min;
      this.option.yAxis.min = Math.floor(min - range * 0.1);
      this.option.yAxis.max = Math.ceil(Math.max(max + range * 0.1, 5));
      this.option.xAxis.data = dateList;
      this.option.series[0].data = assetList;
      this.option.series[0].showSymbol = assetList.length <= 1;

      this.updateChart();
    }
  },
};
</script>
<style scoped>
.trend-wrapper {
  position: relative;
  background: #ffffff;
  border-radius: 30px;
}
.trend-wrapper .total-value {
  font-size: 24px;
  font-weight: 500;
  color: #3A486F;
}
.trend-wrapper .chart-box {
  height: 500px;
}
.trend-wrapper .chart-box .singleChart {
  height: 100%;
  width: 100%;
}
.trend-wrapper .logo {
  position: absolute;
  top: 60px;
  left: 80px;
  width: 210px;
  height: 35px;
  opacity: 0.15;
}
</style>
