<template>
  <div class="asset-wrap">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <TheHeader :title="$t('kestrel.detailTit')" @click-left="handleBack" />
      <div class="asset-wrap-content">
        <div class="content-bg mobile"></div>
        <div class="content">
          <section class="panel panel-total">
            <div class="title">
              {{ $t('swift.title') }}
              <span class="title-tag">Beta</span>
            </div>
            <div class="sub-title">
              {{ $t('swift.subTitle') }}
            </div>
            <div class="total-value">
              <div class="left">
                <div class="value" :class="{ down: dayRate < 0 }">
                  {{ formatRatio(dayRate) }}
                </div>
                <div class="tit">
                  {{ $t('finance.dayUP') }}

                </div>
              </div>
              <div class="right">
                <div class="value">426.00%</div>
                <div class="tit" >
                    <span v-html="$t('swift.yearRatio3')"></span>
                                                                    <i
                class="help-wrap1"
                @mouseover.stop="showTrendTip = true"
                @mouseout.stop="showTrendTip = false"
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
                <div class="tip-panel" v-show="showTrendTip">
                  {{ $t('swift.valueTrendTip') }}
                </div>
              </i>
                </div>

              </div>
            </div>
          </section>

          <section class="panel panel-chart">
            <div class="title">
              {{ $t('kestrel.valueTrend') }}
            </div>
            <TrendChart
              ref="chart"
              :ratioData="ratioData"
              @change-size="handleDataRange"
            />
          </section>

          <section class="panel panel-info">
            <div class="title">{{ $t('kestrel.detailInfo') }}</div>
            <div class="tr">
              <div class="tit">{{ $t('swift.contractSize') }}</div>
              <div class="data">300 ETH</div>
            </div>
            <div class="tr">
              <div class="tit">{{ $t('kestrel.launchDate') }}</div>
              <div class="data">2021-06-25</div>
            </div>
            <div class="tr">
              <div class="tit">{{ $t('swift.viability') }}</div>
              <div class="data">{{ $t('swift.viabilityDesc') }}</div>
            </div>
            <div class="tr">
              <div class="tit">{{ $t('swift.chargeRatio') }}</div>
              <div class="data">
                1.5%
                <div class="com-tip">{{ $t('swift.chargeTip') }}</div>
              </div>
            </div>
            <div class="tr">
              <div class="tit">{{ $t('kestrel.serviceCommission') }}</div>
              <div class="data">
                <span class="red">{{ $t('kestrel.serviceCommissionDesc') }}</span>
                <div class="com-tip">
                  {{ $t('kestrel.serviceCommissionTip') }}
                </div>
              </div>
            </div>
          </section>

          <p class="risk-warning" v-html="$t('kestrel.riskWarningDesc')"></p>
          <!-- <p class="btnTitPc">Purchasable Swift Fund &lt; {{fundAvailableETH}} ETH</p> -->

          <ShareSideBtn />
        </div>
      </div>
    </van-pull-refresh>
    <div class="bottom-btns">
      <!-- <p class="btnTit">Purchasable Swift Fund &lt;  {{fundAvailableETH}} ETH</p> -->
      <div class="btn btn-discussion" @click="handleForum">
        <img class="icon-forum" src="../../assets/img/icon-forum.png" alt="" />
        {{ $t('kestrel.discussion') }}
      </div>
      <div v-if="isSealing" class="closed">
        {{ $t('kestrel.contractClosed') }}
      </div>
      <div
        v-else
        class="btn btn-dark btn-open"
        @click="$router.push('/auto-fund')"
      >
        {{ $t('finance.autoBank') }}
      </div>
    </div>
  </div>
</template>

<script>
import ShareSideBtn from '@/components/ShareSideBtn.vue';
import TrendChart from '@/components/financial/TrendChart.vue';
import { toFixedFloor, handleForum } from '@/tool/utils';
import { swiftDetail, fundProfitRatioRecord } from '@/api/swift';

export default {
  name: '',
  components: {
    ShareSideBtn,
    TrendChart,
  },
  data() {
    return {
      refreshing: false,
      dayRate: 34.234,
      hisRate: 234.2,
      rateYear: 1,
      openDate: '2031-03-16',
      erc20Contract: '',
      ratioData: {},
      list: [],
      isSealing: false,
      showTrendTip: false,
      showIncomeTip: false,
      fundAvailableETH:0,
      trend: {
        month3: 0.03,
        month6: 0.03,
        month12: 0.03,
        month36: 0.03,
        monthAll: 0.03,
      },
    };
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
  },

  methods: {
    toFixedFloor,
    handleForum,
    watchAuth() {
      console.log('watchToken');
      this.reqFundSwift();
      this.reqProfitRatioRecord();
      this.reqFundAvailable();
    },
    formatRatio(num) {
      if (num == 0) {
        return '/';
      }
      const pre = num > 0 ? '+' : '';
      return pre + toFixedFloor(num, 2) + '%';
    },
    handleBack() {

      localStorage.setItem('sftminetab', 'profit');
      this.MyGo(-1);
    },


    async reqFundAvailable() {
      try {
        const BN = this.$web3.utils.BN;

        const {
          _max,
          _total,
        } = await this.$agencyContract2nd.methods
          .getTotalMaxValueAndPositionValue()
          .call();
        const avaiWei = new BN(_max).sub(new BN(_total)).toString(10);
        this.fundAvailableETH = +this.$web3.utils.fromWei(avaiWei);
        this.fundAvailableETH=Math.ceil(this.fundAvailableETH/10)*10;
        console.log(this.fundAvailableETH)

      } catch (error) {
        console.warn(error);
        this.$store.dispatch('addError', {
          error,
          func: 'getTotalMaxValueAndPositionValue().call()',
        });
      }
    },



    onRefresh() {
      this.refreshing = false;

      this.reqFundSwift();
      this.reqProfitRatioRecord();
    },


    async reqFundSwift(pageSize = 15) {
      if (this.refreshing) {
        this.refreshing = false;
      }
      const params = {
        pageNo: 1,
        pageSize,
      };
      try {
        const { success, data } = await swiftDetail(params);
        if (success && data) {
          this.dayRate = data.dayRate * 100;
          this.hisRate = data.totalRate * 100;
          let obj = {};
          for (let key of Object.keys(data.trend)) {
            obj[key] = data.trend[key] * 100;
          }
          this.ratioData = obj;
        }
      } catch (error) {
        console.log(error);
        this.$store.dispatch('addError', {
          error,
          func: `/assets/total(${JSON.stringify(params)})`,
        });
      }
    },


    async reqProfitRatioRecord(pageSize = 15) {
      this.$toast.loading({
        duration: 0,
      });
      const params = {
        userAddress: this.address,
        pageNo: 1,
        pageSize,
      };
      try {
        const { success, data } = await fundProfitRatioRecord(params);
        if (success && data) {
          this.list = data.data.map((d) => ({
            date: d.date,
            value: d.profitRatio * 100,
          }));
          setTimeout(() => {
            this.$refs.chart.drawLine(this.list, 'ratio');
          }, 500);
        } else {
          this.$toast.clear();
        }
      } catch (error) {
        console.warn(error);
        this.$toast.clear();
        this.$store.dispatch('addError', {
          error,
          func: `/assets/profit/ratio/record(${JSON.stringify(params)})`,
        });
      }
    },

    handleDataRange(size) {
      this.reqProfitRatioRecord(size);
    }
  },
};
</script>

<style scoped>
.help-wrap1{position: relative;}
.tip-panel {
    position: absolute;
    left: -14em;
    right: 0px;
    top: 0.8rem;
    width: 14em;
    padding: 0.26667rem 0.26667rem;
    border-radius: 0.26667rem;
    color: #adb0ca;
    font-size: 0.26667rem;
    line-height: 1.5;
    font-weight: 400;
    font-style: normal;
    z-index: 10;
    text-align: left;
    background: #fff;
    box-shadow: 0 0.01333rem 0.04rem 0 rgb(158 152 153 / 31%);
    border-radius: 0.13333rem;
}
.tip-panel::before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    top: -0.32rem;
    left: auto;
    right: 10px;
    border: 0.16rem solid transparent;
    border-bottom-color: #9e98994f;
}
.asset-wrap .asset-wrap-content {
  position: relative;
  padding-bottom: 180px;
}
.asset-wrap .content-bg {
  position: relative;
  background-color: #330066;
  border-radius: 0 0 50px 50px;
  height: 150px;
}
.asset-wrap .content {
  position: relative;
  margin-top: -130px;
  padding: 50px;
  border-radius: 40px;
}
.asset-wrap .panel {
  padding: 50px 30px;
  background-color: #fff;
  border-radius: 40px;
  text-align: left;
}
.panel .title {
  font-size: 40px;

  color: #091d42;
  text-align: left;
}
.panel-total .title {
  display: flex;
  align-items: center;
}
.panel-total .title-tag {
  display: inline-block;
  width: 90px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #f90066;
  color: #fff;
  border-radius: 23px 20px 20px 0px;
  font-size: 24px;
  margin-left: 16px;
}
.panel-total .sub-title {
  position: relative;
  font-size: 28px;

  color: #3a486f;
}
.panel-total .total-value {
  display: flex;
  justify-content: space-between;
  font-size: 40px;
  font-weight: 500;
  color: #f90066;
  margin: 40px auto 0;
  text-align: center;
}
.panel-total .total-value .tit {
  font-size: 24px;
  font-weight: 400;
  color: #adb0ca;
  display: flex;
}
.panel-total .total-value .left {
  max-width: 50%;
}
.panel-total .total-value .right {
  text-align: right;
  max-width: 50%;
}
.panel-total .down {
  color: #55ad5c;
}

.panel-chart {
  position: relative;
  padding: 50px 30px;
  background: #ffffff;
  border-radius: 30px;
  margin-top: 40px;
  margin-bottom: 30px;
}
.panel-chart .title {
  margin-bottom: 40px;
  display: flex;
}

.asset-wrap .panel-info {
  padding-bottom: 40px;
}
.panel-info .title {
  margin-bottom: 20px;
}
.panel-info .tr {
  position: relative;
  display: flex;
  justify-content: space-between;
  font-size: 28px;

  color: #091d42;
  padding: 20px 0;
  border-bottom: 1px solid #f5f6fd;
}
.panel-info .tr:last-child {
  border: none;
}
.panel-info .tr .tit {
  font-size: 28px;
  font-weight: 400;
  color: #adb0ca;
  white-space: nowrap;
}
.panel-info .tr .data {
  text-align: right;
}
.panel-info .com-tip {
  margin-top: 6px;
  font-size: 24px;
  font-weight: 400;
  color: #adb0ca;
  text-align: right;
  line-height: 1.2;
}
.risk-warning {
  padding: 20px;
  font-size: 24px;
  font-weight: 400;
  color: #adb0ca;
  line-height: 36px;
  text-align:justify;
}

.bottom-btns {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 140px;
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 8px 0px #ddd;
}

.bottom-btns .btn {
  width: 260px;
  margin: 0;
}
.bottom-btns .btn-light {
  margin: 0 20px;
}
.bottom-btns .btn-discussion {
  width: 250px;
  border: 2px solid #f5f6fd;
  color: #adb0ca;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 60px;
}
.bottom-btns .icon-forum {
  width: 40px;
  height: 40px;
  margin-right: 12px;
}
.bottom-btns .closed {
  font-size: 26px;
  font-weight: 400;
  color: #adb0ca;
  margin-left: 30px;
}

@media only screen and (max-width: 750px) {
  .btnTitPc{display:none;}
  .btnTit{
      color: #adb0ca;
}
  .asset-wrap .content {
    padding: 0 30px;
    margin-left: auto;
    margin-right: auto;
  }
  .bottom-btns .btn-open {
    width: 460px;
    margin: 0;
  }
  .bottom-btns .btn-discussion {
    display: none;
  }
}
@media only screen and (min-width: 751px) {
  .btnTitPc{display:block;color: #adb0ca;text-align:left; font-size:24px;padding:24px;}
  .btnTit{
      color: #adb0ca;
      display:none;
}
  .asset-wrap .content {
    padding: 0;
    width: 1000px;
    margin: 0 auto;
    margin-top: 52px;
  }
  .bottom-btns .btn-discussion {
    display: flex;
  }
}
</style>
