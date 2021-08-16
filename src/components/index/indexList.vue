<template>
    <div>
    <div class="asset-wrap-content">

        <section class="panel panel-falco" @click="$router.push('/falco-detail')">
          <div class="title-wrap">
            <div class="left">
              <div class="title">{{ $t('kestrel.title') }}</div>
              <div class="desc" v-html="$t('kestrel.subTitle2')"></div>
            </div>
            <div class="right">
              <span class="value">17300%</span>
              <div class="desc" v-html="$t('swift.yearRatio2')">
                {{ $t('swift.yearRatio') }}
              </div>
            </div>
          </div>
        </section>

        <section class="panel panel-rosefinch" @click="$router.push('/swift-detail')">
          <div class="title-wrap">
            <div class="left">
              <div class="title">
                {{ $t('swift.title') }}
                <span class="title-tag">Beta</span>
              </div>
              <div class="desc" v-html="$t('swift.subTitle2')"></div>
            </div>
            <div class="right">
              <span class="value">426.00%</span>
              <div class="desc">
                <span  v-html="$t('swift.yearRatio3')"></span>

              </div>
            </div>
          </div>
        </section>
    </div>
    </div>
</template>
<script>

import { toFixedFloor, toFixedFloorPercent } from '@/tool/utils';

export default {
  name: '',

  data() {
    return {
      hisIncomeRatioFalco: 17300,
      hisIncomeRatioSwift: 560,
    };
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
  },
  methods: {
    toFixedFloor,
    toFixedFloorPercent,
    formatRatio(num) {
      if (num == 0) {
        return '/';
      }  
      const pre = num > 0 ? '+' : '';
      return pre + toFixedFloor(num, 2) + '%';
    },
    handleBack() {
      this.$router.isBack = true;
      this.$router.replace('/index');
    },
  },
};
</script>
<style scoped>
 .asset-wrap-content {
  position: relative;
  padding:100px 20px 180px 20px;  
}
.panel .title-wrap {
  display: flex;
  background: #FAFAFC;
border-radius: 40px;
    padding: 40px;
}
.panel .title-wrap .left {
  flex: 1;
}
.panel .title-wrap .right {
  flex: 1;
  text-align: right;
}
.panel .title-wrap .desc {
  font-size: 26px;
  
  color: #adb0ca;
}
.panel .title-wrap .left .desc{
  text-align: left;
}
.panel .title-wrap .title {
  font-size: 40px;
  line-height: 60px;
   
  color: #091d42;
  display: flex;
  align-items: center;
}
.panel .title-wrap .value {
  font-size: 40px;
   
  color: #f90066;
  text-align: right;
}
.panel .btn {
  width: 587px;
  margin-top: 40px;
}
.panel-falco {
  margin-bottom: 40px;
}
.panel-rosefinch .title-tag {
  display: inline-block;
  width: 80px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #f90066;
  color: #fff;
  border-radius: 23px 20px 20px 0px;
  font-size: 24px;
  margin-left: 16px;
}
</style>