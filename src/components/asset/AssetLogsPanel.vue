<template>
  <div class="list-box">
    <div class="content-list">
      <div class="tab-head">
        <p
          :class="tab == 'enter' ? 'tab-text active' : 'tab-text'"
          @click="changeTab('enter')"
        >
          {{ $t('asset.receive') }}
        </p>
          <!-- v-if="tokenName != 'Swift'" -->
        <p
          :class="tab == 'out' ? 'tab-text active' : 'tab-text'"
          @click="changeTab('out')"
        >
          {{ $t('asset.send') }}
        </p>
        <p
          v-if="tokenName == 'ROS'"
          :class="tab == 'exchange' ? 'tab-text active' : 'tab-text'"
          @click="changeTab('exchange')"
        >
          {{ $t('asset.swap') }}
        </p>
        <p
          v-if="tokenName == 'ROS'"
          :class="tab == 'mining' ? 'tab-text active' : 'tab-text'"
          @click="changeTab('mining')"
        >
          {{ $t('asset.liquidityMining') }}
        </p>
      </div>
      <!-- <PanelAll
        ref="all"
        :v-model="refreshing"
        v-show="tab == 'all'"
      /> -->
      <PanelInto
        :tokenName="tokenName"
        :v-model="refreshing"
        v-show="tab == 'enter'"
        ref="enter"
      />
      <!-- v-if="tokenName != 'Swift'" -->
      <PanelOut
        :tokenName="tokenName"
        :v-model="refreshing"
        v-show="tab == 'out'"
        ref="out"
      />
      <PanelSwap
        v-if="tokenName == 'ROS'"
        :v-model="refreshing"
        v-show="tab == 'exchange'"
        ref="exchange"
      />
      <PanelMining
        v-if="tokenName == 'ROS'"
        :v-model="refreshing"
        v-show="tab == 'mining'"
        ref="mining"
      />
      <ShareSideBtn />
    </div>
  </div>
</template>
<script>
import ShareSideBtn from '@/components/ShareSideBtn.vue';

import PanelInto from './PanelInto.vue';
import PanelOut from './PanelOut.vue';
import PanelSwap from './PanelSwap.vue';
import PanelMining from './PanelMining.vue';

export default {
  components: {
    ShareSideBtn,

    PanelInto,
    PanelOut,
    PanelSwap,
    PanelMining,
  },
  props: {
    tokenName: {
      type: String,
      default: 'ROS',
    },
    refreshing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tab: 'enter',
      tabs: {
        'Falco': ['enter', 'out'],
        'rFalco': ['enter', 'out'],
        'Swift': ['enter', 'out'],
        'ROS': ['enter', 'out', 'exchange', 'mining'],
      }
    };
  },
  methods: {
    changeTab(act) {
      this.tab = act;
      localStorage.setItem('assettab', this.tab);
      this.$refs[this.tab].initData();
    },


    onRefresh() {
      this.updateTab();
      setTimeout(() => {
        console.log('onRefresh', this.tab);
        this.$refs[this.tab].onRefresh();
      }, 0);
    },

    updateTab() {
      const assetTab = localStorage.getItem('assettab');


      if (this.tabs[this.tokenName].includes(assetTab)) {
        this.tab = assetTab;
      } else {
        this.tab = 'enter';
      }
    }
  },
};
</script>
<style scoped>
.list-box {
  position: relative;
  padding: 0 30px;
  padding-bottom: 50px;
}
.list-box .content-list {
  position: relative;
  margin-top: -100px;
  background: #fff;
  border-radius: 40px;
  padding: 60px 30px;
  box-sizing: border-box;
}
.tab-head {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  cursor: pointer;
}
.tab-head .tab-text {
  /* margin-right: 20px; */
  font-size: 40px;
  color: #adb0ca;
  line-height: 50px;
  padding-bottom: 12px;
}
.tab-head .active {
  font-size: 40px;

  color: #091d42;
  border-bottom: 5px solid #091D42;
}
.list {
  display: flex;
  padding-top: 45px;
  padding-bottom: 35px;
  border-bottom: 1px solid #eeeff6;
}
.list:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.list .img-box {
  flex: 120;
  text-align: left;
}
.img-box .total-img {
  width: 70px;
  border-radius: 50%;
  background-color: #e0ccec;
  margin-top: 10px;
}
.list .addr-date {
  flex: 380;
  text-align: left;
}
.list .addr-date .address {
  font-size: 30px;
  font-family: TsangerYunHei;
  color: #3a486f;
}
.list .addr-date .date {
  font-size: 26px;
  font-family: TsangerYunHei;
  color: #adb0ca;
  margin-top: 20px;
}
.list .money-stu {
  flex: 160;
}
.money-stu .money {
  font-size: 30px;
  font-family: TsangerYunHei;
  color: #091d42;
}
.money-stu .out {
  color: #f90066;
}
.money-stu .state {
  font-size: 26px;
  font-family: TsangerYunHei;
  color: #adb0ca;
  margin-top: 20px;
}
.empty-wrap {
  padding-top: 60px;
  /*padding-bottom: 253px;*/
}
.img-empty {
  width: 381px;
  height: 237px;
}
@media only screen and (min-width: 751px) {
  .content-list {
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
  }
  .tab-head .tab-text {
    margin-right: 60px;
    font-size: 26px;
  }
  .tab-head .active {
    font-size: 32px;
    border-bottom: 5px solid #091D42;
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
</style>
