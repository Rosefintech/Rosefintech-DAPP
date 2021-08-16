<template>
  <div class="asset-wrap">
    <TheHeader :title="$t('finance.redemption')" @click-left="handleBack" />
    <div class="asset-wrap-content">
      <div class="content-bg mobile"></div>
      <div class="content">
        <section class="panel panel-withdraw">
          <div class="title">
            {{ $t('finance.redeRatio') }}
          </div>
          <div class="value-wrap">
            <div class="ratio value">{{ slipValue }}%</div>
            <div class="usd-value" v-show="usdBalance > 0">
              ≈{{ toFixedFloor(usdValue) }}
              <span class="unit">USDC</span>
            </div>
          </div>
          <van-slider
            v-model="slipValue"
            @change="onChangeSlip"
            active-color="#f90066"
            :min="1"
            :max="100"
            :step="1"
          >
            <template #button>
              <div class="custom-button"></div>
            </template>
          </van-slider>
          <div class="input-options" @click="handleOption">
            <button
              class="option eth-25"
              data-opt="25"
              :class="{ active: slipValue == '25' }"
            >
              25%
            </button>
            <button
              class="option eth-50"
              data-opt="50"
              :class="{ active: slipValue == '50' }"
            >
              50%
            </button>
            <button
              class="option eth-75"
              data-opt="75"
              :class="{ active: slipValue == '75' }"
            >
              75%
            </button>
            <button
              class="option eth-all"
              data-opt="100"
              :class="{ active: slipValue == '100' }"
            >
              {{ $t('asset.all') }}
            </button>
          </div>
          <p class="comm-tip">
            {{ $t('finance.commissionTip1') }}
            <span class="red">10%</span>
            {{ $t('finance.commissionTip2') }}
          </p>
          <!-- <p class="comm-tip">
            {{ $t('finance.commissionTip3') }}
            <span class="red">$7.00</span>
            {{ $t('finance.commissionTip4') }}
          </p> -->
        </section>

        <section class="panel panel-target">
          <div class="ratio-group">
            <div
              class="ratio-item"
              :class="{ active: speed === 'normal' }"
              @click="speed = 'normal'"
            >
              <div class="tit">{{ $t('finance.normalTit') }}</div>
              <div class="desc">
                <p>{{ $t('finance.normalDesc') }}</p>
              </div>
            </div>
            <div
              class="ratio-item"
              :class="{ active: speed === 'fast' }"
              @click="speed = 'fast'"
            >
              <div class="tit">{{ $t('finance.fastTit') }}</div>
              <div class="desc">
                <p>{{ $t('finance.fastDesc') }}</p>
              </div>
            </div>
          </div>
          <div class="fee-wrap">
            <div class="fee">
              {{ $t('finance.redemptionFee') }}
              <span class="red">{{ feeText }} USDC</span>
              {{ $t('finance.redemptionFeeTip') }}</div>
          </div>
        </section>

        <!-- <div
          v-if="!isAuthSwift2Schedule"
          class="btn btn-dark btn-open"
          @click="handleAuthSwift2Schedule"
        >
          {{ $t('index.authorize') }}
        </div>
        <button
          v-else
          class="btn btn-sure btn-dark"
          :disabled="$store.state.asset.swiftBalance <= 0"
          @click="handleWithdraw"
        >
          {{ $t('index.confirm') }}
        </button> -->

<!-- {{isAuthSwift2Schedule}} {{$store.state.asset.swiftBalance }} -->

        <div class="buttonDiv" v-if="!isAuthSwift2Schedule"   :class="{ buttonDiv1: isAuthSwift2Schedule }">
          <button
            class="btn btnAuth btn-dark btn-sure"
            :disabled="isAuthSwift2Schedule"
            @click="handleAuthSwift2Schedule"
          >
            <p v-if="!isAuthSwift2Schedule">Allow Rosefintech to call your ROS</p>
            <p v-else>You can redeem now</p>
            <!-- {{ $t('index.authorize') }} -->
          </button>
          <span v-if="!isAuthSwift2Schedule"
            ><i
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
                {{ $t("message.valueTrendTip") }}
                <!-- {{ $t('kestrel.valueTrendTip') }} -->
              </div>
            </i></span
          >
        </div>
        <div class="buttonDiv buttonDiv1" v-if="redemption" >
          <button
            class="btn btnAuth btn-dark btn-sure"
            disabled="false"
          >

            <p>You can redeem now</p>
            <!-- {{ $t('index.authorize') }} -->
          </button>

        </div>

        <button
          class="btn btn-dark btn-sure"
          :disabled="$store.state.asset.swiftBalance <= 0 || !isAuthSwift2Schedule"
          @click="handleWithdraw"
        >
          {{ $t('index.confirm') }}
        </button>
        <p class="auth-tip tip" v-if="!isAuthSwift2Schedule">
          {{ $t('message.authTip') }}
        </p>

        <div class="footer">
          <p v-html="$t('finance.finanOperator')"></p>
        </div>
        <ShareSideBtn />
      </div>
    </div>
  </div>
</template>

<script>
import ShareSideBtn from '@/components/ShareSideBtn.vue';
import { toFixedFloor, Mul, Div } from '@/tool/utils';
import { swiftWithdraw, userAssets, swiftWithdrawFee, withdrawMsg, userRedemptionRecord } from '@/api/swift';

export default {
  name: '',
  components: {
    ShareSideBtn,
  },
  data() {
    return {
      redemption:false,
      showTrendTip:false,
      usdBalance: 0,
      slipValue: 50,
      speed: 'normal',
      inputFocus: false,
      fee: null,
      privateAvailabelETH: 0,
      dataLoading: true,
      timer: null,
      authIng: false,
      redeIng: false,
      msg: '',
    };
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
    usdValue() {
      return Div(Mul(this.usdBalance, +this.slipValue), 100);
    },
    isAuthSwift2Schedule() {
      return this.$store.state.ros.isAuthSwift2Schedule;
    },
    feeText() {
      return this.fee == null
        ? '-'
        : ((this.speed == 'normal' ? '1 ~ ' : '') + this.fee)
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  methods: {
    toFixedFloor,
    watchAddress() {
      this.reqAuth();

    },
    watchAuth() {
      this.reqAssets();
      this.reqWithdrawFee();
      this.checkPending(['SWIFT_2_SCHEDULE']);
    },
async tt1(){
     const params = {

        userAddress: this.$store.state.address,
        pageNo: 1,
        pageSize: 10,
      }
        const { success, data } = await userRedemptionRecord(params);
        if (success && data) {


          console.log(data.data)

        }
},
    async reqAssets() {
      this.dataLoading = true;
      const params = {
        userAddress: this.address,
      };
          this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: this.$t('message.loading'),
        });
      try {
        const { success, data } = await userAssets(params);

        if (success && data) {
          this.usdBalance = data;
          this.$toast.clear();
        }
      } catch (error) {
        console.warn(error);
        this.$store.dispatch('addError', {
          error,
          func: `/user/assets(${JSON.stringify(params)})`,
        });
      }
      this.dataLoading = false;
    },

    async reqWithdrawFee() {
      try {
        const { success, data } = await swiftWithdrawFee();
        if (success) {
          this.fee = data;
        }
      } catch (error) {
        console.warn(error);
        this.$store.dispatch('addError', {
          error,
          func: `/user/withdraw/fee()`,
        });
      }
    },

    onChangeSlip(value) {
      this.slipValue = Math.round(value);
    },

    handleOption(e) {
      const opt = e.target.dataset.opt;
      if (!opt || +opt == this.slipValue) return;
      this.slipValue = +opt;
    },

    handleBack() {

      this.MyGo(-1);
    },

    async reqAuth() {



      try {
        const scheduleAddress = await this.$store.dispatch(
          'ros/getScheduleAddress'
        );
        const swiftContract = await this.$store.dispatch(
          'asset/getTokenContract',
          'Swift'
        );
        const swiftWei = await this.$store.dispatch(
          'asset/getTokenBalance',
          'Swift'
        );
        const swiftBalance = new window.web3.utils.BN(swiftWei);
        const allowanceWei = await swiftContract.methods
          .allowance(this.address, scheduleAddress)
          .call();
        const allowance = new window.web3.utils.BN(allowanceWei);
        const isAuth = allowance.gt(swiftBalance);
        this.$store.commit('ros/SET_AUTH_SWIFT_2_SCHEDULE', isAuth);
      } catch (error) {
        console.log('', error);
        this.$store.dispatch('addError', {
          error,
          func: `reqAuthSwift2Schedule()`,
        });
      }
    },


    async handleAuthSwift2Schedule() {
      if (!this.address) {
        this.$toast.fail(this.$t('message.noAuth'));
        return;
      }

      if (this.authIng) return;
      this.authIng = true;

      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: this.$t('message.authorizing'),
      });
      let txHash;
      try {
        const scheduleAddress = await this.$store.dispatch(
          'ros/getScheduleAddress'
        );
        const swiftContract = await this.$store.dispatch(
          'asset/getTokenContract',
          'Swift'
        );
        await swiftContract.methods
          .approve(
            scheduleAddress,
            '500000000000000000000000'
          )
          .send({
            from: this.address,
          }).on('transactionHash', (hash) => {
            txHash = hash;
            this.startCheckState(hash, 'SWIFT_2_SCHEDULE');
          });

        this.removeByTxHash(txHash);
        this.onAuthOK('SWIFT_2_SCHEDULE');
      } catch (error) {
        this.removeByTxHash(txHash);
        this.onAuthFail(error, 'SWIFT_2_SCHEDULE');
      }
    },

    onAuthOK(type) {
      console.log('onAuthOK', type);
      if (type != 'SWIFT_2_SCHEDULE') return;

      this.clearStateTimer();

      this.authIng = false;
      this.$toast.clear();
      this.$toast.success(this.$t('message.authOk'));
      this.$store.commit('ros/SET_AUTH_SWIFT_2_SCHEDULE', true);
      this.redemption=true;
    },

    onAuthFail(error, type) {
      if (type != 'SWIFT_2_SCHEDULE') return;

      this.clearStateTimer();

      this.authIng = false;
      this.$toast.clear();
      if (error.code === 4001) {
        this.$toast.fail(this.$t('message.denied'));
        return;
      }

      this.$toast.fail(this.$t('message.authError'));
      this.$store.dispatch('addError', {
        error,
        func: `doAuthSwift2Schedule()`,
      });
    },

    async handleWithdraw() {
      if (this.redeIng) return;
      this.redeIng = true;

      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: this.$t('finance.applying'),
      });
      let params = null;
      try {
        const { data } = await this.reqWithdrawMsg();
        params = await this.getSRVByPersonal(data);
        this.sureWithdraw(params);
      } catch (error) {
        console.log(error);
        this.redeIng = false;
        this.$toast.clear();
        this.$toast.fail(this.$t('message.handleError'));
        this.$store.dispatch('addError', {
          error,
          func: `swiftWithdraw(${JSON.stringify(params)})`,
        });
      }
      this.redeIng = false;
    },

    reqWithdrawMsg() {
      const params = {
        userAddress: this.address,
      };
      return withdrawMsg(params);
    },

    async sureWithdraw(params) {
      params.scale = this.slipValue;
      params.userAddress = this.$store.state.address;
      params.speed = this.speed;
      const { success } = await swiftWithdraw(params);
      this.$toast.clear();
      if (success) {
        this.$toast.success(this.$t('finance.redemptionSend'));
        this.timer = setTimeout(() => {

          localStorage.setItem('sftminetab', 'rdlog');
          this.MyGo(-1);
        }, 1400);
      } else {
        this.$toast.fail(this.$t('finance.redemptionWaitTip'));
      }
    },
  },
};
</script>

<style scoped>
.buttonDiv {
  position: relative;
  display: flex;
  width: 587px;
  margin: 0 auto;
  align-items: center;
  border: 0.02667rem solid #330066;
  border-radius: 40px;
  background: #330066;
  margin-bottom: 30px;
}
.buttonDiv span {
  display: flex;
  width: 80px;
  font-size: 24px;
  justify-content: flex-start;
  color: #fff;
}
.buttonDiv1 {
  opacity: 0.4 !important;
}
.tip-panel {
    position: absolute;
    left: -567px;
    top: 0.8rem;
    width: 567px;
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
    box-shadow: 0 0.01333rem 0.04rem 0 rgba(158, 152, 153, 0.31);
    border-radius: 0.13333rem;
}
.tip-panel::before {
  content: "";
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  top: -24px;
  left: 560px;
  border: 12px solid transparent;
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
  padding: 50px;
  font-family: TsangerYunHei;
  border-radius: 40px;
}
.asset-wrap .content .panel {
  padding: 40px;
  background-color: #fff;
  border-radius: 40px;
  text-align: left;
}
.panel-withdraw .title {
  font-size: 30px;
  color: #adb0ca;
}
.panel-withdraw .value-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.panel-withdraw .value {
  font-size: 100px;

  color: #243657;
}
.panel-withdraw .usd-value {
  font-size: 42px;
}
.panel-withdraw .usd-value .unit {
  font-size: 24px;
}
.panel-withdraw .van-slider {
  margin-top: 50px;
  margin-bottom: 50px;
  height: 8px;
  width: 100%;
  margin: 30px auto 15px;
}
.panel-withdraw .custom-button {
  width: 50px;
  height: 50px;
  background-color: #f90066;
  border-radius: 100px;
  user-select: none;
}
.panel-withdraw .input-options {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
}
.panel-withdraw .input-options .option {
  height: 46px;
  line-height: 48px;
  padding: 0 20px;
  background: #fff;
  border: 1px solid #f5f6fd;
  border-radius: 23px;
  font-size: 24px;
  font-weight: 400;
  color: #091d42;
}
.panel-withdraw .input-options .option:disabled {
  color: #f5f6fd;
}
.panel-withdraw .input-options .active {
  border: 1px solid #330066;
}
.ratio-group {
  padding-left: 50px;
}
.ratio-group .ratio-item {
  position: relative;
  margin-bottom: 30px;
}
.ratio-group .ratio-item::before {
  content: '';
  display: block;
  position: absolute;
  left: -50px;
  top: 8px;
  width: 30px;
  height: 30px;
  background: #ffffff;
  border: 2px solid #574bfa;
  border-radius: 50%;
}
.ratio-group .ratio-item::after {
  content: '';
  display: none;
  position: absolute;
}
.ratio-group .ratio-item.active::before {
  background: #574bfa;
  border: 2px solid #574bfa;
}
.ratio-group .ratio-item.active::after {
  content: '';
  display: block;
  position: absolute;
  left: -42px;
  top: 14px;
  width: 16px;
  height: 10px;
  border-left: 5px solid #fff;
  border-bottom: 5px solid #fff;
  transform: rotate(-45deg);
}
.ratio-group .tit {
  font-size: 26px;
  font-weight: 400;
  color: #091d42;
  line-height: 48px;
}
.ratio-group .desc {
  font-size: 24px;
  font-weight: 400;
  color: #adb0ca;
  line-height: 30px;
}
.ratio-group .desc p {
  margin: 15px 0;
  text-align: justify;
}
.fee-wrap {
  margin-top: 30px;
  font-size: 22px;
}
.fee{text-align: justify;}
.panel-withdraw .add {
  width: 58px;
  height: 58px;
  background: #f5f6fd;
  border-radius: 15px;
  text-align: center;
  line-height: 58px;
  font-size: 58px;
  color: #adb0ca;
  margin: 50px auto;
}
.panel-withdraw .commission {
  font-size: 22px;
  font-weight: 400;
  color: #adb0ca;
  margin-top: 20px;
}
.panel-withdraw .comm-tip {
  font-size: 22px;
  font-weight: 400;
  color: #adb0ca;
  margin-top: 20px;
  text-align: justify;
}

.panel-target {
  margin-top: 30px;
  margin-bottom: 80px;
  color: #adb0ca;
}

.panel-target .opt-item {
  width: 166px;
  height: 68px;
  line-height: 68px;
  background: #ffffff;
  border: 2px solid #330066;
  border-radius: 34px;
  color: #330066;
  text-align: center;
  margin-top: 30px;
  margin-right: 50px;
}
.panel-target .opt-item.selected {
  background: #330066;
  color: #fff;
}

.panel-target-single {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.panel-target-single .opt-item {
  margin-top: 0;
}

.asset-wrap .btn-dark {
  width: 587px;
  margin: 20px auto;
}
.asset-wrap .buttonDiv .btn-dark{
   margin: 0px auto;
}
.asset-wrap .footer {
  margin-top: 100px;
  font-size: 22px;
  font-weight: 400;
  color: #adb0ca;
}
.auth-tip {
  font-size: 22px;
  font-weight: 400;
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
    padding: 0;
    width: 1000px;
    margin: 0 auto;
    margin-top: 52px;
  }
}
</style>
