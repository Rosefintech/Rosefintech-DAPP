<template>
  <div class="asset-wrap">
    <TheHeader :title="$t('asset.swap')" @click-left="handleBack" />
    <div class="asset-wrap-content">
      <div class="content-bg mobile"></div>
      <div class="content">
        <div class="box box-top">
          <div class="input-wrap">
            <div class="input-item eth-item" v-if="isETH2ROS">
              <div class="tit-wrap tit-wrap-left">
                <img
                  class="icon"
                  src="../../assets/img/index/icon-eth.png"
                  alt="ETH"
                />
                ETH
              </div>
              <!-- @change="handleETHChange" -->
              <input
                v-model="ethNum"
                type="number"
                autofocus
                oninput="if(value.length>16)value=value.slice(0,16)"
                @focus="inputFocus = true"
                @blur="inputFocus = false"
                class="input-num input-value"
                :placeholder="swapMaxText"
              />
            </div>
            <div class="input-item eth-item" v-else>
              <div class="tit-wrap tit-wrap-left">
                <img
                  class="icon"
                  src="../../assets/img/index/icon-ros.png"
                  alt="ROS"
                />
                ROS
              </div>
              <!-- @change="handleRosChange" -->
              <input
                v-model="rosNum"
                type="number"
                autofocus
                oninput="if(value.length>16)value=value.slice(0,16)"
                @focus="inputFocus = true"
                @blur="inputFocus = false"
                class="input-num input-value"
                :placeholder="swapMaxText"
              />
            </div>
            <img
              class="trans-img"
              src="../../assets/img/icon-swap.png"
              alt=""
              @click="handleToggleDirection"
            />
            <!-- -->
            <div class="input-item ros-item" v-if="isETH2ROS">
              <div class="tit-wrap tit-wrap-right">
                <img
                  class="icon"
                  src="../../assets/img/index/icon-ros.png"
                  alt="ROS"
                />
                ROS
              </div>
              <input
                v-model="calcRosNum"
                type="number"
                disabled
                class="input-num input-receive"
                :placeholder="$t('asset.targetNum')"
              />
            </div>
            <div class="input-item ros-item" v-else>
              <div class="tit-wrap tit-wrap-right">
                <img
                  class="icon"
                  src="../../assets/img/index/icon-eth.png"
                  alt="ETH"
                />
                ETH
              </div>
              <input
                v-model="calcETHNum"
                type="number"
                disabled
                class="input-num input-receive"
                :placeholder="$t('asset.targetNum')"
              />
            </div>
          </div>
          <div class="ratio-wrap">
            <template v-if="isETH2ROS">
              <div class="ratio">
                <span
                  >{{ $t("asset.ratio") }}1 ETH ≈ {{ eth2rosRatio }} ROS</span
                >
              </div>
              <div class="fee">
                {{ $t("asset.fluidFee") }} {{ +toFixedFloor(e2rFee, 6) }} ETH
              </div>
            </template>
            <template v-else>
              <div class="ratio">
                <span
                  >{{ $t("asset.ratio") }}1 ROS ≈ {{ ros2ethRatio }} ETH</span
                >
              </div>
              <div class="fee">
                {{ $t("asset.fluidFee") }} {{ +toFixedFloor(r2eFee, 4) }} ROS
              </div>
            </template>
          </div>

          <div class="slide-wrap">
            <div class="title">
              {{ $t("asset.slidSet") }}
            </div>
            <van-slider
              v-model="slipValue"
              @change="onSliderChange"
              active-color="#f90066"
              :min="slipMin"
              :max="slipMax"
              :step="0.1"
            >
              <template #button>
                <div class="custom-button">
                  {{ toFixedFloor(slipValue, 1) + "%" }}
                </div>
              </template>
            </van-slider>
            <div class="range">
              <span class="min">{{ slipMin }}</span>
              <span class="min">{{ slipMax }}%</span>
            </div>
            <div class="tip">
              {{ $t("asset.slidTip") }}
            </div>
          </div>
          <div class="price-impact min-receipt">
            <span class="title">
              {{ $t("asset.minReceipt") }}
              <i
                class="help-wrap"
                @mouseover.stop="showMinTip = true"
                @mouseout.stop="showMinTip = false"
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
                <div class="tip-panel" v-show="showMinTip">
                  {{ $t("asset.minReceiveTip") }}
                </div>
              </i>
            </span>
            <span class="red" v-if="isETH2ROS">
              {{ toFixedFloor(minReceiptROSValue, 2) }} ROS
            </span>
            <span class="red" v-else>
              {{ toFixedFloor(minReceiptETHValue, 6) }} ETH
            </span>
          </div>
          <div class="price-impact">
            <span class="title">
              {{ $t("asset.priceImpact") }}
              <i
                class="help-wrap"
                @mouseover.stop="showRatioTip = true"
                @mouseout.stop="showRatioTip = false"
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
                <div class="tip-panel" v-show="showRatioTip">
                  {{ $t("asset.priceImpactTip") }}
                </div>
              </i>
            </span>
            <span class="red" v-if="isETH2ROS">
              {{ toFixedFloor(impactROSValue) }}%
            </span>
            <span class="red" v-else>{{ toFixedFloor(impactETHValue) }}%</span>
          </div>
          <div class="deadline-wrap">
            <div class="title">{{ $t("asset.transactionDeadline") }}</div>
            <div class="time">
              <input
                v-model="deadline"
                type="number"
                oninput="if(value.length>3)value=value.slice(0,3)"
                class="input-time"
                @blur="blurIn"
              />&nbsp;
              <span class="per">{{ $t("asset.minutes") }}</span>
            </div>
          </div>

          <!-- <p class="auth-tip tip" v-if="!isETH2ROS && !isAuthLiquidity">
            {{ $t('message.authTip') }}
          </p> -->
          <!-- <button
            class="next-step btn btn-dark"
            :disabled="dataLoading"
            @click="handleSwap"
          >
            {{ swapBtnText }}
          </button> -->
          <!-- {{isAuthLiquidity}} -->
          <!-- {{!isAuthLiquidity}} {{!assetSwap}} {{isETH2ROS}} -->
          <!-- {{assetSwap }} {{!isAuthLiquidity}} -->
          <!-- {{assetSwap}} -->

          <div v-if="!isETH2ROS">
            <div
              class="buttonDiv"
              v-if="!isAuthLiquidity"
              :class="{ buttonDiv1: isAuthLiquidity }"
            >
              <button
                class="btn btnAuth btn-dark btn-sure"
                :disabled="isAuthLiquidity === true"
                @click="handleSwap"
              >
                <p v-if="!isAuthLiquidity">
                  Allow Rosefintech to call your ROS
                </p>
                <p v-else>You can swap now</p>
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
          </div>
          <!-- {{assetSwap}} -->
          <div v-if="assetSwap">
            <div class="buttonDiv buttonDiv1">
              <button
                class="btn btnAuth btn-dark btn-sure"
                disabled="false"
                @click="handleSwap"
              >
                <p>You can swap now</p>
                <!-- {{ $t('index.authorize') }} -->
              </button>
            </div>
          </div>

          <button
            class="next-step btn btn-dark"
            v-if="isETH2ROS === true"
            :disabled="dataLoading"
            @click="handleSwap"
          >
            <!-- {{ swapBtnText }} -->
            <span v-if="this.ethNum<=0 "> Enter Amount</span>

            <span v-else> {{ $t("asset.btnSwap") }}</span>

          </button>
          <button
            class="next-step btn btn-dark"
            v-if="isETH2ROS === false"
            :disabled="dataLoading || !isAuthLiquidity"
            @click="handleSwap"
          >
          <span v-if=" this.rosNum<=0 "> Enter Amount</span>
            <!-- {{ swapBtnText }} -->
          <span v-else> {{ $t("asset.btnSwap") }}</span>
          </button>

          <p class="auth-tip tip" v-if="!isETH2ROS && !isAuthLiquidity">
            {{ $t("message.authTip") }}
          </p>
        </div>

        <ShareSideBtn />
      </div>
    </div>
    <DislogSwapWarn ref="dislogSwapWarn" @sure="handleSureSwap" />
    <DialogSwap ref="dialogswap"></DialogSwap>
    <div class="foot-fix mobile"></div>
  </div>
</template>

<script>
import ShareSideBtn from "@/components/ShareSideBtn.vue";
import DislogSwapWarn from "@/components/asset/DislogSwapWarn.vue";
import { toFixedFloor, debounce } from "@/tool/utils";
import { addLog, swapState } from "@/api/asset";
import DialogSwap from "@/components/financial/Dialogswap.vue";

import { swapLogs, transLogsSwift, getGovernList } from "@/api/asset";
export default {
  name: "",
  components: {
    ShareSideBtn,
    DislogSwapWarn,
    DialogSwap,
  },
  data() {
    return {
      dataId:'',
      assetSwap: false,
      showIncomeTip: false,
      showTrendTip: false,
      ethNum: null,
      calcRosNum: null,
      rosNum: null,
      calcETHNum: null,
      inputFocus: false,
      ethBalance: 0,
      rosAddress: "",
      liquidityAddress: "",
      slipValue: 1,
      slipMin: 0,
      slipMax: 3,
      isETH2ROS: true,
      eth2rosRatio: 0,
      ros2ethRatio: 0,
      minReceiptROSValue: 0,
      minReceiptETHValue: 0,
      impactROSValue: 0,
      impactETHValue: 0,
      deadline: 20,
      dataLoading: true,
      showMinTip: false,
      showRatioTip: false,
      authIng: false,
      swapE2RIng: false,
      swapR2EIng: false,
      whiteList: ["ROS"],
      list: [],
    };
  },
  computed: {
    e2rFee() {
      return this.ethNum > 0 ? (this.ethNum * 3) / 1000 : 0;
    },
    r2eFee() {
      return this.rosNum > 0 ? (this.rosNum * 3) / 1000 : 0;
    },
    rosBalance() {
      return +toFixedFloor(this.$store.state.asset.rosBalance, 4);
    },

    isAuthLiquidity() {
      return this.$store.state.ros.isAuthLiquidity;
    },
    address() {
      return this.$store.state.address;
    },
    swapMaxText() {
      return this.isETH2ROS
        ? toFixedFloor(this.ethBalance, 6)
        : toFixedFloor(this.rosBalance, 4);
    },
    swapBtnText() {
      return !this.isETH2ROS && !this.isAuthLiquidity
        ? this.$t("index.authorize")
        : this.$t("asset.btnSwap");
    },
    scrollHeight() {
      return document.documentElement.scrollTop || document.body.scrollTop || 0;
    },
  },
  watch: {
    ethNum(value) {
      this.watchETH(value);
    },
    rosNum(value) {
      this.watchROS(value);
    },
  },
  created() {
    if (!this.whiteList.includes(this.$route.query.name)) {
      this.handleBack();
    }

  },

  methods: {
    toFixedFloor,
    watchAddress() {
      this.reqETHBalance();
      this.reqRatioInit();

    },
    watchToken() {

    },
    async onLoadData1() {
      const params = {
        enter_address: this.$store.state.address,
        pageNo: 1,
        pageSize: 10,
      };

      console.log(params);
      swapLogs(params)
        .then((res) => {
          console.log(res);
          this.list = res.data.data;
          console.log(this.list);
        })
        .catch((error) => {
          console.log(error);
        });




































    },
    getFunc() {
      if (this.tokenName === "ROS") {
        return swapLogs;
      } else if (this.tokenName === "Swift") {
        return transLogsSwift;
      } else {
        return getGovernList;
      }
    },

    getParams() {
      if (this.tokenName === "ROS" || this.tokenName === "Swift") {
        return {
          enter_address: this.$store.state.address,
          pageNo: Math.floor(this.list.length / 10) + 1,
          pageSize: 10,
          tokenType: "ROS",
        };
      } else {
        return {
          address: this.$store.state.address,
          pageNo: Math.floor(this.list.length / 10) + 1,
          pageSize: 10,
          tokenType: "ROS",
          type: "INTO",
        };
      }
    },
    watchETH(value) {
      this.dataLoading = true;
      if (this.inputFocus && +value > 0) {
        this.handleETHChange(value);
      }
    },
    watchROS(value) {
      this.dataLoading = true;
      if (this.inputFocus && +value > 0) {
        this.handleRosChange(value);
      }

    },
    tt() {
      this.$refs["dialogswap"].show();
    },
    resetData() {
      this.ethNum = null;
      this.calcRosNum = null;
      this.rosNum = null;
      this.calcETHNum = null;
      this.eth2rosRatio = 0;
      this.ros2ethRatio = 0;
      this.minReceiptROSValue = 0;
      this.minReceiptETHValue = 0;
      this.impactROSValue = 0;
      this.impactETHValue = 0;
    },


    async reqETHBalance() {
      try {
        const ethWei = await this.$web3.eth.getBalance(this.address);
        this.ethBalance = +toFixedFloor(
          this.$web3.utils.fromWei(ethWei, "ether"),
          4
        );
      } catch (error) {
        console.warn(error);
      }
    },

    handleToggleDirection() {

      this.isETH2ROS = !this.isETH2ROS;
      if (this.isETH2ROS) {
        if (this.ethNum > 0) {
          this.dataLoading = false;
        } else {
          this.dataLoading = true;
          this.reqRatioETH2ROS(1);
        }
      } else {
        if (this.rosNum > 0) {
          this.dataLoading = false;
        } else {
          this.dataLoading = true;
          this.reqRatioROS2ETH(1);
        }
      }
    },
    onSliderChange() {
      if (this.isETH2ROS && this.ethNum > 0) {
        this.reqCalcRosAmount(this.ethNum);
        this.reqRatioETH2ROS(this.ethNum);
      } else if (!this.isETH2ROS && this.rosNum > 0) {
        this.reqCalcETHAmount(this.rosNum);
        this.reqRatioROS2ETH(this.rosNum);
      }
    },

    blurIn() {
      window.scrollTo(0, Math.max(this.scrollHeight - 1, 0));
    },


    handleETHChange() {
      this.dataLoading = true;

      if (+this.ethNum > +this.ethBalance) {
        this.ethNum = this.ethBalance;
      }

      if (!this.afterETHChange) {
        this.afterETHChange = debounce(this.reqDataByETH, 800);
      }
      if (this.ethNum > 0) {
        this.afterETHChange(+this.ethNum);
      } else {
        this.resetData();
        this.reqRatioETH2ROS(1);
      }
    },

    reqDataByETH(ethNum) {
      this.reqCalcRosAmount(ethNum);
      this.reqRatioETH2ROS(ethNum);
      this.reqReserve(ethNum);
    },


    handleRosChange() {
      this.dataLoading = true;

      if (+this.rosNum > +this.rosBalance) {
        this.rosNum = this.rosBalance;
      }
      console.log(this.rosNum);
      if (!this.afterROSChange) {
        this.afterROSChange = debounce(this.reqDataByROS, 800);
      }
      if (this.rosNum > 0) {
        this.afterROSChange(+this.rosNum);
      } else {
        this.resetData();
        this.reqRatioROS2ETH(1);
      }
    },

    reqDataByROS(rosNum) {
      this.reqCalcETHAmount(rosNum);
      this.reqRatioROS2ETH(rosNum);
      this.reqReserve(rosNum);
    },


    handleSwap() {
      if (!this.address) {

        this.$toast.fail(this.$t("message.noAuth"));
        return;
      }
      if (this.isETH2ROS) {
        this.doSwapETH2ROS();
      } else {
        if (this.isAuthLiquidity) {
          this.doSwapROS2ETH();
        } else {

          this.handleAuthR2L();
        }
      }
    },
    doSwapETH2ROS() {
      if (!this.ethNum || this.ethNum <= 0) {
        this.$toast.fail(this.$t("asset.inputETH"));
        return;
      }
      if (this.impactROSValue > 15) {
        console.warn("more than 15 percent");
        this.$toast({
          forbidClick: true,
          icon: "close",
          message: this.$t("asset.forbidSwap"),
        });
        return;
      }
      if (this.impactROSValue > 5) {
        this.$refs.dislogSwapWarn.show();
      } else {
        this.handleETH2ROS();
      }
    },
    handleETH2ROS() {
      if (this.swapE2RIng) return;
      this.swapE2RIng = true;

      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: this.$t("asset.swapping"),
      });
      const { toWei } = this.$web3.utils;
      const ddline = Math.round(Date.now() / 1000 + this.deadline * 60);
      let txHash = "";
      this.$agencyContract2nd.methods
        .uniswapExactETHForTokens(
          toWei(String(this.minReceiptROSValue), "ether"),
          String(ddline)
        )
        .send({
          from: this.address,
          value: toWei(String(this.ethNum)),
        })
        .on("transactionHash", (hash) => {
          txHash = hash;
          this.addSwapLog(hash, 1);
          this.startCheckState(hash, "swapE2R");
        })
        .on("receipt", (receipt) => {
          this.removeByTxHash(txHash);
          this.onSendOK(receipt, "swapE2R");
        })
        .on("error", (error) => {
          this.removeByTxHash(txHash);
          if (error.code === 4001) {
            this.swapE2RIng = false;
            this.$toast.clear();
            this.$toast.fail(this.$t("message.denied"));
          } else {
            console.warn(error);
            this.onSendFail(error, "swapE2R");
          }
        });
    },
    doSwapROS2ETH() {
      if (this.rosNum <= 0) {
        this.$toast.fail(this.$t("asset.inputETH"));
        return;
      }

      if (this.impactETHValue > 15) {
        this.$toast({
          forbidClick: true,
          icon: "close",
          message: this.$t("asset.forbidSwap"),
        });
        return;
      }

      if (this.impactETHValue > 5) {
        this.$refs.dislogSwapWarn.show();
      } else {
        this.handleROS2ETH();
      }
    },
    handleSureSwap() {
      if (!this.address) {
        this.$toast.fail(this.$t("message.noAuth"));
        return;
      }
      if (this.isETH2ROS && this.ethNum > 0) {
        this.handleETH2ROS();
      } else if (!this.isETH2ROS && this.rosNum > 0) {
        this.handleROS2ETH();
      }
    },

    async handleROS2ETH() {
      if (this.swapR2EIng) return;
      this.swapR2EIng = true;

      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: this.$t("asset.swapping"),
      });
      const { toWei } = this.$web3.utils;
      const ddline = Math.round(Date.now() / 1000 + this.deadline * 60);
      console.log(
        "uniswapExactTokensForETH",
        toWei(String(this.rosNum), "ether"),
        toWei(String(this.minReceiptETHValue), "ether"),
        ddline
      );
      let txHash = "";
      this.$agencyContract2nd.methods
        .uniswapExactTokensForETH(
          toWei(String(this.rosNum), "ether"),
          toWei(String(this.minReceiptETHValue), "ether"),
          String(ddline)
        )
        .send({
          from: this.address,
        })
        .on("transactionHash", (hash) => {
          txHash = hash;
          this.addSwapLog(hash, 2);
          this.startCheckState(hash, "swapR2E");
        })
        .on("receipt", (receipt) => {
          this.removeByTxHash(txHash);
          this.onSendOK(receipt, "swapR2E");
        })
        .on("error", (error) => {
          this.removeByTxHash(txHash);
          this.onSendFail(error, "swapR2E");
        });
    },

    onSendOK(receipt, type) {

      if (!["swapE2R", "swapR2E"].includes(type)) return;

      this.clearStateTimer();
      if (type === "swapE2R") {
        console.log("onsendok", type);
        console.log("replacement receipt1", receipt);

  const data = {
              blockNumber: receipt.blockNumber,
              transactionHash: receipt.transactionHash,
              id: localStorage.getItem('dataId'),
              state: 1,
              type: 1,
            };
            swapState(data).then((res) => {
              console.log(res);
            });


        this.onSwapE2ROK();
      } else {
          const data = {
              blockNumber: receipt.blockNumber,
              transactionHash: receipt.transactionHash,
              id: localStorage.getItem('dataId'),
              state: 1,
              type: 1,
            };
            swapState(data).then((res) => {
              console.log(res);
            });
        this.onSwapR2EOK();
      }
    },

    onSwapE2ROK() {

      this.swapE2RIng = false;
      this.$toast.clear();
      this.$toast.success(this.$t("asset.swapOk"));


      this.$store.dispatch("asset/initAsset");


      localStorage.setItem("assettab", "exchange");
      this.$router.push("/asset?name=ROS");
    },

    onSwapR2EOK() {

      this.swapR2EIng = false;
      this.$toast.clear();
      this.$toast.success(this.$t("asset.swapOk"));

      this.$store.dispatch("asset/initAsset");

      localStorage.setItem("assettab", "exchange");
      this.$router.push("/asset?name=ROS");
    },

    onSendFail(error, type) {
      this.clearStateTimer();
      this.$toast.clear();
console.log(type)
      if (error.code === 4001) {
        this.$toast.fail(this.$t("message.denied"));
        return;
      }

      if (type === "swapE2R") {
        this.onSwapE2RFail(error);
      } else {
        this.onSwapR2EFail(error);
      }
    },

    onSwapE2RFail(error) {
      this.swapE2RIng = false;
      this.$toast.clear();
      this.$toast.fail(this.$t("asset.swapFail"));
      const { toWei } = this.$web3.utils;
      const ddline = Math.round(Date.now() / 1000 + this.deadline * 60);
      const params = `${toWei(
        String(this.minReceiptROSValue),
        "ether"
      )},${ddline}`;
      const sendPr = JSON.stringify({
        from: this.address,
        value: toWei(String(this.ethNum)),
      });
      this.$store.dispatch("addError", {
        error,
        func: `uniswapExactETHForTokens(${params}).send(${sendPr})`,
      });
    },

    onSwapR2EFail(error) {
      this.swapR2EIng = false;
      this.$toast.clear();
      this.$toast.fail(this.$t("asset.swapFail"));
      const { toWei } = this.$web3.utils;
      const ddline = Math.round(Date.now() / 1000 + this.deadline * 60);
      const params = `${toWei(String(this.rosNum), "ether")},${toWei(
        String(this.minReceiptETHValue),
        "ether"
      )},${ddline}`;
      this.$store.dispatch("addError", {
        error,
        func: `uniswapExactTokensForETH(${params}).send()`,
      });
    },

    async addSwapLog(hash, type) {
      try {
        const params = {
          type,
          judge: 1,
          address: this.address,
          slippage: this.slipValue,
          deal_hash: hash,
          ros_amount: type === 1 ? this.calcRosNum : this.rosNum,
          eth_amount: type === 1 ? this.ethNum : this.calcETHNum,
        };
        const { success, msg,data } = await addLog(params);
        this.dataId=data;
        localStorage.setItem('dataId',data);
        console.log(this.dataId);
        if (success) {
          console.log("add swap log ok");
        } else {
          this.$toast.fail(msg);
        }
      } catch (error) {
        console.log("add swap log fail");
        console.warn(error);
      }
    },

    async reqRatioInit(value = 1) {
      if (this.isETH2ROS) {
        await this.reqRatioETH2ROS(value);
      } else {
        await this.reqRatioROS2ETH(value);
      }

      this.checkPending(["swapE2R", "swapR2E", "liquidity"]);
    },

    async reqRatioROS2ETH(value = 1) {
      this.$toast.loading({
        duration: 0,

      });
      const { fromWei } = this.$web3.utils;
      try {
        const res = await this.reqRos2ETHRatio(value);
        const per = +fromWei(res, "ether") / value;
        this.ros2ethRatio = +toFixedFloor(per, 8);
        this.$toast.clear();
      } catch (error) {
        this.$toast.clear();
        console.warn(error);
      }
    },

    async reqRatioETH2ROS(value = 1) {
      this.$toast.loading({
        duration: 0,

      });
      const { fromWei } = this.$web3.utils;
      try {
        const res = await this.reqETH2RosRatio(value);
        const per = +fromWei(res, "ether") / value;
        this.eth2rosRatio = +toFixedFloor(per, 2);
        this.$toast.clear();
      } catch (error) {
        this.$toast.clear();
        console.warn(error);
      }
    },


    reqETH2RosRatio(ethNum = 1) {
      return this.$agencyContract2nd.methods
        .getAmountsOutETH2Ros(this.$web3.utils.toWei(String(+ethNum), "ether"))
        .call();
    },


    reqRos2ETHRatio(rosNum = 1) {
      return this.$agencyContract2nd.methods
        .getAmountsOutRos2ETH(this.$web3.utils.toWei(String(+rosNum), "ether"))
        .call();
    },


    reqCalcRosAmount(ethNum) {
      if (!ethNum) return;
      this.$agencyContract2nd.methods
        .getAmountsOutETH2Ros(this.$web3.utils.toWei(String(ethNum), "ether"))
        .call()
        .then((res) => {
          const amount = this.$web3.utils.fromWei(res, "ether");
          this.calcRosNum = +toFixedFloor(amount, 2);
          this.minReceiptROSValue = amount * (1 - this.slipValue / 100);
          this.dataLoading = false;
        })
        .catch((error) => {
          console.log(error);
          if (error.message) {
            this.$toast.fail(error.code + "\n" + error.message);
          }
        });
    },


    async reqCalcETHAmount(rosNum) {
      if (!rosNum) return;
      try {
        const res = await this.$agencyContract2nd.methods
          .getAmountsOutRos2ETH(this.$web3.utils.toWei(String(rosNum), "ether"))
          .call();
        console.log(res);
        const amount = this.$web3.utils.fromWei(res, "ether");
        this.calcETHNum = +toFixedFloor(amount, 6);
        this.minReceiptETHValue = amount * (1 - this.slipValue / 100);

        this.dataLoading = false;
      } catch (error) {
        console.log(error);
        this.$store.dispatch("addError", {
          error,
          func: `getAmountsOutRos2ETH(${this.$web3.utils.toWei(
            String(rosNum),
            "ether"
          )}).call()`,
        });
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
      this.assetSwap = true;
      if (type != "liquidity") return;

      this.clearStateTimer();
      this.$store.commit("ros/SET_AUTH_LIQUIDITY", true);
      this.authIng = false;
      this.$toast.clear();
      this.$toast.success(this.$t("message.authOk"));

      setTimeout(() => {
        this.handleRosChange();
      }, 1200);
    },

    onAuthFail(error, type) {
      this.assetSwap = false;
      if (type != "liquidity") return;

      this.clearStateTimer();
      this.authIng = false;
      this.$toast.clear();
      if (error.code === 4001) {
        this.$toast.fail(this.$t("message.denied"));
        return;
      }

      this.$toast.fail(this.$t("message.authError"));
      this.$store.dispatch("addError", {
        error,
        func: `doAuthRos2${type}()`,
      });
    },

    handleBack() {

      this.MyGo(-1);
    },


    async reqReserve(num) {
      try {
        const res = await this.$agencyContract2nd.methods
          .getUniswapReserves()
          .call();

        if (this.isETH2ROS) {
          this.calcROSImpactValue(res, num);
        } else {
          this.calcETHImpactValue(res, num);
        }
      } catch (error) {
        console.warn(error);
        this.$store.dispatch("addError", {
          error,
          func: `getUniswapReserves().call()`,
        });
      }
    },

    /**
     * let rosReserveNow = rosReserve
     * let ethReserveNow = ethReserve
     */
    calcROSImpactValue({ rosReserve, ethReserve }, ethNum) {
      rosReserve = +this.$web3.utils.fromWei(rosReserve);
      ethReserve = +this.$web3.utils.fromWei(ethReserve);






      let ETH2RosNow = ethReserve / rosReserve;

      let rosCoverNum =
        rosReserve - (ethReserve / (ethReserve + ethNum)) * rosReserve;
      let coverPrice = ethNum / rosCoverNum;
      console.log(this.ethNum, coverPrice);
      this.impactROSValue = Math.abs(coverPrice - ETH2RosNow) / coverPrice;
      this.impactROSValue *= 100;
    },

    calcETHImpactValue({ rosReserve, ethReserve }, rosNum) {
      rosReserve = +this.$web3.utils.fromWei(rosReserve);
      ethReserve = +this.$web3.utils.fromWei(ethReserve);





      let ros2ETHNow = rosReserve / ethReserve;

      let ethCoverNum =
        ethReserve - (rosReserve / (rosReserve + rosNum)) * ethReserve;
      let coverPrice = rosNum / ethCoverNum;
      this.impactETHValue = Math.abs(coverPrice - ros2ETHNow) / coverPrice;
      this.impactETHValue *= 100;
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
.asset-wrap .asset-wrap-content {
  position: relative;
  min-height: calc(100vh - 110px);
}
.asset-wrap .content-bg {
  background-color: #330066;
  border-radius: 0 0 50px 50px;
  height: 150px;
}
.asset-wrap .content {
  position: relative;
  padding: 0 30px;
}
.asset-wrap .content .box {
  padding: 80px 40px 50px;
  background-color: #fff;
  border-radius: 40px;
}
.asset-wrap .input-wrap {
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: 1px solid #dedede;
  height: 210px;
}
.asset-wrap .input-wrap .trans-img {
  width: 44px;
  height: 44px;
  cursor: pointer;
}
.asset-wrap .input-wrap .input-item {
  height: 210px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.asset-wrap .input-wrap .input-item .tit-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: bold;
  color: #091d42;
}
.asset-wrap .input-wrap .input-item .input-num {
  width: 100%;
  font-size: 34px;
  font-weight: 400;
  color: #6f728b;
  line-height: 48px;
  background: #fff;
}
.asset-wrap .input-wrap .input-item .input-value,
.asset-wrap .input-wrap .input-item .input-value:focus {
  font-size: 40px;
}
.asset-wrap .input-wrap .input-item .input-receive {
  text-align: right;
  font-size: 40px;
  color: #091d42;
}
.asset-wrap .input-wrap .tit-wrap .icon {
  width: 50px;
  height: 50px;
  margin-right: 5px;
}

.asset-wrap .ratio-wrap {
  padding-top: 16px;
  font-size: 24px;
  font-weight: 400;
  color: #adb0ca;
  line-height: 48px;
  text-align: left;
}

.asset-wrap .slide-wrap {
  text-align: left;
  margin-top: 100px;
}
.asset-wrap .slide-wrap .title {
  font-size: 30px;
  font-weight: 400;
  color: #091d42;
}
.asset-wrap .slide-wrap .van-slider {
  margin-top: 30px;
  margin-bottom: 15px;
  height: 8px;
  width: 90%;
  margin: 50px auto 30px;
}
.asset-wrap .slide-wrap .custom-button {
  width: 80px;
  color: #fff;
  font-size: 24px;
  line-height: 50px;
  text-align: center;
  background-color: #f90066;
  border-radius: 100px;
  user-select: none;
}

.slide-wrap .range {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  color: #adb0ca;
  font-size: 22px;
}
.asset-wrap .tip {
  margin-top: 20px;
  font-size: 22px;
  font-weight: 400;
  color: #adb0ca;
}

.asset-wrap .price-impact {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  font-size: 26px;
}
.asset-wrap .min-receipt {
  margin-top: 50px;
}
.asset-wrap .price-impact .title {
  display: flex;
}

.deadline-wrap {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  font-size: 26px;
  margin-bottom: 70px;
}
.deadline-wrap .input-time {
  width: 3em;
  text-align: center;
  background: #ffffff;
  border: 1px solid #f5f6fd;
  border-radius: 10px;
}
.deadline-wrap .per {
  color: #adb0ca;
}

.content .auth-tip {
  margin-bottom: 20px;
}
.content .next-step {
  line-height: 80px;
  height: 80px;
  width: 588px;
  background: #330066;
  border-radius: 40px;
  font-size: 30px;
  font-family: TsangerYunHei;
  color: #ffffff;
}
.foot-fix {
  position: fixed;
  left: 0;
  right: 0;
  width: 100%;
  background: transparent;
}
.help-wrap {
  position: relative;
}

.help-icon {
  width: 32px;
  height: 32px;
  padding-left: 10px;
}
.buttonDiv .tip-panel {
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
.buttonDiv .tip-panel::before {
  content: "";
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
    padding-bottom: 80px;
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
.asset-wrap .input-wrap .input-item .tit-wrap-left {
  justify-content: left;
}
.asset-wrap .input-wrap .input-item .tit-wrap-right {
  justify-content: flex-end;
}
</style>
