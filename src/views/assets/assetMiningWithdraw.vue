<template>
  <div class="asset-wrap">
    <!-- <van-nav-bar
      :title="$t('asset.recallAssets')"
      left-text=""
      left-arrow
      :border="false"
      @click-left="handleBack"
    /> -->
    <TheHeader :title="$t('asset.recallAssets')" @click-left="handleBack" />
    <div class="asset-wrap-content">
      <div class="content-bg mobile"></div>
      <div class="content">
        <section class="panel panel-slide">
          <div class="title">
            {{ $t('asset.recallRatio') }}
          </div>
          <div class="value">{{ slipValue }}%</div>
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
            <div
              class="option opt-25"
              data-opt="25"
              :class="{ active: actClass == '25' }"
            >
              25%
            </div>
            <div
              class="option opt-50"
              data-opt="50"
              :class="{ active: actClass == '50' }"
            >
              50%
            </div>
            <div
              class="option opt-75"
              data-opt="75"
              :class="{ active: actClass == '75' }"
            >
              75%
            </div>
            <div
              class="option opt-all"
              data-opt="100"
              :class="{ active: actClass == '100' }"
            >
              {{ $t('asset.all') }}
            </div>
          </div>
        </section>

        <section class="panel panel-data">
          <div class="title">{{ $t('asset.recallDetail') }}</div>
          <div class="ros value-wrap">
            <span>{{ toFixedFloor(amountTokenMin, 4) }}</span>
            <div class="tit-wrap">
              <img
                class="icon"
                src="../../assets/img/index/icon-ros.png"
                alt=""
              />
              ROS
            </div>
          </div>
          <div class="eth value-wrap">
            <span>{{ toFixedFloor(amountETHMin, 6) }}</span>
            <div class="tit-wrap">
              <img
                class="icon"
                src="../../assets/img/index/icon-eth.png"
                alt=""
              />
              ETH
            </div>
          </div>
          <div class="ratio-wrap" v-if="+liquidityBalance">
            <div class="ros-eth">
              <span class="tit">{{ $t('asset.price') }}</span>
              <span>1 ROS = {{ toFixedFloor(rosToEthRate, 6) }} ETH</span>
            </div>
            <div class="eth-ros">
              1 ETH = {{ toFixedFloor(ethToRosRate) }} ROS
            </div>
          </div>
        </section>

        <section class="panel panel-deadline">
          <div class="title">
            {{ $t('asset.slidSet') }}
          </div>
          <van-slider
            v-model="slippageValue"
            @change="handleSlipChange"
            active-color="#f90066"
            :min="0"
            :max="3"
            :step="0.1"
          >
            <template #button>
              <div class="custom-button">
                {{ toFixedFloor(slippageValue, 1) + '%' }}
              </div>
            </template>
          </van-slider>
          <div class="range">
            <span class="min">0</span>
            <span class="min">3%</span>
          </div>
          <div class="deadline-wrap">
            <div class="title">{{ $t('asset.transactionDeadline') }}</div>
            <div class="time">
              <input
                v-model="deadline"
                type="number"
                class="input-num input-time"
              />&nbsp;<span class="light-gray">{{ $t('asset.minutes') }}</span>
            </div>
          </div>
        </section>
        <!-- <p class="auth-tip tip" v-if="!isAuthUni2Liquidity">
          {{ $t('message.authTip') }}
        </p> -->
        <!-- <div
          v-if="!isAuthUni2Liquidity"
          class="btn btn-dark btn-open"
          @click="handleAuth"
        >
          {{ $t('index.authorize') }}
        </div>
        <button
          v-else
          class="btn btn-sure btn-dark"
          :disabled="+liquidityBalance <= 0"
          @click="handleSureWithdraw"
        >
          {{ $t('index.confirm') }}
        </button> -->
 <!-- {{isAuthUni2Liquidity}} -->
        <div class="buttonDiv" v-if="!isAuthUni2Liquidity" :class="{ buttonDiv1: isAuthUni2Liquidity }">
          <button
            class="btn btnAuth btn-dark btn-sure"
            :disabled="isAuthUni2Liquidity"
            @click="handleAuth"
          >
            <p v-if="!isAuthUni2Liquidity">Allow Rosefintech to call your ROS</p>
            <p v-else>You can redeem now</p>
            <!-- {{ $t('index.authorize') }} -->
          </button>
          <span v-if="!isAuthUni2Liquidity"
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

        <div class="buttonDiv buttonDiv1"  v-if="assetfluidLogs"  >
          <button
            class="btn btnAuth btn-dark btn-sure"
            disabled="true"

          >

            <p  >You can redeem now</p>
            <!-- {{ $t('index.authorize') }} -->
          </button>

        </div>
         <!-- :disabled="+liquidityBalance <= 0 " -->
        <button

          class="btn btn-dark btn-sure"
          :disabled="+liquidityBalance <= 0 || !isAuthUni2Liquidity"
          @click="handleSureWithdraw"
        >
          {{ $t('index.confirm') }}
        </button>

        <p class="auth-tip tip" v-if="!isAuthUni2Liquidity">
          {{ $t('message.authTip') }}
        </p>

        <ShareSideBtn />
      </div>
    </div>
  </div>
</template>

<script>
import ShareSideBtn from '@/components/ShareSideBtn.vue';
import { addLog } from '@/api/asset';
import { fluidLogs } from "@/api/asset";
import { toFixedFloor, toFixedFloorPercent } from '@/tool/utils';

export default {
  name: '',
  components: {
    ShareSideBtn,
  },
  data() {
    return {
      assetfluidLogs:false,
      showTrendTip:false,
      amountTokenMin: 0,
      amountETHMin: 0,
      actClass: '25',
      slipValue: 25,
      rosToEthRate: 5000,
      ethToRosRate: 0.00005,
      erc20Contract: '',
      liquidityBalance: null,
      slippageValue: 0.1,
      deadline: 20,
      liquWei: '0',

      liquidityAddress: '',
      authIng: false,
      withdrawIng: false,
    };
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
    isAuthUni2Liquidity() {
      return this.$store.state.ros.isAuthUni2Liquidity;
    },
  },
  methods: {
    toFixedFloor,
    toFixedFloorPercent,
    watchAddress() {
      this.reqLiquidityBalance();

    },
    async tt1() {
      const params = {
        address: this.$store.state.address,
        pageNo: 1,
        pageSize: 10,
      };
      console.log(params)

   fluidLogs(params).then(res=>{
      console.log(res.data.data)
      res.data.data.forEach(element => {
        console.log(element.type)
        if(element.type===2){

          return
        }
      });
     console.log(res.data.data)

     console.log(this.assetfluidLogs)
     console.log(this.$store.state.address)
   })

    },

    reqLiquidityBalance() {
      this.$agencyContract2nd.methods
        .getLiquidityProofAmount(this.$store.state.address)
        .call()
        .then(({ _balance }) => {
          console.log(_balance);
          this.liquidityBalance = _balance;


          this.onChangeSlip(this.slipValue);
        })
        .catch((err) => {
          console.warn(err);
        });
    },


    async handleAuth() {
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
      let txHash = '';
      try {
        const liquidityAddress = await this.$store.dispatch(
          'ros/getLiquidityAddress'
        );
        const uniContract = await this.$store.dispatch('ros/getUniContract');
        await uniContract.methods
          .approve(
            liquidityAddress,
            '500000000000000000000000'
          )
          .send({
            from: this.address,
          }).on('transactionHash', (hash) => {
            txHash = hash;
            this.startCheckState(hash, 'UNI_2_LIQUIDITY');
          });

        this.removeByTxHash(txHash);
        this.onAuthOK('UNI_2_LIQUIDITY');
      } catch (error) {
        console.log(error);
        this.removeByTxHash(txHash);
        this.onAuthFail(error, 'UNI_2_LIQUIDITY');
      }
    },

    onAuthOK(type) {
      if (type != 'UNI_2_LIQUIDITY') return;

      this.clearStateTimer();

      this.$store.commit('ros/SET_AUTH_UNI_2_LIQUIDITY', true);
      this.authIng = false;
      this.$toast.clear();
      this.$toast.fail(this.$t('message.authOk'));
      this.assetfluidLogs=true;
      setTimeout(() => {
        this.onChangeSlip(this.slipValue);
      }, 1200);
    },

    onAuthFail(error, type) {
      if (type != 'UNI_2_LIQUIDITY') return;

      this.clearStateTimer();

      this.authIng = false;
      this.$toast.clear();
      if (error.code === 4001) {
        this.$toast.fail(this.$t('message.denied'));
        return;
      }

      this.$toast.fail(this.$t('message.authError'));
      const params = `${this.$store.state.ros.liquidityAddress},${'500000000000000000000000'}`;
      this.$store.dispatch('addError', {
        error,
        func: `uniContract.methods.approve(${params}).call()`,
      });
    },

    reqLiquidityETHDATA() {
      this.$toast.loading({
        duration: 0,
      });
      const { fromWei } = this.$web3.utils;
      console.log(this.liquWei, Math.round(this.slippageValue * 10));
      this.$agencyContract2nd.methods
        .getRemoveLiquidityETHData(
          this.$store.state.address,
          this.liquWei,
          Math.round(this.slippageValue * 10)
        )
        .call()
        .then((res) => {

          this.$toast.clear();
          this.amountTokenMin = +fromWei(res.amountTokenMin, 'ether');
          this.amountETHMin = +fromWei(res.amountETHMin, 'ether');
          this.rosToEthRate = this.amountETHMin / (this.amountTokenMin || 1);
          this.ethToRosRate = this.amountTokenMin / (this.amountETHMin || 1);

          this.checkPending(['UNI_2_LIQUIDITY', 'removeLiquidity'])
        })
        .catch((error) => {
          console.warn(error);
          this.$toast.clear();
          const params = `${this.$store.state.address},${
            this.liquWei
          },${Math.round(this.slippageValue * 10)}`;
          this.$store.dispatch('addError', {
            error,
            func: `getRemoveLiquidityETHData(${params}).call()`,
          });
        });
    },

    onChangeSlip(value) {
      const { fromWei, toWei } = window.web3.utils;
      this.actClass = value;
      if (value == 100) {
        this.liquWei = this.liquidityBalance;
      } else {
        let liquNum = (+fromWei(this.liquidityBalance) * value) / 100;
        this.liquWei = toWei(String(liquNum));
      }
      this.reqLiquidityETHDATA(this.liquWei);
    },
    handleSlipChange() {
      this.reqLiquidityETHDATA(this.liquWei);
    },
    handleOption(e) {
      const opt = e.target.dataset.opt;
      if (opt) {
        this.actClass = opt;
        this.slipValue = +opt;
        this.onChangeSlip(+opt);
      }
    },

    handleBack() {

      this.MyGo(-1);
    },

    handleSureWithdraw() {
      if (!this.address) {
        this.$toast.fail(this.$t('message.noAuth'));
        return;
      }
      if (this.withdrawIng) return;
      this.withdrawIng = true;

      this.$toast.loading({
        duration: 0,
        message: this.$t('message.handling'),
      });
      const { toWei } = this.$web3.utils;
      const ddline = Math.round(Date.now() / 1000 + this.deadline * 60);
      console.log(
        this.liquWei,
        toWei(String(this.amountTokenMin)),
        toWei(String(this.amountETHMin)),
        ddline
      );
      let txHash = '';
      this.$agencyContract2nd.methods
        .removeUniswapLiquidityETH(
          this.liquWei,
          toWei(String(this.amountTokenMin)),
          toWei(String(this.amountETHMin)),
          String(ddline)
        )
        .send({
          from: this.$store.state.address,
        })
        .on('transactionHash', (hash) => {
          txHash = hash;
          this.addSwapLog(hash);
          this.startCheckState(hash, 'removeLiquidity');
        })
        .on('receipt', (receipt) => {
          this.removeByTxHash(txHash);
          this.onSendOK(receipt, 'removeLiquidity');
        })
        .on('error', (error) => {
          this.removeByTxHash(txHash);
          this.onSendFail(error, 'removeLiquidity');
        });
    },

    onSendFail(error, type) {
      if (type != 'removeLiquidity') return;

      this.clearStateTimer();
      this.withdrawIng = false;
      this.$toast.clear();
      if (error.code === 4001) {
        this.$toast.fail(this.$t('message.denied'));
        return;
      }

      this.$toast.fail(this.$t('message.handleError'));
      const ddline = Math.round(Date.now() / 1000 + this.deadline * 60);
      const params = `${this.liquidityBalance},${this.amountTokenMin},${this.amountETHMin},${ddline}`;
      this.$store.dispatch('addError', {
        error,
        func: `removeUniswapLiquidityETH(${params}).send()`,
      });
    },

    onSendOK(receipt, type) {
      if (type != 'removeLiquidity') return;
      this.clearStateTimer();
      this.onWithdrawOK();
    },

    onWithdrawOK() {
      this.withdrawIng = false;
      this.$toast.clear();
      this.$toast.success(this.$t('message.handleOK'));
      setTimeout(() => {

        this.$store.dispatch('asset/initAsset');

        localStorage.setItem('assettab', 'mining');
        this.$router.push('/asset?name=ROS');
      }, 1000);
    },

    async addSwapLog(hash) {
      const params = {
        type: 2,
        judge: 2,
        address: this.address,
        slippage: this.slippageValue,
        deal_hash: hash,
        ros_amount: this.amountTokenMin,
        eth_amount: this.amountETHMin,
      };
      try {
        const { success, msg } = await addLog(params);
        if (success) {
          console.log('add withdraw log ok');
        } else {
          this.$toast.fail(msg);
        }
      } catch (error) {
        console.warn(error);
        this.$store.dispatch('addError', {
          error,
          func: `addLog(${JSON.stringify(params)})`,
        });
      }
    },
  },
};
</script>

<style scoped>
.buttonDiv{position: relative; display:flex; width: 587px;margin: 0 auto;align-items: center;border: 0.02667rem solid #330066;border-radius: 40px;
background: #330066;margin-bottom: 30px;}
.buttonDiv span{
  display: flex;
width: 80px;font-size: 24px;
justify-content: flex-start;
color: #fff;
}
.buttonDiv1{
  opacity: 0.4 !important;
}
.buttonDiv .btn-dark {
  margin: 0 auto;
}
.tip-panel {
    position: absolute;
    left: -537px;
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
  content: '';
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
  padding: 50px;
  background-color: #fff;
  border-radius: 40px;
  text-align: left;
}

.panel-slide {
  font-size: 30px;
  font-weight: 600;
  color: #091d42;
}
.panel-slide .value {
  font-size: 100px;
  font-weight: 500;
  color: #243657;
  margin: 30px 0 0;
}
.panel-slide .van-slider {
  margin-top: 50px;
  margin-bottom: 50px;
  height: 8px;
  width: 90%;
  margin: 30px auto 15px;
}
.panel-slide .custom-button {
  width: 50px;
  height: 50px;
  background-color: #f90066;
  border-radius: 100px;
  user-select: none;
}
.panel-slide .input-options {
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
}
.panel-slide .input-options .option {
  height: 46px;
  line-height: 48px;
  padding: 0 20px;
  border: 1px solid #f5f6fd;
  border-radius: 23px;
  font-size: 24px;
  font-weight: 400;
  color: #091d42;
}
.panel-slide .input-options .active {
  border: 1px solid #330066;
  color: #330066;
  font-weight: 500;
}

.panel-data {
  margin-top: 40px;
}
.panel-data .trans-img {
  width: 44px;
  height: 44px;
}
.panel-data .icon {
  width: 50px;
  height: 50px;
  margin-right: 5px;
}
.panel-data .value-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  font-size: 30px;
  font-weight: 400;
  color: #091d42;
}
.panel-data .icon {
  width: 36px;
  height: 36px;
}
.panel-data .tit-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.panel-data .ratio-wrap {
  font-size: 26px;
  font-weight: 400;
  color: #adb0ca;
  text-align: right;
  line-height: 2;
  margin-top: 30px;
}
.panel-data .ros-eth {
  display: flex;
  justify-content: space-between;
}

.panel-deadline {
  margin-top: 40px;
  margin-bottom: 80px;
  padding: 40px;
}
.panel-data .title,
.panel-deadline .title {
  font-size: 30px;
  font-weight: 400;
  color: #091d42;
}
.panel-deadline .van-slider {
  margin-top: 30px;
  margin-bottom: 15px;
  height: 8px;
  width: 90%;
  margin: 50px auto 30px;
}
.panel-deadline .custom-button {
  width: 80px;
  color: #fff;
  font-size: 24px;
  line-height: 50px;
  text-align: center;
  background-color: #f90066;
  border-radius: 100px;
  user-select: none;
}
.panel-deadline .range {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  color: #adb0ca;
  font-size: 22px;
}
.panel-deadline .deadline-wrap {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.panel-deadline .deadline-wrap .title {
  font-size: 26px;
}
.panel-deadline .input-time {
  width: 3em;
  text-align: center;
  background: #ffffff;
  border: 1px solid #f5f6fd;
  border-radius: 10px;
}

.btn-dark {
  width: 588px;
  margin: 20px auto;
}
.auth-tip {
  font-size: 22px;
  font-weight: 400;
  color: #adb0ca;
  margin-bottom: 80px;
}
@media only screen and (max-width: 750px) {
  .asset-wrap .content {
    padding: 0 30px 10px;
    margin: -130px auto 0;
  }
}
@media only screen and (min-width: 751px) {
  .asset-wrap .content {
    padding: 0;
    width: 1000px;
    margin: 52px auto;
  }
}
</style>
