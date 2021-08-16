<template>
  <div class="asset-wrap">
    <TheHeader :title="$t('asset.liquidityMining')" @click-left="handleBack" />
    <div class="asset-wrap-content">
      <div class="content-bg mobile"></div>
      <div class="content">
        <section class="panel panel-inject">
          <div class="desc" v-html="$t('asset.miningTip')"></div>
          <div class="input-wrap">
            <div class="input-item eth-item">
              <input
                v-model="ethNum"
                type="number"
                oninput="if(value.length>16)value=value.slice(0,16)"
                @focus="handleETHFocus"
                @blur="handleETHBlur"
                class="input-num input-eth"
                :placeholder="$t('asset.quantity')"
              />
              <div class="tit-wrap">ETH</div>
            </div>
            <div class="balance-wrap">
              <img
                class="icon"
                src="../../assets/img/index/icon-eth.png"
                alt=""
              />
              <span class="balance">{{ ethBalance }}</span>
            </div>
            <div
              class="input-options"
              @click="handleOptionETH"
              v-show="ethActive"
            >
              <div
                class="option eth-25"
                data-opt="25"
                :class="{ active: actClassETH == '25' }"
              >
                25%
              </div>
              <div
                class="option eth-50"
                data-opt="50"
                :class="{ active: actClassETH == '50' }"
              >
                50%
              </div>
              <div
                class="option eth-75"
                data-opt="75"
                :class="{ active: actClassETH == '75' }"
              >
                75%
              </div>
              <div
                class="option eth-all"
                data-opt="100"
                :class="{ active: actClassETH == '100' }"
              >
                {{ $t("asset.all") }}
              </div>
            </div>
          </div>
          <div class="add">+</div>
          <div class="input-wrap">
            <div class="input-item ros-item">
              <input
                v-model="rosNum"
                type="number"
                oninput="if(value.length>16)value=value.slice(0,16)"
                @focus="handleROSFocus"
                @blur="handleROSBlur"
                class="input-num input-ros"
                :placeholder="$t('asset.quantity')"
              />
              <div class="tit-wrap">ROS</div>
            </div>
            <div class="balance-wrap">
              <img
                class="icon"
                src="../../assets/img/index/icon-ros.png"
                alt=""
              />
              <span class="balance">{{ rosBalance }}</span>
            </div>
            <div
              class="input-options"
              @click="handleOptionROS"
              v-show="rosActive"
            >
              <div
                class="option ros-25"
                data-opt="25"
                :class="{ active: actClassROS == '25' }"
              >
                25%
              </div>
              <div
                class="option ros-50"
                data-opt="50"
                :class="{ active: actClassROS == '50' }"
              >
                50%
              </div>
              <div
                class="option ros-75"
                data-opt="75"
                :class="{ active: actClassROS == '75' }"
              >
                75%
              </div>
              <div
                class="option ros-all"
                data-opt="100"
                :class="{ active: actClassROS == '100' }"
              >
                {{ $t("asset.all") }}
              </div>
            </div>
          </div>
        </section>

        <section class="panel panel-ratio">
          <div class="title">{{ $t("asset.pricePoolRatio") }}</div>
          <div class="ratio-wrap">
            <div class="ratio-item">
              <div class="value">{{ toFixedFloor(rosToEthRatio) }}</div>
              <div class="unit">ROS {{ $t("asset.per") }} ETH</div>
            </div>
            <div class="ratio-item">
              <div class="value">{{ toFixedFloor(ethToRosRatio, 6) }}</div>
              <div class="unit">ETH {{ $t("asset.per") }} ROS</div>
            </div>
            <div class="ratio-item">
              <div class="value">{{ toFixedFloor(poolRatio, 4) }}%</div>
              <div class="unit">{{ $t("asset.poolRatio") }}</div>
            </div>
          </div>
        </section>

        <section class="panel panel-slide">
          <div class="slide-wrap">
            <div class="title">
              {{ $t("asset.slidSet") }}
            </div>
            <van-slider
              v-model="slipValue"
              @change="handleSlipChange"
              active-color="#f90066"
              :min="0"
              :max="3"
              :step="0.1"
            >
              <template #button>
                <div class="custom-button">
                  {{ toFixedFloor(slipValue, 1) + "%" }}
                </div>
              </template>
            </van-slider>
            <div class="range">
              <span class="min">0</span>
              <span class="min">3%</span>
            </div>
            <div class="tip">
              {{ $t("asset.slidTip") }}
            </div>
          </div>
          <div class="deadline-wrap">
            <div class="title">{{ $t("asset.transactionDeadline") }}</div>
            <div class="time">
              <input
                v-model="deadline"
                type="number"
                oninput="if(value.length>3)value=value.slice(0,3)"
                class="input-time"
              />&nbsp;
              <span class="per light-gray">{{ $t("asset.minutes") }}</span>
            </div>
          </div>
        </section>

        <ShareSideBtn />
      </div>
    </div>
    <!-- <div class="bottom-btns">
      <button
        class="btn btn-light btn-recall"
        :disabled="liquidityBalance <= 0"
        @click="$router.push('/mining-withdraw')"
      >
        {{ $t('asset.recallAssets') }}
      </button>
      <div
        v-if="!isAuthLiquidity"
        class="btn btn-dark btn-open"
        @click="handleAuthR2L"
      >
        {{ $t('index.authorize') }}
      </div>
      <button
        v-else
        class="btn btn-dark btn-open"
        :disabled="!dataReady || !isAffordable"
        @click="handleSupply"
      >
        {{ $t('asset.openUpMining') }}
      </button>
    </div> -->
    <!-- {{!isAuthLiquidity}} -->
    <div class="buttonDiv" v-if="!isAuthLiquidity  " :class="{ buttonDiv1: isAuthLiquidity }">
      <button
        class="btn btnAuth btn-dark btn-sure"
        :disabled="isAuthLiquidity===true"
       @click="handleAuthR2L"
      >
        <p v-if="!isAuthLiquidity">Allow Rosefintech to call your ROS</p>
        <p v-else>You can add liquidity now</p>
        <!-- {{ $t('index.authorize') }} -->
      </button>
      <span v-if="!isAuthLiquidity"
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
       <div class="buttonDiv buttonDiv1" v-if="assetMining " >
      <button
        class="btn btnAuth btn-dark btn-sure"
        disabled="true"

      >

        <p >You can add liquidity now</p>
        <!-- {{ $t('index.authorize') }} -->
      </button>

    </div>
    <div class="buttonDiv"  :class="{ buttonDiv1: !isAuthLiquidity || !dataReady || !isAffordable }">
       <button
        class="btn btnAuth btn-dark btn-sure"
        :disabled="!isAuthLiquidity || !dataReady || !isAffordable"

        @click="handleSupply"
       >
       <div v-if=" this.ethNum<=0">Enter Amount</div>
       <div v-else>{{ $t('asset.openUpMining') }} </div>


      </button>

    </div>
    <div class="buttonDiv buttonDiv2" :class="{ buttonDiv2: liquidityBalance <= 0 }">
      <!-- :disabled="liquidityBalance <= 0" -->
       <button
        class="btn btnAuth btn-dark btn-sure"

        @click="$router.push('/mining-withdraw')"
       >
        {{ $t('asset.recallAssets') }}

      </button>

    </div>

    <DialogSwap ref="dialogswap"></DialogSwap>
  </div>
</template>

<script>
import ShareSideBtn from "@/components/ShareSideBtn.vue";
import { fluidLogs,swapState } from "@/api/asset";
import {
  toFixedFloor,
  toFixedFloorPercent,
  debounce,
  Div,
  Mul,
} from "@/tool/utils";
import { addLog } from "@/api/asset";
import DialogSwap from "@/components/financial/Dialogswap.vue";
export default {
  name: "",
  components: {
    ShareSideBtn,
    DialogSwap,
  },
  data() {
    return {
      assetMining:false,
      showIncomeTip: false,
      showTrendTip: false,
      ethNum: null,
      rosNum: null,
      rosReserve: 0,
      ethReserve: 0,
      ethFocus: false,
      ethActive: false,
      rosFocus: false,
      rosActive: false,
      actClassETH: 0,
      actClassROS: 0,
      rosToEthRatio: 4000,
      ethToRosRatio: 0.00025,
      slipValue: 1,
      erc20Contract: "",
      whiteList: ["ROS"],
      deadline: 20,
      ethBalance: 0,
      addData: {
        _ethNum: "1000000000000000000",
        _ethNumMin: "985000000000000000",
        _rosNum: "4035884615384615384615",
        _rosNumMin: "3975346346153846153846",
      },
      liquidityBalance: 0,
      dataReady: false,
      eth2ros: true,
      addIng: false,
      authIng: false,
    };
  },
  computed: {
    rosBalance() {
      return +toFixedFloor(this.$store.state.asset.rosBalance, 4);
    },
    poolRatio() {
      return +this.rosNum > 0
        ? +this.rosNum / (+this.rosReserve + +this.rosNum)
        : 0;
    },
    rosInputMax() {
      return +toFixedFloor(
        Math.min(this.rosBalance, this.ethBalance * this.rosToEthRatio)
      );
    },
    ethInputMax() {
      return +toFixedFloor(
        Math.min(this.ethBalance, this.rosBalance / this.ethToRosRatio),
        6
      );
    },

    isAuthLiquidity() {
      console.log(this.$store.state.ros.isAuthLiquidity)

     return this.$store.state.ros.isAuthLiquidity
    },
    address() {
      return this.$store.state.address;
    },
    isAffordable() {

      return (
        +this.rosNum > 0 &&
        this.rosBalance >= +this.rosNum &&
        this.ethBalance >= +this.ethNum
      );
    },
  },
  watch: {
    ethNum(value) {
      console.log(this.ethFocus, value);
      if (this.ethFocus) {
        this.dataReady = false;
      }
      if (this.ethFocus && +value > 0) {
        this.handleETHChange();
      }
    },

    rosNum(value) {
      console.log(this.rosFocus, value);
      if (this.rosFocus) {
        this.dataReady = false;
      }
      if (this.rosFocus && +value > 0) {
        this.handleROSChange();
      }
    },
  },
  created() {
    if (!this.whiteList.includes(this.$route.query.name)) {
      this.handleBack();
    }
    this.$nextTick(() => {


    });
  },
  methods: {
    toFixedFloor,
    toFixedFloorPercent,
    watchAddress() {
      this.reqETHBalance();
      this.reqLiquidityBalance();
      this.reqReserve();
      this.checkPending(["addLiquidity", "liquidity"]);

    },

    async tt1(){

      const params = {
          address: this.$store.state.address,
          pageNo: 1,
          pageSize: 10,

        };
        console.log(params)

       fluidLogs(params).then(res=>{
         console.log(res);
        console.log(res.data.data);
        this.assetMining= res.data.data.length>0
       });


    },

    tt() {
      if (localStorage.getItem("visible") === "false") {
        return;
      }
      this.$refs["dialogswap"].show();
    },

    reqLiquidityBalance() {
      const fromWei = this.$web3.utils.fromWei;
      this.$agencyContract2nd.methods
        .getLiquidityProofAmount(this.$store.state.address)
        .call()
        .then(({ _balance }) => {
          this.liquidityBalance = +fromWei(_balance);
          console.log("liquidityBalance", this.liquidityBalance);
        })
        .catch((error) => {
          console.warn(error);
          this.$store.dispatch("addError", {
            error,
            func: `getLiquidityProofAmount(${this.$store.state.address}).call()`,
          });
        });
    },


    async reqETHBalance() {
      try {
        const { fromWei } = this.$web3.utils;
        const ethWei = await this.$web3.eth.getBalance(this.address);
        this.ethBalance = +toFixedFloor(fromWei(ethWei, "ether"), 6);
      } catch (error) {
        console.warn(error);
        this.$store.dispatch("addError", {
          error,
          func: `web3.eth.getBalance(${this.address})`,
        });
      }
    },


    async reqReserve() {
      try {
        const { fromWei } = this.$web3.utils;
        const res = await this.$agencyContract2nd.methods
          .getUniswapReserves()
          .call();

        this.rosReserve = +fromWei(res.rosReserve, "ether");
        this.ethReserve = +fromWei(res.ethReserve, "ether");


        this.rosToEthRatio = toFixedFloor(this.rosReserve / this.ethReserve);
        this.ethToRosRatio = toFixedFloor(this.ethReserve / this.rosReserve, 8);
      } catch (error) {
        console.warn(error);
        this.$store.dispatch("addError", {
          error,
          func: `getUniswapReserves().call()`,
        });
      }
    },

    handleETHChange() {
      this.dataReady = false;
      this.eth2ros = true;




      if (+this.ethNum > this.ethInputMax) {
        this.ethNum = this.ethInputMax;
        this.$toast.fail(this.$t("asset.maxTo") + this.ethNum + " ETH");
      }
      if (!this.afterETHChange) {
        this.afterETHChange = debounce(this.getRosByETH, 800);
      }
      if (+this.ethNum > 0) {
        this.afterETHChange();
      } else {
        this.$toast.clear();
        this.ethNum = null;
        this.rosNum = null;
        this.dataReady = false;
      }
    },
    async getRosByETH() {
      const { fromWei, toWei } = this.$web3.utils;
      try {
        this.$toast.loading({
          duration: 0,
        });
        const res = await this.$agencyContract2nd.methods
          .getAddUniLiquidityDataETH2Ros(
            toWei(String(+this.ethNum), "ether"),
            Math.round(this.slipValue * 10)
          )
          .call();
        this.rosNum = +toFixedFloor(fromWei(res._rosNum, "ether"));

        this.addData = res;
        this.$toast.clear();
        if (this.rosBalance > +this.rosNum) {
          this.dataReady = true;
        } else {
          this.dataReady = false;

          this.$toast.fail(`${this.$t("finance.rosLessThan")} ${this.rosNum}`);
        }
      } catch (error) {
        console.warn(error);
        this.$toast.clear();
        const params = `${toWei(String(this.ethNum), "ether")},${
          this.slipValue * 10
        }`;
        this.$store.dispatch("addError", {
          error,
          func: `getAddUniLiquidityDataETH2Ros(${params}).call()`,
        });
      }
    },
    handleROSChange() {
      this.dataReady = false;
      this.eth2ros = false;




      if (+this.rosNum > this.rosInputMax) {
        this.rosNum = this.rosInputMax;
        this.$toast.fail(this.$t("asset.maxTo") + this.rosNum + " ROS");
      }
      if (!this.afterROSChange) {
        this.afterROSChange = debounce(this.getETHByROS, 800);
      }
      if (+this.rosNum > 0) {
        this.afterROSChange();
      } else {
        this.$toast.clear();
        this.rosNum = null;
        this.ethNum = null;
        this.dataReady = false;
      }
    },
    async getETHByROS() {
      const { fromWei, toWei } = this.$web3.utils;
      try {
        this.$toast.loading({
          duration: 0,
        });
        const res = await this.$agencyContract2nd.methods
          .getAddUniLiquidityDataRos2ETH(
            toWei(String(+this.rosNum), "ether"),
            Math.round(this.slipValue * 10)
          )
          .call();

        this.ethNum = +toFixedFloor(fromWei(res._ethNum, "ether"), 8);
        this.addData = res;
        this.$toast.clear();
        this.dataReady = true;
      } catch (error) {
        this.$toast.clear();
        console.warn(error);
        this.$store.dispatch("addError", {
          error,
          func: `getAddUniLiquidityDataRos2ETH().call()`,
        });
      }
    },

    handleSlipChange() {
      console.log(this.eth2ros, this.slipValue);
      if (this.eth2ros && +this.ethNum > 0) {
        this.$toast.loading();
        this.getRosByETH();
      } else if (!this.eth2ros && +this.rosNum > 0) {
        this.$toast.loading();
        this.getETHByROS();
      }
    },


    handleAuthR2L() {
      if (!this.address) {
        this.$toast.fail(this.$t("message.noAuth"));
        return;
      }


      if (this.authIng) return;
      this.authIng = true;

    this.doAuthRos2Liquidity();

    },

    onAuthOK(type) {
      this.assetMining=true;
      if (type !== "liquidity") return;

      this.clearStateTimer();
      this.$store.commit("ros/SET_AUTH_LIQUIDITY", true);


      this.authIng = false;
      this.$toast.clear();
      this.$toast.success(this.$t("message.authOk"));

      setTimeout(() => {
        if (this.eth2ros) {
          this.handleETHChange();
        } else {
          this.handleROSChange();
        }
      }, 1200);
    },

    onAuthFail(error, type) {
      this.assetMining=false;
      if (type !== "liquidity") return;

      this.clearStateTimer();
      this.authIng = false;
      this.$toast.clear();
      if (error.code === 4001) {
        this.$toast.fail(this.$t("message.denied"));
      } else {
        this.$toast.fail(this.$t("message.authError"));
        this.$store.dispatch("addError", {
          error,
          func: `doAuthRos2${type}()`,
        });
      }
    },

    handleSupply() {
      if (!this.address) {
        this.$toast.fail(this.$t("message.noAuth"));
        return;
      }
      if (!this.isAuthLiquidity) {
        this.handleAuthR2L();
        return;
      }
      setTimeout(() => {
        this.handleSureSupply();
      }, 0);
    },
    async handleSureSupply() {
      if (!this.dataReady) return;
      if (+this.ethNum < 0 || +this.rosNum < 0) {
        return this.$toast.fail(this.$t("asset.inputETH"));
      }
      if (this.addIng) return;
      this.addIng = true;

      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: this.$t("message.handling"),
      });
      const ddline = Math.round(Date.now() / 1000 + this.deadline * 60);
      let txHash = "";
      this.$agencyContract2nd.methods
        .addUniLiquidityETH(
          this.addData._rosNum,
          this.addData._ethNumMin,
          this.addData._rosNumMin,
          String(ddline)
        )
        .send({
          from: this.address,
          value: this.addData._ethNum,
        })
        .on("transactionHash", (hash) => {
          txHash = hash;
          this.addSwapLog(hash);
          this.startCheckState(hash, "addLiquidity");
        })
        .on("receipt", (receipt) => {
          this.removeByTxHash(txHash);
          this.onSendOK(receipt, "addLiquidity");
        })
        .on("error", (error) => {
          this.removeByTxHash(txHash);
          this.onSendFail(error, "addLiquidity");
        });
    },

    onSendFail(error, type) {
      if (type != "addLiquidity") return;

      this.clearStateTimer();
      this.addIng = false;
      this.$toast.clear();

      if (error.code === 4001) {
        this.$toast.fail(this.$t("message.denied"));
        return;
      }

      this.$toast.fail(this.$t("message.handleError"));
      const ddline = Math.round(Date.now() / 1000 + this.deadline * 60);
      const params = `${this.addData._rosNum},${this.addData._ethNumMin},${this.addData._rosNumMin},${ddline}`;
      this.$store.dispatch("addError", {
        error,
        func: `addUniLiquidityETH(${params}).send()`,
      });
    },

    onSendOK(receipt, type) {
      if (type != "addLiquidity") return;
      this.clearStateTimer();
  const data = {
              blockNumber: receipt.blockNumber,
              transactionHash: receipt.transactionHash,
              id: localStorage.getItem('dataMing'),
              state: 1,
              type: 1,
            };
            swapState(data).then((res) => {
              console.log(res);
            });
      this.onSupplyOK();
    },

    onSupplyOK() {

      this.addIng = false;
      this.$toast.clear();
      this.$toast.success(this.$t("message.handleOK"));


      setTimeout(() => {
        localStorage.setItem("assettab", "mining");
        this.$router.push("/asset?name=ROS");
      }, 1000);









    },

    async addSwapLog(hash) {
      const params = {
        type: 1,
        judge: 2,
        address: this.address,
        slippage: this.slipValue,
        deal_hash: hash,
        ros_amount: this.rosNum,
        eth_amount: this.ethNum,
      };
      try {
        const { success, msg,data } = await addLog(params);
        if (success) {
          console.log("add milling log ok");
           localStorage.setItem('dataMing',data);
        } else {
          this.$toast.fail(msg);
        }
      } catch (error) {
        console.warn(error);
        this.$store.dispatch("addError", {
          error,
          func: `addSwapLog(${JSON.stringify(params)})`,
        });
      }
    },

    handleETHFocus() {
      this.ethFocus = true;
      this.ethActive = true;
    },
    handleETHBlur() {
      this.ethFocus = false;
    },
    handleROSFocus() {
      this.rosFocus = true;
      this.rosActive = true;
    },
    handleROSBlur() {
      this.rosFocus = false;
    },
    handleOptionETH(e) {
      const opt = e.target.dataset.opt;
      if (opt) {
        this.actClassETH = opt;
        this.ethNum = Mul(this.ethBalance, Div(+opt, 100));
        this.handleETHChange();
        this.actClassETH = Math.round(
          Div(Mul(this.ethNum, 100), this.ethBalance)
        );
      }
    },
    handleOptionROS(e) {
      const opt = e.target.dataset.opt;
      if (opt) {
        this.actClassROS = opt;
        this.rosNum = Mul(this.rosBalance, Div(+opt, 100));

        this.handleROSChange();
        this.actClassROS = Math.round(
          Div(Mul(this.rosNum, 100), this.rosBalance)
        );
      }
    },

    handleBack() {

      this.MyGo(-1);
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
.buttonDiv2{
  background: #FFFFFF;
border: 2px solid #330066;
color: #330066;
}
.buttonDiv2 botton{
   background: #FFFFFF;
   color: #330066;
}
.buttonDiv2 .btn-dark {
    border: 0.02667rem solid #fff;
    background: #fff;
    color: #330066;
}
.buttonDiv2 .btn-dark[disabled], .buttonDiv2 .btn-dark.disabled {
    border: 0.02667rem solid #fff !important;
    background: #fff !important;
    color: #330066 !important;
    opacity: 1 !important;
}

.asset-wrap .asset-wrap-content {
  position: relative;
  padding-bottom: 80px;
}
.asset-wrap .content-bg {
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
  padding: 50px;
  background-color: #fff;
  border-radius: 40px;
  text-align: left;
}
.panel-inject .desc {
  font-size: 24px;
  font-weight: 400;
  color: #adb0ca;
  line-height: 36px;
  margin-bottom: 50px;
  text-align: justify;
}
.panel-inject .input-wrap {
  font-size: 30px;
  line-height: 48px;
  font-weight: 600;
  color: #091d42;
}
.panel-inject .input-wrap .trans-img {
  width: 44px;
  height: 44px;
}
.panel-inject .input-wrap .icon {
  width: 50px;
  height: 50px;
  margin-right: 5px;
}
.panel-inject .input-wrap .input-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dedede;
  margin: 30px 0;
}
.panel-inject .input-wrap .input-item .tit-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.panel-inject .input-wrap .input-item .input-num {
  width: 100%;
  font-size: 34px;
  font-weight: 400;
  color: #adb0ca;
  line-height: 48px;
  background: #fff;
}
.panel-inject .input-wrap .balance-wrap {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
}
.panel-inject .input-wrap .input-options {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.panel-inject .input-wrap .input-options .option {
  height: 46px;
  line-height: 48px;
  padding: 0 20px;
  border: 1px solid #f5f6fd;
  border-radius: 23px;
  font-size: 24px;
  font-family: TsangerYunHei;
  font-weight: 400;
  color: #091d42;
}
.panel-inject .input-wrap .input-options .active {
  border: 1px solid #330066;
}
.panel-inject .add {
  width: 58px;
  height: 58px;
  line-height: 68px;
  background: #f5f6fd;
  border-radius: 15px;
  text-align: center;
  font-size: 58px;
  color: #adb0ca;
  margin: 50px auto;
}

.panel-ratio {
  margin-top: 30px;
  margin-bottom: 30px;
}
.panel-ratio .title {
  font-weight: 600;
  font-size: 30px;
}
.panel-ratio .ratio-wrap {
  display: flex;
  margin-top: 20px;
}
.panel-ratio .ratio-wrap .ratio-item {
  flex: 1;
  text-align: center;
}
.panel-ratio .ratio-wrap .ratio-item .value {
  font-size: 26px;
  font-weight: 600;
  color: #091d42;
}
.panel-ratio .ratio-wrap .ratio-item .unit {
  font-size: 22px;
}
.panel-slide {
  text-align: left;
}
.panel-slide .title {
  font-size: 30px;
  font-weight: 600;
  color: #091d42;
}
.panel-slide .van-slider {
  margin-top: 30px;
  margin-bottom: 15px;
  height: 8px;
  width: 90%;
  margin: 50px auto 30px;
}
.panel-slide .custom-button {
  width: 80px;
  color: #fff;
  font-size: 24px;
  line-height: 50px;
  text-align: center;
  background-color: #f90066;
  border-radius: 100px;
  user-select: none;
}

.panel-slide .slide-wrap .range {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  color: #adb0ca;
  font-size: 22px;
}
.panel-slide .slide-wrap .tip {
  margin-top: 20px;
  font-size: 22px;
  font-weight: 400;
  color: #adb0ca;
  text-align: left;
}

.panel-slide .deadline-wrap {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}
.panel-slide .deadline-wrap .title {
  font-size: 26px;
}
.panel-slide .deadline-wrap .input-time {
  width: 3em;
  text-align: center;
  background: #ffffff;
  border: 1px solid #f5f6fd;
  border-radius: 10px;
}

.content .next-step {
  margin-top: 90px;
  margin-bottom: 40px;
  line-height: 80px;
  height: 80px;
  background: #330066;
  border-radius: 40px;
  font-size: 30px;
  font-family: TsangerYunHei;
  color: #ffffff;
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
}
.bottom-btns .btn {
  width: 287px;
  font-size: 28px;
}
.bottom-btns .btn-recall {
  margin-right: 0;
}
.bottom-btns .btn-dark {
  margin-left: 60px;
}
.help-wrap {
  position: relative;
}

.help-icon {
  width: 32px;
  height: 32px;
  padding-left: 10px;
}
.tip-panel {
  position: absolute;
  left: -4rem;
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
  box-shadow: 0 0.01333rem 0.04rem 0 rgba(158, 152, 153, 0.31);
  border-radius: 0.13333rem;
}
.tip-panel {
  position: absolute;
  left: -7rem;
  top: 0.8rem;
  width: 540px;
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
  left: 530px;
  border: 12px solid transparent;
  border-bottom-color: #9e98994f;
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
    margin: 52px auto;
  }
}
</style>
