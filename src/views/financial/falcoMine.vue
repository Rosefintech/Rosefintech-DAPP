<template>
  <div class="asset-wrap">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <TheHeader :title="$t('asset.assetDetail')" @click-left="handleBack" />
      <div class="asset-wrap-content">
        <div class="content-bg mobile"></div>
        <div class="content">
          <section class="panel panel-total">
            <div  @click="$router.push('/falco-detail')">
            <div class="title">
              {{ $t('kestrel.title') }}
            </div>
            <div class="sub-title">
              <span>{{ $t('kestrel.subTitle') }}</span>
              <!-- <router-link to="/falco-detail" class="to-detail">{{
                $t('kestrel.detail')
              }}</router-link> -->
            </div>
            </div>
            <div class="total-value">
              <div class="tit">
                {{ $t('kestrel.value') }}
              </div>
              <div class="value">
               $ {{ toFixedFloor(userFalco.nowPrice || 0) }}
              </div>
            </div>
            <div class="ratio-wrap">
              <div class="item">
                <div class="tit" v-html=" $t('kestrel.income')">
                  <!-- {{ $t('kestrel.income') }} -->
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
                      {{ $t('kestrel.curValueTip') }}
                    </div>
                  </i>
                </div>
                <div
                  class="data red"
                  :class="{ down: userFalco.totalProfit < 0 }"
                >
                  {{ formatIncome(userFalco.totalProfit || 0) }}
                </div>
              </div>
              <div class="item">
                <div class="tit" v-html="$t('kestrel.incomeRatio')"></div>
                <div
                  class="data red"
                  :class="{ down: userFalco.totalRate < 0 }"
                >
                  {{ formatRatio(userFalco.totalRate || 0) }}
                </div>
              </div>
              <div class="item">
                <div class="tit" v-html="$t('kestrel.contractOpenDate')"></div>
                <div class="data">{{ openDate }}</div>
              </div>
            </div>
          </section>

          <section class="panel panel-chart">
            <div class="title">
              {{ $t('kestrel.valueTrend') }}
              <!-- <i
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
              </i> -->
            </div>
            <TrendChart
              ref="chart"
              :ratioData="ratioData"
              @change-size="handleDataRange"
            />
          </section>

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
    <FalcoFooter />
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
      refreshing: false,
      showIncomeTip: false,
      showTrendTip: false,
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
      this.reqUserFalco();
      this.reqUserList();
    },


    formatRatio(num = 0) {
      if (num === null || num === undefined) {
        return '/';
      }
      const pre = num > 0 ? '+' : '';
      return pre + toFixedFloor(num, 2) + '%';
    },
    handleBack() {
      this.$router.isBack = true;
      this.$router.replace('/index');
    },

    onRefresh() {
      this.refreshing = false;
      this.reqUserFalco();
      this.reqUserList();
    },

    formatIncome(num) {
      if (num === null || num === undefined) {
        return '/';
      }
      const pre = num > 0 ? '+' : num < 0 ? '-' : '';
      return pre + '$' + toFixedFloor(Math.abs(num), 2);
    },

    handleDataRange(size) {
      this.reqUserList(size);
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
.asset-wrap .content .panel {
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
  display: flex;
  justify-content: space-between;
}
.panel-total .to-detail {
  /* position: absolute;
  right: 0; */
  color: #330066;
  cursor: pointer;
  padding-left: 20px;
}
.panel-total .total-value {
  text-align: center;
  font-size: 40px;

  color: #f90066;
  margin: 40px auto;
}
.panel-total .total-value .tit {
  font-size: 24px;
  font-weight: 400;
  color: #adb0ca;
}
.panel-total .ratio-wrap {
  display: flex;
  justify-content: space-between;
  font-size: 26px;

  color: #091d42;
  line-height: 36px;
  text-align: center;
}
.panel-total .ratio-wrap .item {
  position: relative;
}
.panel-total .ratio-wrap .tit {
  font-size: 24px;
  font-weight: 400;
  color: #adb0ca;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
}
.help-wrap {
  position: relative;
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
.help-icon {
  width: 32px;
  height: 32px;
  padding-left: 10px;
}
/*
.bottom-btns {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 141px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px 4px #ddd;
}
.bottom-btns .btn-discussion {
  width: 250px;
  border: 2px solid #f5f6fd;
  color: #adb0ca;
  margin: 0 30px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
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
} */

@media only screen and (max-width: 750px) {
  .asset-wrap .content {
    padding: 0 30px;
    margin-left: auto;
    margin-right: auto;
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
@media only screen and (max-width: 320px) {
.panel-total .ratio-wrap .tit {
  font-size: 24px;
  font-weight: 400;

    color: #adb0ca;
    width: 2.5rem;
    line-height: .4rem;
}
}
</style>
