<template>
  <div class="asset-wrap">
    <TheHeader :title="$t('finance.autoBank')" @click-left="handleBack" />
    <div class="asset-wrap-content">
      <div class="content-bg mobile"></div>
      <div class="content">
        <section class="panel panel-tab">
          <p class="vs-title">{{ $t("finance.hisTitle") }}</p>
          <div class="vs-panel">
            <div class="left">
              <div class="value red">426.00%</div>
              <div class="tit">
                {{ $t("finance.aiFund") }}
              </div>
            </div>
            <div class="right">
              <div class="value red">51.00%</div>
              <div class="tit">
                {{ $t("finance.normalFund") }}
              </div>
            </div>
          </div>
        </section>

        <section class="panel panel-amount">
          <div class="title">{{ $t("finance.autoAmount") }}</div>
          <div class="input-item">
            <input
              v-model="ethNum"
              type="number"
              class="input-num"
              autofocus
              @focus="inputFocus = true"
              @blur="inputFocus = false"
              oninput="if(value.length>16)value=value.slice(0,16)"
              placeholder=""
            />
            <span class="unit">ETH</span>
          </div>
          <div class="toket-item">
            <img class="icon-qb" src="@/assets/img/icon-qb.png" />
            <span>{{ ethBalance }}</span>
          </div>
          <div class="tip-item">
            <p class="available tip-line">
              {{ $t("finance.availableAmount") }}<span class="feeTit">{{inputMaxETH}}</span> ETH
            </p>
            <p class="fee tip-line">
              {{ $t("finance.charge") }}
              <span class="feeTit">
                {{ ethFee }} ETH
                <span v-if="isUseRos">&asymp; {{ rosFee }}ROS</span></span
              >. It will be deducted directly from the amount
              <!-- <i
                class="help-wrap"
                @mouseover.stop="showFeeTip = true"
                @mouseout.stop="showFeeTip = false"
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
                <div class="tip-panel" v-show="showFeeTip">
                  {{ $t('finance.chargeRatio') }}
                  <span class="red">1.5%</span>
                  {{ $t('finance.chargeRatioDesc') }}
                </div>
              </i> -->
            </p>
            <!-- <p class="charge-ratio tip-line">
              {{ $t('finance.chargeRatio') }}
              <span class="red">1.5%</span>
              {{ $t('finance.chargeRatioDesc') }}
            </p> -->
          </div>
          <div class="switch-item ros-item">
            <div class="switch-wrap">
              <span class="desc">{{ $t("finance.useRosDesc") }}</span>
              <van-switch
                class="switch"
                active-color="rgba(51, 0, 102, 0.6)"
                inactive-color="rgba(51, 0, 102, 0.6)"
                size="20px"
                @change="handleSwitchChange"
                :disabled="!isAgreed"
                v-model="isUseRos"
              />
            </div>
            <div class="use-ros-tip" v-if="!isUseRos && !isAuthSchedule">
              <span>{{ $t("index.authorize") }}</span>
            </div>
            <div class="tt-wrap">
              The purchase of Swift Fund needs to pledge governance token (ROS).
              According to the current pledge ratio (1:{{ ethRate }}),
              <span>{{ toFixedFloor(rosPledge) }} ROS</span> needs to be
              pledged. After 30 days, you can release it.
            </div>
            <!-- {{rosLink}} {{!isAuthSchedule}} -->
              <!-- {{rosBalance}} {{rosFee}}   -->
            <!-- {{this.rosBalance-this.rosFee}} -->
            <div class="tt-tit" v-if="this.rosBalance-this.rosFee-this.rosPledge<=0 ">
              <span class="feeTit">Insufficient ROS balance</span> <router-link class="tt-tit-link" to='/swap?name=ROS'>swap </router-link>
            </div>
            <!-- <router-link class="tt-tit-link" to='/swap?name=ROS'>swap now</router-link> -->
            <!-- <div class="tt-tit" v-if="this.rosBalance-this.rosFee<0">Insufficient ROS balance, <span>swap now</span></div> -->
            <!-- <div class="switch-tip" v-if="isUseRos">
              <span>{{ $t('finance.charge') }}</span>
              <span class="red">{{ rosFee }} ROS</span>
            </div> -->
            <!-- <div class="use-ros-tip" v-if="!isUseRos && !isAuthSchedule">
              <span>{{ $t('index.authorize') }}</span>
            </div> -->
          </div>
        </section>

        <section class="panel-protocol">
          <p class="risk-tip protocol-tip" :class="{ on: isAgreed }">
            <span class="handler" @click="handleAgreeProtocol">{{
              $t("finance.protocol1")
            }}</span>
            <a
              href="javascript:void(0);"
              class="link"
              @click.stop="$refs.dialogProtocol.show()"
            >
              {{ $t("finance.protocol2") }}
            </a>
            {{ $t("finance.protocol3") }}
          </p>
          <p class="risk-tip service-tip">
            <span class="handler">{{ $t("finance.makeSureBefore1") }}</span
            ><br />
            <a
              href="javascript:void(0);"
              class="link"
              @click.stop="handleDetail"
            >
              {{ $t("finance.makeSureBeforeService") }}
            </a>
            {{ $t("finance.makeSureBefore2") }}
            <a
              href="javascript:void(0);"
              class="link"
              @click.stop="$refs.dialogRisk.show()"
            >
              {{ $t("finance.makeSureBeforeRisk") }}
            </a>
            {{ $t("finance.makeSureBefore3") }}
          </p>
        </section>

        <!-- <p class="auth-tip tip" v-if="isShowAuth">
          {{ $t('message.authTip') }}
        </p> -->
        <!-- v-if="isShowAuth" -->
        <!-- {{isShowAuth}} -->
        <div
          class="buttonDiv"
         v-if="isShowAuth"
          :class="{ buttonDiv1: !isShowAuth }"
        >
          <button
            class="btn btnAuth btn-dark btn-sure"
            :disabled="!isShowAuth"
            @click="handleAuth"
          >
            <p v-if="isShowAuth">Allow Rosefintech to call your ROS</p>
            <p v-else>You can purchase now</p>
            <!-- {{ $t('index.authorize') }} -->
          </button>
          <span  v-if="isShowAuth"
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

        <div
          class="buttonDiv buttonDiv1"
         v-if="isBuildSwift"

        >
          <button
            class="btn btnAuth btn-dark btn-sure"
             disabled="true"
            @click="handleAuth"
          >

            <p >You can purchase now</p>
            <!-- {{ $t('index.authorize') }} -->
          </button>

        </div>
        <!-- {{isShowAuth}} -->
        <!-- @click="handleBuilding" -->
        <button

          class="btn btn-dark btn-sure"
          :disabled="+ethNum <= 0 || feeLoading || !buildAddress || !isAgreed || isShowAuth"
          @click="handleSure()"
        >
        <span v-if="this.ethNum<=0">Enter Amount</span>
        <span v-else>{{ $t("index.confirm") }}</span>

        </button>
        <p class="auth-tip tip" v-if="isShowAuth">
          {{ $t("message.authTip") }}
        </p>

        <div class="footer">
          <p v-html="$t('finance.finanOperator')"></p>
        </div>

        <ShareSideBtn />
      </div>
    </div>
    <DialogProtocol ref="dialogProtocol" />
    <DialogRisk ref="dialogRisk" />
    <DialogAutoFund
      ref="dialogOpenFund"
      :rosPledge="rosPledge"
      :eth2rosRate="ethRate"
      @open="handleSure"
    />
    <DialogPositionBuildingOk ref="dialogBuildingOk" />
  </div>
</template>

<script>
import ShareSideBtn from "@/components/ShareSideBtn.vue";
import DialogProtocol from "@/components/financial/DialogProtocol.vue";
import DialogRisk from "@/components/financial/DialogRisk.vue";
import DialogAutoFund from "@/components/financial/DialogAutoFund.vue";
import DialogPositionBuildingOk from "@/components/financial/DialogPositionBuildingOk.vue";
import { userIsBuild } from "@/api/swift";
import {
  toFixedFloor,
  toFixedFloorPercent,
  debounce,
  Mul,
  Div,
} from "@/tool/utils";
import { buildAddress } from "@/api/swift";
import { addBuildInvitation } from "@/api/user";


export default {
  name: "",
  components: {
    ShareSideBtn,
    DialogPositionBuildingOk,
    DialogAutoFund,
    DialogProtocol,
    DialogRisk,
  },
  data() {
    return {
      showIncomeTip: false,
      showTrendTip: false,
      ethNum1: 0,
      ethInput: null,
      rosLink:false,
      ethNum: null,
      isUseRos: false,
      eth2rosRate: 0,
      eth2rosNum: 0,
      eth2usdcNum: 0,
      eth2usdcRate: 0,
      ethBalance: 0,
       isBuildSwift:false,
      feeRatio: 0.015,
      erc20Contract: "",
      inputFocus: false,
      holdEthNum: 0,
      maxETH: 3,
      minETH: 0.2,
      fundAvailableETH: 0,
      privateAvailabelETH: 0,
      showFeeTip: false,
      feeLoading: false,
      buildAddress: "",
      buildIng: false,
      authIng: false,
      isAgreed: true,
    };
  },
  computed: {



    address() {
      return this.$store.state.address;
    },
    inviterAddress() {
      return this.$store.state.inviter;
    },
    elliAddress() {
      return this.address.slice(0, 10) + "......" + this.address.slice(32, 42);
    },
    ethFee() {

      return Mul(+this.ethNum || 0, this.feeRatio);
    },
    rosFee() {

      console.log(this.ethFee);
      if (this.ethFee === 0) {
        console.log(this.ethNum);
        return Mul(0, this.feeRatio * 0.8);
      } else {
        console.log(this.ethNum);
        return Mul(this.eth2rosNum || 0, this.feeRatio * 0.8);
      }
    },
    rosPledge() {

      return Mul(
        Math.min(+this.eth2rosNum, +this.eth2usdcNum),
        1 - this.feeRatio
      );
    },
    ethRate() {
      if (Math.min(this.eth2rosRate, this.eth2usdcRate) > 0) {
        return Math.min(this.eth2rosRate, this.eth2usdcRate);
      } else {
        return 1;
      }
    },
    rosBalance() {
      return +this.$store.state.asset.rosBalance;
    },


    inputMaxETH() {
      return Math.min(this.privateAvailabelETH, this.fundAvailableETH);
    },
    isAuthSchedule() {
      return this.$store.state.ros.isAuthSchedule;
    },
    isAuthRosManagement() {
      return this.$store.state.ros.isAuthRosManagement;
    },
    isShowAuth() {
      return !this.isAuthRosManagement;
    },
    swiftAddress() {
      return (this.$store.state.asset.swiftAddress || "").toLowerCase();
    },







  },
  watch: {
    ethNum(value) {

      console.log("ethNum", value);
      this.feeLoading = true;

      if (this.inputFocus && +value > 0) {
        this.handleETHChange();
      }
    },
  },



  created() {



  },

  methods: {
    toFixedFloor,
    toFixedFloorPercent,
    watchAddress() {
      console.log("watch address");
      this.reqETHBalance();
      this.reqPersonAvailable();
      this.reqFundAvailable();

    },

    async watchAuth() {
      await this.reqBuildAddress();


      this.checkPending(["openPosition", "rosManagement", "schedule"]);

    },
        watchToken() {



      this.reqBuildSwift();


    },





    async reqBuildAddress() {
      try {
        this.$toast.loading();
        const { data, msg } = await buildAddress();
        if (data) {
          this.buildAddress = data;
        } else {
          this.$toast.fail(msg);
        }
        this.$toast.clear();
      } catch (error) {
        console.log(error);
        this.$toast.clear();
        this.$store.dispatch("addError", {
          error,
          func: `/assets/build/contract`,
        });
      }
    },
  async reqBuildSwift() {
      try {
        const params = {
          userAddress: this.$store.state.address,
        };
        const { success, data } = await userIsBuild(params);
        console.log(data)
        if (success) {

          console.log(this.isBuildSwift)
        }
      } catch (error) {
        console.log(error);
      }
    },


    async handleAuth() {
      if (!this.address) {
        this.$toast.fail(this.$t("message.noAuth"));
        return;
      }

      if (this.authIng) return;
      this.authIng = true;

      this.doAuthRos2ROSManagement();
    },


    async handleSwitchChange() {
      if (!this.address) {
        this.$toast.fail(this.$t("message.noAuth"));
        return;
      }
      if (!this.isAgreed) return;
      if (this.isAuthSchedule) return;

      if (this.authIng) return;
      this.authIng = true;

      this.doAuthRos2Schedule();
    },

    onAuthOK(type) {
      this.isBuildSwift=true
      console.log("onAuthOK", type);
      this.clearStateTimer();
      this.authIng = false;
      if (type === "schedule") {
        this.onAuthSchduleOK();
      } else if (type === "rosManagement") {
        this.onAuthRosManagementOK();
      }
    },

    onAuthFail(error, type) {
      console.log("onAuthFail", type);
      this.isBuildSwift=false
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
      if (type === "schedule") {
        this.onAuthSchduleFail();
      } else if (type === "rosManagement") {
        this.onAuthRosManagementFail();
      }
    },

    onAuthSchduleOK() {
      if (this.isAuthSchedule) return;

      this.$store.commit(`ros/SET_AUTH_SCHEDULE`, true);

      this.$toast.clear();
      this.$toast.success(this.$t("message.authOk"));

      setTimeout(async () => {
        await this.reqETHBalance();
        if (+this.ethNum > 0) {
          this.handleETHChange();
        }
      }, 1200);
    },

    onAuthSchduleFail() {
      this.isUseRos = false;
    },

    onAuthRosManagementOK() {
      if (this.isAuthRosManagement) return;

      this.$store.commit("ros/SET_AUTH_ROSMANAGEMENT", true);

      this.authIng = false;
      this.$toast.clear();
      this.$toast.success(this.$t("message.authOk"));

      setTimeout(async () => {
        await this.reqETHBalance();
        if (+this.ethNum > 0) {
          this.handleETHChange();
        }
      }, 1200);
    },

    onAuthRosManagementFail() {
      this.authIng = false;
    },


    async reqETH2RosRatio(ethNum = 1) {
      const { toWei, fromWei } = this.$web3.utils;
      try {
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
        });
        this.feeLoading = true;
        const res = await this.$agencyContract2nd.methods
          .getAmountsOutETH2Ros(toWei(String(+ethNum), "ether"))
          .call();
        const rosNum = fromWei(res);
        this.eth2rosNum = toFixedFloor(rosNum);
        this.eth2rosRate = toFixedFloor(Div(rosNum, ethNum));
        console.log("getAmountsOutETH2Ros", this.eth2rosNum, this.eth2rosRate);
        const plg = await this.$agencyContract2nd.methods
          .getAmountsOutETHForUSDC(toWei(String(+ethNum), "ether"))
          .call();
        const usdcNum = fromWei(plg, "mwei");
        this.eth2usdcNum = toFixedFloor(usdcNum);
        this.eth2usdcRate = toFixedFloor(Div(usdcNum, ethNum));
        console.log(
          "getAmountsOutETHForUSDC",
          this.eth2usdcNum,
          this.eth2usdcRate
        );

        this.$toast.clear();
        this.feeLoading = false;
      } catch (error) {
        console.warn(error);
        this.feeLoading = false;
        this.$toast.clear();
        this.$store.dispatch("addError", {
          error,
          func: `getAmountsOutETH2Ros(${toWei(
            String(+ethNum),
            "ether"
          )}).call()`,
        });
      }
    },


    async reqETHBalance() {
      try {
        const { fromWei } = this.$web3.utils;
        const ethWei = await this.$web3.eth.getBalance(this.address);
        this.ethBalance = +toFixedFloor(fromWei(ethWei, "ether"), 4);
        console.log("ethBalance", this.ethBalance);
      } catch (error) {
        console.warn(error);
        this.$store.dispatch("addError", {
          error,
          func: `web3.eth.getBalance(${this.address})`,
        });
      }
    },

    async reqPersonAvailable() {
      try {
        const BN = this.$web3.utils.BN;

        const personMax = await this.$agencyContract2nd.methods
          .getPositionMemberMaxValue()
          .call();

        const cur = await this.$agencyContract2nd.methods
          .getPositionValue(this.address)
          .call();
        const avaiWei = new BN(personMax).sub(new BN(cur)).toString(10);
        this.privateAvailabelETH = +this.$web3.utils.fromWei(avaiWei);
        console.log("个人剩余额度：", this.privateAvailabelETH);
      } catch (error) {
        console.warn(error);
        this.$store.dispatch("addError", {
          error,
          func: `getPositionMemberMaxValue().call() + getPositionValue(${this.address}).call()`,
        });
      }
    },

    async reqFundAvailable() {
      try {
        const BN = this.$web3.utils.BN;

        const { _max, _total } = await this.$agencyContract2nd.methods
          .getTotalMaxValueAndPositionValue()
          .call();
        const avaiWei = new BN(_max).sub(new BN(_total)).toString(10);
        this.fundAvailableETH = +this.$web3.utils.fromWei(avaiWei);
        console.log("基金总剩余额度：", this.fundAvailableETH);
      } catch (error) {
        console.warn(error);
        this.$store.dispatch("addError", {
          error,
          func: "getTotalMaxValueAndPositionValue().call()",
        });
      }
    },

    handleETHChange() {



      if (+this.ethNum > this.inputMaxETH) {
        this.ethNum = this.inputMaxETH;
        this.$toast.fail(this.$t("asset.maxTo") + this.ethNum + " ETH");
      }
      if (!this.debounceE2RRatio) {
        this.debounceE2RRatio = debounce(this.reqETH2RosRatio, 800);
      }
      this.debounceE2RRatio(+this.ethNum);
    },

    hasInviter() {
      return (
        this.inviterAddress &&
        this.inviterAddress !== "0x0000000000000000000000000000000000000000"
      );
    },

    handleBuilding() {
      if (!this.isAgreed) return;
      if (!this.ethNum || +this.ethNum <= 0) {
        return this.$toast.fail(this.$t("asset.inputETH"));
      }

      if (+this.ethNum > this.ethBalance) {
        return this.$toast.fail(
          this.$t("message.ETHDeficiency") + ": " + this.ethBalance + " ETH"
        );
      }







      console.log("inviter: ", this.hasInviter(), this.inviterAddress);


      const minRos = this.isUseRos
        ? this.rosPledge + this.rosFee
        : this.rosPledge;
      if (this.rosBalance < minRos) {
        return this.$toast.fail(this.$t("finance.rosLessThan") + minRos);
      }


      this.$refs.dialogOpenFund.show();
    },


    async handleSure() {
  if (!this.isAgreed) return;
      if (!this.ethNum || +this.ethNum <= 0) {
        return this.$toast.fail(this.$t('asset.inputETH'));
      }

      if (+this.ethNum > this.ethBalance) {

          return this.$toast.fail(this.$t('message.ETHDeficiency') + ': ' + this.ethBalance + ' ETH');

      }







      console.log('inviter: ', this.hasInviter(), this.inviterAddress);


      const minRos = this.isUseRos
        ? this.rosPledge + this.rosFee
        : this.rosPledge;
      if (this.rosBalance < minRos) {
        this.rosLink=true;





        return this.$toast.fail({
          duration: 5000,
          message:this.$t('finance.rosLessThan') + minRos
          }
        );
      }


      console.log(this.rosBalance)



      if (this.buildIng) return;
      this.buildIng = true;

      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: this.$t("message.handling"),
      });
      let params = [this.buildAddress, this.isUseRos];
      let gasLimit = 400000;
      if (this.hasInviter()) {
        params.unshift(this.inviterAddress);
        gasLimit = 420000;
      }
      try {

        const gas = await this.$agencyContract2nd.methods
          .takePosition(...params)
          .estimateGas({
            from: this.$store.state.address,
            value: this.$web3.utils.toWei(String(+this.ethNum)),
          });

        gasLimit = Math.floor(gas * 1.05);
        console.log("estimateGas", gas, gasLimit);
      } catch (error) {
        console.warn(error);
        this.$toast.clear();
        console.log(23);
        this.$toast.fail(this.$t("message.paymentError"));
        return;
      }

      let txHash = "";
      try {
        console.log("params ", ...params, gasLimit);
        const res = await this.$agencyContract2nd.methods
          .takePosition(...params)
          .send({
            from: this.$store.state.address,
            value: this.$web3.utils.toWei(String(+this.ethNum)),
            gas: gasLimit,
          })
          .on("transactionHash", (hash) => {
            txHash = hash;
            this.addInvitation(hash);
            this.startCheckState(hash, "openPosition");
          });

        console.log("open res", res);
        this.removeByTxHash(txHash);
        this.onSendOK(res, "openPosition");
      } catch (error) {
        this.removeByTxHash(txHash);
        this.onSendFail(error, "openPosition");
      }
    },

    onSendFail(error, type) {
      if (type != "openPosition") return;

      this.clearStateTimer();
      this.buildIng = false;
      this.$toast.clear();
      if (error.code === 4001) {
        this.$toast.fail(this.$t("message.denied"));
        return;
      }

      this.$toast.fail(this.$t("message.handleError"));

      let params = [this.buildAddress, this.isUseRos];
      if (this.hasInviter()) {
        params.unshift(this.inviterAddress);
      }
      const sendParams = JSON.stringify({
        from: this.$store.state.address,
        value: this.$web3.utils.toWei(String(+this.ethNum)),
      });
      this.$store.dispatch("addError", {
        error,
        func: `takePosition(${params}).send(${sendParams})`,
      });
    },

    onSendOK(receipt, type) {
      console.log("auto fund onSenOK");
      if (type != "openPosition") return;

      this.clearStateTimer();
      this.buildIng = false;
      this.$toast.clear();
      this.$toast.success(this.$t("message.handleOK"));

      this.watchAddress();

      this.ethNum = null;

      this.$store.dispatch("asset/initAsset");

      this.handleBuildingSuccess(receipt);
    },

    async handleBuildingSuccess(data) {
      try {
        const { fromWei } = this.$web3.utils;
        const isLogs = !!data.logs;
        const list = isLogs ? data.logs : data.events;
        if (!this.swiftAddress) {
          await this.$store.dispatch("asset/getTokenAddress", "Swift");
        }

        let swiftNum = 0;

        for (let key of Object.keys(list)) {
          const addr = list[key].address.toLowerCase();
          if (addr === this.swiftAddress) {
            if (isLogs) {
              swiftNum = fromWei(String(Number(list[key].data)));
            } else {
              swiftNum = fromWei(String(Number(list[key].raw.data)));
            }
            break;
          }
        }
        console.log("swiftNum", swiftNum);
        if (this.$refs.dialogBuildingOk) {
          this.$refs.dialogBuildingOk.show(toFixedFloor(swiftNum, 4));
        }
      } catch (error) {
        console.warn(error);
      }
    },

    async addInvitation(hash) {
      const data = {
        hash,
        inviter: this.inviterAddress,
        invitee: this.address,
        time: Date.now(),
      };
      try {
        const { success } = await addBuildInvitation(data);
        if (success) {
          console.log("发送成功");
        }
      } catch (error) {
        console.warn(error);
        this.$store.dispatch("addError", {
          error,
          func: `/dapp/invitation(${JSON.stringify(data)}))`,
        });
      }
    },

    formatRatio(num) {
      if (num == 0) {
        return "/";
      }
      const pre = num > 0 ? "+" : "";
      return pre + toFixedFloor(num, 2) + "%";
    },
    handleAgreeProtocol() {
      this.isAgreed = !this.isAgreed;

    },
    handleBack() {

      this.MyGo(-1);

    },
    handleDetail() {
      this.$router.replace("/swift-detail");
    },
  },
};
</script>

<style scoped>
.tt-tit-link {
  display: inline-block;
}
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
.toket-item {
  display: flex;
  align-items: center;
}
.toket-item span {
  color: #adb0ca;
  font-size: 26px;
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

::v-deep .van-switch {
  position: relative;
  display: inline-block;
  box-sizing: content-box;
  width: 2em;
  height: 0.5em;
  font-size: 30px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1em;
  cursor: pointer;
  -webkit-transition: background-color 0.3s;
  transition: background-color 0.3s;
}
::v-deep .van-switch__node {
  position: absolute;
  top: -0.25em;
  left: -0.1rem;
  width: 1em;
  height: 1em;
  background: #330066;
  background-color: #330066;
  border-radius: 100%;
  box-shadow: 0 3px 1px 0 rgb(0 0 0 / 5%), 0 2px 2px 0 rgb(0 0 0 / 10%),
    0 3px 3px 0 rgb(0 0 0 / 5%);
  -webkit-transition: -webkit-transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
  transition: -webkit-transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
  transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
  transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05),
    -webkit-transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
}
::v-deep .van-switch--on .van-switch__node {
  -webkit-transform: translateX(1em);
  transform: translateX(1.21em);
}
.feeTit {
}
.icon-qb {
  margin-right: 20px;
  width: 40px;
}
.tt-tit {
  margin-top: 20px;
  font-size: 26px;
  font-family: TsangerYunHei;
  font-weight: normal;
  color: #adb0ca;
}
.tt-tit a {
}
.tt-tit-link {
  display: inline-block;
  border: solid 2px #330066;
  padding: 6px 15px;
  border-radius: 40px;
  color: #330066;
}
.tt-wrap {
  font-size: 26px;
  font-family: TsangerYunHei;
  font-weight: normal;
  color: #adb0ca;
  text-align: justify;
  margin-top: 30px;
}
.tt-wrap span {
  color: #f90066;
}
.asset-wrap .asset-wrap-content {
  position: relative;
  padding-bottom: 70px;
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
  padding: 40px;
  background-color: #fff;
  border-radius: 40px;
  text-align: left;
  margin-bottom: 30px;
}
.asset-wrap .content .panel .red {
  color: #f90066;
}
.asset-wrap .content .panel .title-min {
  font-size: 28px;

  color: #adb0ca;
}

.panel-tab .title {
  font-size: 30px;

  color: #091d42;
}
.panel-tab .desc {
  font-size: 24px;
  font-weight: 400;
  color: #091d42;
  margin-top: 20px;
}
.panel-tab .vs-title {
  font-size: 28px;
  font-weight: 400;
  color: #adb0ca;
  /* margin-top: 30px; */
  margin-bottom: 20px;
}
.vs-panel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 146px;
  background: #f7f7f7;
  border-radius: 10px;
  overflow: hidden;
  background: url(../../assets/img/financial/bg-vs.png) no-repeat;
  background-size: 100%;
  background-position: center;
}
/* .vs-panel::before {
  content: '';
  position: absolute;
  right: 50%;
  top: 0;
  transform: skewX(-15deg);
  width: 60%;
  height: 100%;
  border-right: 8px solid #fff;
  background-color: #f6eefe;
} */
.vs-panel .left,
.vs-panel .right {
  flex: 1;
}
.vs-panel .left {
  margin-right: 70px;
}
.vs-panel .value {
  position: relative;
  font-size: 50px;
  font-weight: bold;
  color: #f90066;
  line-height: 1;
  text-align: center;
}
.vs-panel .tit {
  position: relative;
  text-align: center;
}

.panel-amount {
  margin-top: 30px;
}
.panel-amount .title {
  font-size: 30px;
  color: #adb0ca;
}
.panel-amount .input-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f5f6fd;
  font-size: 40px;
  font-weight: 500;
  color: #adb0ca;
  margin-top: 40px;
  margin-bottom: 20px;
}
.panel-amount .input-item .input-num {
  flex: 1;
  width: 100%;
}

.panel-amount .tip-item {
  font-size: 26px;
  font-weight: 400;
  color: #adb0ca;
  line-height: 30px;
  margin-bottom: 30px;
}
.panel-amount .tip-item .tip-line {
  margin-top: 10px;
}
.panel-amount .tip-item .fee {
  display: block;
}
.feeTit {
  color: #f90066;
}
.panel-amount .switch-item {
  margin-top: 40px;
  font-size: 22px;
}
.panel-amount .switch-wrap {
  display: flex;
  align-items: center;
}
.panel-amount .switch-wrap .desc {
  flex: 1;
  font-size: 28px;
  color: #adb0ca;
}
.panel-amount .switch-tip {
  font-size: 22px;
  font-weight: 400;
  color: #adb0ca;
  margin-top: 10px;
  transition: 0.2 all;
}
.panel-amount .exchange {
  margin-left: 1.5em;
}
.panel-amount .use-ros-tip {
  text-align: right;
  color: #adb0ca;
}

.panel-protocol {
  margin-top: 20px;
  margin-bottom: 70px;
}
.asset-wrap .risk-tip {
  position: relative;
  margin-top: 20px;
  font-size: 24px;
  font-weight: 400;
  color: #adb0ca;
  text-align: left;
  padding-left: 30px;
}
.asset-wrap .protocol-tip {
  padding-left: 40px;
}
.asset-wrap .protocol-tip::before {
  content: "";
  position: absolute;
  left: 0;
  top: 4px;
  display: block;
  width: 24px;
  height: 24px;
  border: 2px solid #330066;
  border-radius: 6px;
}
.asset-wrap .protocol-tip.on::before {
  border: 2px solid #330066;
  background: #330066;
  border-radius: 5px;
}
.asset-wrap .protocol-tip::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 10px;
  display: block;
  width: 12px;
  height: 6px;
  border-left: 4px solid #fff;
  border-bottom: 4px solid #fff;
  transform: rotate(-45deg);
}
.asset-wrap .service-tip {
  text-align: left;
}
.asset-wrap .risk-tip .link {
  color: #5c31c6;
}
.asset-wrap .risk-tip .handler {
  position: relative;
  cursor: pointer;
  z-index: 10;
}
.asset-wrap .risk-tip .handler::before {
  content: "";
  position: absolute;
  left: -40px;
  top: 0;
  display: block;
  width: 40px;
  height: 40px;
}
.asset-wrap .auth-tip {
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: 400;
  color: #adb0ca;
}
.asset-wrap .btn-sure {
  width: 587px;
  /*
}

.asset-wrap .footer {
  margin-top: 100px;
  font-size: 22px;
  font-weight: 400;
  color: #adb0ca;
}
.help-wrap {
  position: relative;
}

.help-icon {
  width: 32px;
  height: 32px;
  padding-left: 10px;
}
.buttonDiv2 {
  background: #ffffff;
  border: 2px solid #330066;
  color: #330066;
}
.buttonDiv2 botton {
  background: #ffffff;
  color: #330066;
}
.buttonDiv2 .btn-dark[disabled],
.buttonDiv2 .btn-dark.disabled {
  border: 0.02667rem solid #fff !important;
  background: #fff !important;
  color: #330066 !important;
  opacity: 1 !important;
}
.buttonDiv .tip-panel {
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
@media only screen and (max-width: 750px) {
  .asset-wrap .content {
    padding: 0 30px 50px;
    margin-left: auto;
    margin-right: auto;
  }
}
@media only screen and (min-width: 751px) {
  .asset-wrap .content {
    padding: 0;
    width: 1000px;
    margin-top: 52px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
