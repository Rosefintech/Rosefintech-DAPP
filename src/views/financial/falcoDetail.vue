<template>
  <div class="asset-wrap">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <TheHeader :title="$t('kestrel.detailTit')" @click-left="handleBack" />
      <div class="asset-wrap-content" :class="{ high: isBottomHigh }">
        <div class="content-bg mobile"></div>
        <div class="content">
          <section class="panel panel-total">
            <div class="title">
              {{ $t('kestrel.title') }}
            </div>
            <div class="sub-title">
              {{ $t('kestrel.subTitle') }}
            </div>
            <div class="total-value">
              <div class="left">
                <div class="value">
                  17300%
                  <i
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
                      {{ $t('kestrel.simulateDesc') }}
                    </div>
                  </i>
                </div>
                <div class="tit" v-html="$t('swift.yearRatio2')">
                  {{ $t('swift.yearRatio') }}
                </div>
              </div>
              <div class="right">
                <div class="value">{{ openDate }}</div>
                <div class="tit" v-html="$t('kestrel.contractOpenDate')">
                  <!-- {{ $t('kestrel.contractOpenDate') }} -->
                </div>
              </div>
            </div>
          </section>

          <!-- <section class="panel panel-data">
            <div class="title">{{ $t('kestrel.simulateData') }}</div>
            <p class="desc" v-html="$t('kestrel.simulateDesc')"></p>
            <img class="img-view" :src="require(`../../assets/img/share-sealing-data.png`)" alt="">
          </section> -->
          <section class="panel panel-chart">
            <div class="title">
              {{ $t('kestrel.valueTrend') }}
              <i
                class="help-wrap"
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
                  {{ $t('kestrel.valueTrendTip') }}
                </div>
              </i>
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
              <div class="tit">{{ $t('kestrel.contractSize') }}</div>
              <!-- <div class="data">318 ETH</div> -->
              <div class="data">${{ toFixedFloor(fundSize, 2) }}</div>
            </div>
            <!-- <div class="tr">
              <div class="tit">{{ $t('kestrel.launchDate') }}</div>
              <div class="data">2021-03-17</div>
            </div> -->
            <div class="tr">
              <div class="tit">{{ $t('kestrel.openRange') }}</div>
              <div class="data">
                2021-03-17 {{ $t('kestrel.maturityDateMid') }} 2021-04-26
              </div>
            </div>
            <div class="tr">
              <div class="tit">{{ $t('kestrel.maturityDate') }}</div>
              <div class="data">2031-04-26</div>
            </div>
            <div class="tr">
              <div class="tit">{{ $t('kestrel.purchaseLimitation') }}</div>
              <div class="data">{{ $t('kestrel.purchaseLimitationDesc') }}</div>
            </div>
            <div class="tr">
              <div class="tit">{{ $t('kestrel.serviceCharge') }}</div>
              <div class="data">
                0.04 ETH
                <div class="com-tip">{{ $t('kestrel.chargeTip') }}</div>
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

          <ShareSideBtn />
        </div>
      </div>
    </van-pull-refresh>
    <!-- <div class="bottom-btns">
      <div class="btn btn-discussion" @click="handleForum">
        <img class="icon-forum" src="../../assets/img/icon-forum.png" alt="" />
        {{ $t('kestrel.discussion') }}
      </div>
      <div class="closed">{{ $t('kestrel.contractClosed') }}</div>
    </div> -->
    <FalcoFooter @bottom-high="handleBottom" />
  </div>
</template>

<script>
import ShareSideBtn from '@/components/ShareSideBtn.vue';
import TrendChart from '@/components/financial/TrendChart.vue';
import FalcoFooter from '@/components/financial/FalcoFooter.vue';
import { toFixedFloor, handleForum, formatDate } from '@/tool/utils';
import mixinFalco from './mixinFalco';

export default {
  name: '',
  mixins: [mixinFalco],
  components: {
    ShareSideBtn,
    TrendChart,
    FalcoFooter,
  },
  data() {
    return {
      showIncomeTip: false,
      showTrendTip: false,
      refreshing: false,
      isBottomHigh: false,
    };
  },
  computed: {
    openDate() {
      return formatDate(this.$store.state.falcoOpenTime)
    }
  },
  methods: {
    toFixedFloor,
    handleForum,
    watchAuth() {
      this.reqFundList();
    },
    formatRatio(num = 0) {
      if (num === null || num === undefined) {
        return '/';
      }
      const pre = num > 0 ? '+' : '';
      return pre + toFixedFloor(num, 2) + '%';
    },
    handleBack() {

      this.MyGo(-1);
    },

    onRefresh() {
      this.refreshing = false;
      this.reqUserFalco();
      this.reqFundList();
    },

    handleDataRange(size) {
      this.reqFundList(size);
    },

    handleBottom(hasBtns) {
      this.isBottomHigh = hasBtns;
    }
  },
};
</script>

<style scoped>

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

.panel-total .sub-title {
  position: relative;
  font-size: 28px;

  color: #3a486f;
}
.panel-total .total-value {
  display: flex;
  font-size: 40px;

  color: #f90066;
  margin: 40px auto 0;
}
.panel-total .total-value .tit {
  font-size: 24px;
  font-weight: 400;
  color: #adb0ca;
}
.panel-total .total-value .left {
  flex: 1;
}
.panel-total .total-value .left .value {
  line-height: 56px;
  font-size: 40px;

  color: #f90066;
  display: flex;
}
.panel-total .total-value .right {
  flex: 1;
  text-align: right;
}
.panel-total .total-value .right .value {
  font-size: 26px;
  height: 56px;
  line-height: 56px;

  color: #091d42;
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
  position: relative;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
}

.help-wrap {
  position: relative;
}

.help-icon {
  width: 32px;
  height: 32px;
  padding-left: 10px;
}

.panel-data {
  margin-top: 40px;
  margin-bottom: 40px;
}
.panel-data .desc {
  font-size: 26px;
  font-weight: 400;
  color: #adb0ca;
  margin-top: 20px;
}
.panel-data .img-view {
  max-width: 100%;
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
  font-family: TsangerYunHei;

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
  text-align: justify;
}

@media only screen and (max-width: 750px) {
  .asset-wrap .content {
    padding: 0 30px;
    margin-left: auto;
    margin-right: auto;
  }
  .asset-wrap .asset-wrap-content {
    padding-bottom: 100px;
  }
  .asset-wrap .asset-wrap-content.high {
    padding-bottom: 180px;
  }
  /* .bottom-btns {
    height: 60px;
    line-height: 60px;
  }
  .bottom-btns .btn-discussion {
    display: none;
  } */
}
@media only screen and (min-width: 751px) {
  .asset-wrap .content {
    padding: 0;
    width: 1000px;
    margin: 0 auto;
    margin-top: 52px;
  }
  /* .bottom-btns .btn-discussion {
    display: flex;
  } */
}
</style>
