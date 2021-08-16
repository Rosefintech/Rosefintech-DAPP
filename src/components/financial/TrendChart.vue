<template>
  <div class="trend-wrapper">
    <div class="legend-wrap">
      <div class="bar legend-item">
        <i class="icon icon-bar"></i>
        {{ $t('finance.btcPrice') }}
      </div>
      <div class="line legend-item">
        <i class="icon icon-line"></i>
        {{ lineLegendText }}
       <!-- Holding Value -->
      </div>
    </div>
    <img class="logo" src="../../assets/img/logo1.png" />
    <div class="chart-box">
      <div id="myCharts" class="myCharts"></div>
    </div>

    <TrendRatio :ratioData="ratioData" @change-size="handleDataRange" />
  </div>
</template>
<script>
import TrendRatio from './TrendRatio.vue';
import { toFixedFloor, toFixedFloorPercent, shortenNumber } from '@/tool/utils';
import * as echarts from 'echarts';
import mixinBTC from './mixinBTCPrice';









export default {
  name: '',
  mixins: [mixinBTC],
  components: {
    TrendRatio,
  },
  props: {
    proName: {
      type: String,
      default: 'falco',
    },
    ratioData: {
      type: Object,
      default: () => {},
    },




  },
  data() {
    return {

      type: 'usd',
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
          bottom: '3%',
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
          axisPointer: {
            lineStyle: {
              opacity: 0.3
            }
          },

          data: ['04-26'],
        },

        yAxis: [
          {
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
            position: 'left',
            axisLine: {

              lineStyle: {
                color: '#adb0ca',
              },
            },
          },
          {
            type: 'value',

            min: 1000,
            max: 90000,
            splitLine: {
              show: false,
            },
            position: 'right',
            offset: 1,
            show: true,
            axisLine: {
              show: false,
lineStyle: {
                color: '#adb0ca',
              },
            },
            axisLabel: {
              fontSize: 9,
              formatter: (value) => {

                return '$' + (value == 0 ? 0 : shortenNumber(value, 0));
              },
            },
            axisPointer: {
              label: {
                formatter: '${value}'
              }
            },
          },
        ],
        series: [
          {


            data: [0],

            type: 'line',
            smooth: true,
            showSymbol: false,

            lineStyle: {

              width: 3,
              cap: 'round',
              origin: 'start',
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#5421D5',
                  },
                  {
                    offset: 1,
                    color: '#5421D5',
                  },
                ],
                global: false,
              },
            },
            markPoint: {


              data: [{}],
            },
          },
          {

            data: [0],
            type: 'bar',
            barWidth: '50%',
            yAxisIndex: 1,



            itemStyle: {
              borderRadius: 2,
              opacity: 0.3,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#D9D0F7' },
                { offset: 1, color: '#D9D0F7' },
              ]),
            },
          },
        ],
      },
    };
  },
  computed: {
    lineLegendText() {
      let text = ''
      if (this.type === 'ratio') {
        text = this.$t('finance.curIncomeRatio');
      } else if (this.type === 'usd-fund') {
        text = this.$t('finance.curIncome');
      }
      else {
        if(this.$route.path==="/falco-mine"){
           text ='Falco Fund';
        }else{
           text = this.$t('finance.curValue');
           console.log(this.type)
        }

      }

      return text;



    },
  },
  created() {
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
    if (this.myChart) {
      this.myChart.dispose();
      this.myChart = null;
    }
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
    onResize() {
      if (this.myChart) {
        this.myChart.resize();
      }
    },
    async updateChart() {
      if (!this.myChart) {
        this.myChart = echarts.init(document.getElementById('myCharts'));
      }
      setTimeout(() => {

        this.myChart.setOption(this.option);
        this.onResize();
      }, 10);
      this.$toast.clear();
    },
    handleDataRange(size) {
      this.$emit('change-size', size);
    },
    async drawLine(list = [], type = 'usd') {
      if (list.length <= 0) {
        this.updateChart();
        return;
      }
      this.updateChart();
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
      });
      try {
        const btcList = await this.getBTCPrice(list.length);

        let dateList = [];
        let valueList = [];
        let priceList = [];
        let mkData = [];
        let max = Math.ceil(list[0].value);
        let min = Math.floor(list[0].value);
        let priceMax = btcList[0].price;
        let priceMin = btcList[0].price;

        for (let i = list.length - 1; i >= 0; i--) {
          const { date, value, build, withdraw } = list[i];
          const mDate = date.slice(5)
          dateList.push(mDate);
          valueList.push(value);
          const btc = btcList.find((b) => b.createDate == date);
          let btcPrice = 500;
          if (btc) {
            btcPrice = btc.price;
            priceList.push(btc.price);
          } else {
            priceList.push(btcPrice);
          }
          priceMax = Math.max(priceMax, btcPrice);
          priceMin = Math.min(priceMin, btcPrice);
          max = Math.max(max, value);
          min = Math.min(min, value);


          if (build || withdraw) {
            mkData.push({




              symbolSize: [1, 1],
              name: withdraw
                ? this.$t('finance.mkRedemp')
                : this.$t('finance.mkPosition'),
              coord: [mDate, value],
              value: value,
              itemStyle: {
                color: withdraw ? '#574bfa' : '#f90066',
              },
              label: {
                show: true,
                fontSize: 9,
                borderWidth: 2,
                borderColor: withdraw ? '#574bfa' : '#F90066',
                borderRadius: 2,
                backgroundColor: withdraw ? '#574bfa' : '#F90066',
                lineHeight: 13,
                offset: [0, -14],

                formatter: '{b}',
              },
            });
          }
        }


        this.option.xAxis.data = dateList;


        this.type = type;
        if (type == 'ratio') {
          this.option.yAxis[0].axisLabel.formatter = '{value}%';
          this.option.yAxis[0].axisPointer.label.formatter = '{value}%';
          this.option.yAxis[1].axisPointer.label.formatter = '${value}';
        }
        const range = max - min;
        this.option.yAxis[0].min = Math.floor(min - range * 0.1);
        this.option.yAxis[0].max = Math.ceil(max + range * 0.1);
        this.option.series[0].data = valueList;
        this.option.series[0].showSymbol = valueList.length <= 1;
        this.option.series[0].markPoint.data = mkData;


        const pMax = priceMax + (priceMax - priceMin) * 0.1;
        this.option.yAxis[1].min = Math.floor(priceMin / 1000) * 1000;
        this.option.yAxis[1].max = Math.ceil(pMax / 1000) * 1000;
        this.option.series[1].data = priceList;









        this.updateChart();
      } catch (error) {
        console.warn(error);
      }
    },
  },
};
</script>
<style scoped>
.trend-wrapper {
  position: relative;
  background: #ffffff;
  border-radius: 30px;
}
.trend-wrapper .legend-wrap {
  display: flex;
}
.trend-wrapper .legend-item {
  display: flex;
  align-items: center;
  font-size: 22px;
  font-weight: 400;
  color: #adb0ca;
  margin-right: 30px;
}
.trend-wrapper .legend-item .icon {
  width: 20px;
  height: 14px;
  margin-right: 12px;
}
.trend-wrapper .legend-item .icon-bar {
  /* background: linear-gradient(90deg, #5561ff56 0%, #8448ff56 100%); */
  background: #D9D0F7;
  border-radius: 3px;
}
.trend-wrapper .legend-item .icon-line {
  /* background: linear-gradient(90deg, #6511c9 0%, #800eb7 37%, #cb0585 100%); */
  background: #5421D5;
  border-radius: 3px;
}

.trend-wrapper .chart-box {
  height: 500px;
}
.trend-wrapper .chart-box .myCharts {
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
