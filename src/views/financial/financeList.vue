<template>
  <div class="asset-wrap">
    <TheHeader :title="$t('finance.title')" @click-left="handleBack" />
    <div class="asset-wrap-content">
      <div class="content-bg mobile"></div>
      <div class="content">
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
                <!-- {{ $t('swift.yearRatio') }} -->
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
            </div>
          </div>
        </section>

        <ShareSideBtn />
      </div>
    </div>
  </div>
</template>

<script>
import ShareSideBtn from '@/components/ShareSideBtn.vue';
import { toFixedFloor, toFixedFloorPercent } from '@/tool/utils';

export default {
  name: '',
  components: {
    ShareSideBtn,
  },
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
.help-wrap1{position: relative;}
.tip-panel {
    position: absolute;
    left: -16em;
    right: 0px;
    top: 0.8rem;
    width: 16em;
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
  padding-bottom: 200px;
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
  margin-left: auto;
  margin-right: auto;
  padding: 50px;
  border-radius: 40px;
}
.asset-wrap .content .panel {
  padding: 50px 40px;
  background-color: #fff;
  border-radius: 40px;
  text-align: left;
  cursor: pointer;
  min-height: 136px;
}

.panel .title-wrap {
  display: flex;
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

.copy-right-text {
  margin-top: 30px;
  margin-bottom: 40px;
  color: #adb0ca;
}

@media only screen and (max-width: 750px) {
  .asset-wrap .content {
    padding: 0 30px;
    margin-left: auto;
    margin-right: auto;
  }
}
@media only screen and (min-width: 751px) {
  .asset-wrap .content {
    width: 100%;
    max-width: 1000px;
    padding: 0;
    margin: 0 auto;
    margin-top: 52px;
    box-sizing: border-box;
  }
}
</style>
