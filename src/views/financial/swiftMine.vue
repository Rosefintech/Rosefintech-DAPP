<template>
  <div class="asset-wrap">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <TheHeader :title="$t('asset.assetDetail')" @click-left="handleBack" />
      <div class="asset-wrap-content">
        <div class="content-bg mobile"></div>
        <div class="content">
          <section class="panel panel-total">
            <div @click="$router.push('/swift-detail')">
            <div class="title">
              {{ $t('swift.title') }}
              <span class="title-tag">Beta</span>
            </div>
            <div class="sub-title">
              {{ $t('swift.subTitle') }}
              <!-- <router-link to="/swift-detail" class="to-detail">{{
                $t('kestrel.detail')
              }}</router-link> -->
            </div>
            </div>
            <div class="total-value">
              <div class="cur-total">
                <div class="tit" @click="reqUpdateUserSwift">
                  {{ $t('finance.totalValue') }}
                  <svg t="1622633282564" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http:
                </div>
                <div class="value">
                  ${{ toFixedFloor(userSwift.totalValue || 0) }}
                </div>
              </div>
              <div class="cur-reward" v-if="userSwift.rosNumber > 0">
                <span class="tit">
                  {{ $t('finance.notAward') }}
                </span>
                <span class="value">
                  {{ toFixedFloor(userSwift.rosNumber || 0) }} ROS
                </span>
              </div>
            </div>
            <div class="ratio-wrap">
              <div class="item">
                <div class="tit">{{ $t('finance.ystdIncome') }}</div>
                <div
                  class="data red"
                  :class="{ down: userSwift.yesterdayProfit < 0 }"
                >
                  {{ formatIncome(userSwift.yesterdayProfit) }}
                </div>
              </div>
              <div class="item">
                <div class="tit">{{ $t('finance.hisIncome') }}</div>
                <div
                  class="data red"
                  :class="{ down: userSwift.totalProfit < 0 }"
                >
                  {{ formatIncome(userSwift.totalProfit) }}
                </div>
              </div>
              <div class="item">
                <div class="tit" v-html="$t('finance.hisIncomeRatio')"> </div>
                <div
                  class="data red"
                  :class="{ down: userSwift.totalRate < 0 }"
                >
                  {{ formatRatio(userSwift.totalRate) }}
                </div>
              </div>
            </div>
          </section>

          <section class="panel panel-chart">
            <div class="tab-wrap">
              <div class="title tabs">
                <div
                  class="tab"
                  :class="{ active: tabName == 'profit' }"
                  @click="handleTabChange('profit')"
                >
                  {{ $t('finance.totalProfit') }}
                </div>
                <div
                  class="tab"
                  :class="{ active: tabName == 'chart' }"
                  @click="handleTabChange('chart')"
                >
                  {{ $t('kestrel.valueTrend') }}
                </div>
                <div
                  class="tab"
                  :class="{ active: tabName == 'log' }"
                  @click="handleTabChange('log')"
                >
                  {{ $t('finance.openLog') }}
                </div>
                <div
                  class="tab"
                  :class="{ active: tabName == 'rdlog' }"
                  @click="handleTabChange('rdlog')"
                >
                  {{ $t('finance.redeemLog') }}
                </div>
              </div>
            </div>
            <TrendChartSingle
              ref="chartProfit"
              :ratioData="ratioData"
              v-show="tabName == 'profit'"
            />
            <TrendChart
              ref="chart"
              :ratioData="ratioData"
              @change-size="handleDataRange"
              v-show="tabName == 'chart'"
            />
            <OpenLogs
              ref="logsPanel"
              :refreshing="refreshing"
              :totalValue="userSwift.totalValue"
              v-show="tabName == 'log'"
            />
            <RedemptionLogs
              ref="rdlogsPanel"
              :refreshing="refreshing"
              v-show="tabName == 'rdlog'"
            />
          </section>

          <ShareSideBtn />
        </div>
      </div>
    </van-pull-refresh>
    <div class="bottom-btns">
      <div class="btn btn-discussion" @click="handleForum">
        <img class="icon-forum" src="../../assets/img/icon-forum.png" alt="" />
        {{ $t('kestrel.discussion') }}
      </div>
      <div class="closed" v-if="isSealing">
        {{ $t('kestrel.contractClosed') }}
      </div>
      <template v-else>
        <button
          class="btn btn-light btn-redemption"
          :disabled="$store.state.asset.swiftBalance <= 0"
          @click="handleRedeem"
        >
          {{ $t('finance.redemption') }}
        </button>
        <div class="btn btn-dark" @click="$router.push('/auto-fund')">
          {{ $t('finance.addFund') }}
        </div>
      </template>
    </div>
    <DialogRedeem ref="dialogRedeem" @sure="handleGoRedeem" />
  </div>
</template>

<script>
import ShareSideBtn from '@/components/ShareSideBtn.vue';
import TrendChart from '@/components/financial/TrendChart.vue';
import TrendChartSingle from '@/components/financial/TrendChartSingle.vue';
import OpenLogs from '@/components/financial/OpenLogs.vue';
import RedemptionLogs from '@/components/financial/RedemptionLogs.vue';
import DialogRedeem from '@/components/financial/DialogRedeem.vue';
import { toFixedFloor, handleForum } from '@/tool/utils';
import { userProfitRatioRecord, userProfitRecord } from '@/api/swift';
import mixinSwift from './mixinSwift';

export default {
  name: '',
  mixins: [mixinSwift],
  components: {
    ShareSideBtn,
    TrendChart,
    TrendChartSingle,
    OpenLogs,
    RedemptionLogs,
    DialogRedeem,
  },
  data() {
    return {
      refreshing: false,
      openDate: '2031-03-16',
      tabName: 'profit',
      isSealing: false,
      assetlist: [],
      profitList: [],
    };
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
    isValid() {
      return new Date(this.$store.state.rewardDeadline).getTime() > Date.now();
    }
  },
  beforeDestroy() {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
  },
  methods: {
    toFixedFloor,
    handleForum,
    handleBack() {
      this.$router.isBack = true;
       localStorage.setItem('sftminetab','profit');
      this.$router.replace('/index');

    },
    watchAuth() {
      setTimeout(() => {
        this.onRefresh();
      }, 200);
    },
    onRefresh() {
      this.updateTab();

      if (this.tabName === 'log') {
        this.$refs.logsPanel.onRefresh();
      } else if (this.tabName === 'rdlog') {
        this.$refs.rdlogsPanel.onRefresh();
      } else if (this.tabName === 'chart') {
        this.onRefreshChartAsset();
      } else {
        this.onRefreshChartProfit();
      }

      this.reqUserSwift();

      this.refreshing = false;
    },
    onRefreshChartAsset() {
      this.reqProfitRatioRecord();
    },
    onRefreshChartProfit() {
      this.reqProfitList();
    },
    handleTabChange(tab) {
      this.tabName = tab;
      localStorage.setItem('sftminetab', tab);
      if (tab === 'log') {
        this.$refs.logsPanel.initData();
      } else if (tab === 'rdlog') {
        this.$refs.rdlogsPanel.initData();
      } else if (tab === 'chart') {
        this.initChartAsset();
      } else {
        this.initChartProfit();
      }
    },

    updateTab() {

       const tab = localStorage.getItem('sftminetab');

      const list = ['profit', 'chart', 'log', 'rdlog'];
      if (list.includes(tab)) {
        this.tabName = tab;
      } else {
        this.tabName = 'profit';
      }
    },
    initChartAsset() {
      if (this.assetlist.length <= 0) {
        this.reqProfitRatioRecord();
      }
    },
    initChartProfit() {
      if (this.profitList.length <= 0) {
        this.reqProfitList();
      }
    },
    formatRatio(num) {
      if (num === null || num === undefined) {
        return '/';
      }
      const pre = num > 0 ? '+' : '';
      return pre + toFixedFloor(num, 2) + '%';
    },
    formatIncome(num) {
      if (num === null || num === undefined) {
        return '/';
      }
      const pre = num > 0 ? '+' : num < 0 ? '-' : '';
      return pre + '$' + toFixedFloor(Math.abs(num), 2);
    },


    async reqProfitList(pageSize = 15) {
      const params = {
        userAddress: this.address,
        pageNo: 1,
        pageSize,
      };
      try {
        const { success, data } = await userProfitRecord(params);
        if (success && data) {
          this.profitList = data.data;
          setTimeout(() => {
            this.$refs.chartProfit.drawLine(this.profitList);
          }, 0);
        }
      } catch (error) {
        console.warn(error);
        this.$store.dispatch('addError', {
          error,
          func: `/user/profit/record(${JSON.stringify(params)})`,
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
        const { success, data } = await userProfitRatioRecord(params);
        if (success && data) {
          this.assetlist = data.data.map((d) => {
            d.value = d.profitRatio * 100;
            return d;
          });
          setTimeout(() => {
            this.$refs.chart.drawLine(this.assetlist, 'ratio');
          }, 0);
        } else {
          this.$toast.clear();
        }
      } catch (error) {
        console.warn(error);
        this.$toast.clear();
        this.$store.dispatch('addError', {
          error,
          func: `/user/profit/ratio/record(${JSON.stringify(params)})`,
        });
      }
    },

    handleRedeem() {

      if (this.isValid) {
        this.$refs.dialogRedeem.show();
      } else {
        this.$router.push('/redemption');
      }
    },

    handleGoRedeem() {
      this.$router.push('/redemption');
    },

    handleDataRange(size) {

      this.reqProfitRatioRecord(size);
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
  font-weight: 500;
  color: #3a486f;
}
.panel-total .to-detail {
  position: absolute;
  right: 0;
  color: #330066;
  cursor: pointer;
}
.panel-total .total-value {
  position: relative;
  text-align: center;
  font-size: 40px;
  font-weight: 500;
  color: #f90066;
  margin: 40px auto;
}
.panel-total .total-value::after {
  content: '';
  display: block;
  position: absolute;
  bottom: -23px;
  width: 100%;
  height: 1px;
  border-bottom: 1px solid #f5f6fd;
}
.panel-total .total-value .cur-reward {
  display: inline-block;
  padding: 4px 12px;
  font-size: 22px;
  background: #f5f6fd;
  border-radius: 25px;
  font-weight: 400;
  color: #a1a5c4;
}
.panel-total .total-value .tit {
  font-size: 28px;
  font-weight: 400;
  color: #adb0ca;
}
.panel-total .total-value .cur-total .tit {
  display: flex;
  justify-content: center;
  align-items: center;
}
.panel-total .total-value .icon {
  width: 24px;
  height: 24px;
  margin-left: 12px;
}
.panel-total .total-value .cur-reward .tit,
.panel-total .total-value .cur-reward .value {
  font-size: 24px;
  font-weight: 100;
}
.panel-total .ratio-wrap {
  display: flex;
  justify-content: space-between;
  font-size: 26px;

  color: #091d42;
  line-height: 36px;
  text-align: center;
}
.panel-total .ratio-wrap .tit {
  font-size: 24px;
  font-weight: 400;

    color: #adb0ca;
    width: 2rem;
    line-height: .4rem;
}
.panel-total .ratio-wrap .data {
  font-size: 26px;
  font-weight: 500;
}
.panel-chart {
  position: relative;
  padding: 50px 30px;
  background: #ffffff;
  border-radius: 30px;
  margin-top: 40px;
  margin-bottom: 30px;
}
.panel-chart .tab-wrap {
  margin-bottom: 40px;
  overflow-x: auto;
}
.panel-chart .tabs {
  display: flex;
  align-items: center;
  justify-content: space-around;
  /* min-width: 16em; */
}
.panel-chart .tab {
  line-height: 1.2;
  font-size: 30px;

  color: #adb0ca;
  cursor: pointer;
  /* white-space: nowrap; */
  padding-bottom: 16px;
  text-align: center;
}
.panel-chart .tab:not(:last-child) {
  margin-right: 20px;
}
.panel-chart .tab.active {
  font-size: 36px;

  color: #091d42;
  border-bottom: 6px solid #091d42;
}

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
  box-shadow: 0 0 8px 0px #ddd;
}
.bottom-btns .btn {
  width: 200px;
  margin: 0;
}
.bottom-btns .btn-redemption {
  margin-right: 30px;
}
.bottom-btns .btn-discussion {
  width: 250px;
  border: 2px solid #f5f6fd;
  color: #adb0ca;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
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
}

@media only screen and (max-width: 750px) {
  .asset-wrap .content {
    padding: 0 30px;
    margin-left: auto;
    margin-right: auto;
  }
  .bottom-btns .btn-redemption {
    margin-right: 56px;
  }
  .bottom-btns .btn {
    width: 260px;
  }
  .bottom-btns .btn-discussion {
    display: none;
  }
}
@media only screen and (min-width: 751px) {
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
::v-deep .van-list__error-text, ::v-deep .van-list__finished-text, ::v-deep .van-list__loading {
    color: #adb0ca !important;
   line-height: 50px;
    text-align: center;
    font-size: 24px;
     margin-top: 30px;
}
::v-deep .empty-wrap{
  margin-top: 90px;
  font-size: 24px;
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
