<template>
  <div class="asset-home">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <HeaderFalco v-if="$store.state.bought" />
      <HeaderNoFalco v-else />
      <div class="content">
        <div class="asset-wrap">
          <div class="asset-title">{{ $t("index.assets") }}</div>
          <van-loading v-if="loading" />
          <div
            class="asset-fako asset-item"
            v-if="falcoBalance > 0"
            @click="handleAssetDetail('Falco')"
          >
            <img class="img" src="../assets/img/index/coin02.png" />
            <span class="name">Falco</span>
            <div class="value">
              <div class="val">{{ toFixedFloor(falcoBalance, 4) }}</div>
              <span><van-icon name="arrow" /></span>
            </div>
          </div>
          <div
            class="asset-rose asset-item"
            v-if="rFalcoBalance > 0"
            @click="handleAssetDetail('rFalco')"
          >
            <img class="img" src="../assets/img/index/coin02.png" />
            <span class="name">rFalco</span>
            <div class="value">{{ toFixedFloor(rFalcoBalance, 4) }}</div>
          </div>
          <!-- v-if="rosBalance > 0 || isBuildSwift" -->
          <!-- @click="handleAssetDetail('ROS')" -->
          <div class="asset-fako asset-item">
            <div class="navT" @click="handleAssetDetail('ROS')">
              <img class="img" src="../assets/img/index/coin01.png" />
              <span class="name">ROS</span>
              <div class="value">
                <div class="val">{{ toFixedFloor(rosBalance, 4) }}</div><span><van-icon name="arrow" /></span>
                <!-- <span class="titUsd" v-if="usdcNum>0"
                  >&asymp;${{ toFixedFloor(usdcNum, 4) }}</span
                > -->
              </div>
            </div>
            <div class="navRos">
              <router-link to="/swap?name=ROS">{{
                $t("index.swap")
              }}</router-link>
              <router-link to="/mining?name=ROS">{{
                $t("index.liquidity")
              }}</router-link>
            </div>
          </div>
          <div
            class="asset-fako asset-item"
            @click="handleAssetDetail('Swift')"
            v-if="swiftBalance > 0 || isBuildSwift"
          >
            <img class="img" src="../assets/img/index/coin-swift.png" />
            <span class="name">Swift</span>
            <div class="value">
              <div class="val">{{ toFixedFloor(swiftBalance, 4) }}</div>
              <span><van-icon name="arrow" /></span>
            </div>
          </div>
          <!-- <div class="empty-wrap" v-if="isShowAssetEmpty">
            <img
              class="img-empty"
              src="../assets/img/box/box-empty.png"
              alt=""
            />
            <p>{{ $t('asset.noAsset') }}</p>
          </div> -->
          <ShareSideBtn />
        </div>
        <!-- -->
        <div class="finance-wrap">
          <div class="finance-title">{{ $t("finance.title") }}</div>
          <!-- -->
          <!-- v-show="$store.state.bought" -->
          <div
            class="finance-item"
            @click="handleFinancial('/falco-mine')"
            v-show="userFalco.nowPrice > 0"
          >
            <div class="line line-1">
              <span class="item-title">{{ $t("kestrel.title") }}</span>
              <span class="item-value">
                ${{ toFixedFloor(userFalco.nowPrice || 0) }}
              </span>
            </div>
            <div class="line line-2">
              <span class="sub-tit">{{ $t("kestrel.subTitle") }}</span>
              <span class="bonus">
                {{ $t("finance.income") }}
                <i
                  class="diff red"
                  :class="{ down: userFalco.totalProfit < 0 }"
                >
                  {{ formatIncome(userFalco.totalProfit || 0) }}
                </i>
              </span>
            </div>
          </div>
          <!-- -->
          <div
            class="finance-item"
            @click="handleFinancial('/swift-mine')"
            v-show="isBuildSwift"
          >
            <div class="line line-1">
              <span class="item-title">{{ $t("swift.title") }}</span>
              <span class="item-value">
                ${{ toFixedFloor(userSwift.totalValue || 0) }}
              </span>
            </div>
            <div class="line line-2">
              <span class="sub-tit">{{ $t("swift.subTitle") }}</span>
              <span class="bonus">
                {{ $t("finance.income") }}
                <i
                  class="diff red"
                  :class="{ down: userSwift.totalProfit < 0 }"
                >
                  {{ formatIncome(userSwift.totalProfit || 0) }}
                  <!-- {{ formatIncome(userSwift.yesterdayProfit || 0) }} -->
                </i>
              </span>
            </div>
          </div>
          <!-- {{userFalco.nowPrice}} {{!isBuildSwift}} -->

          <div
            class="empty-wrap"
            v-if="userFalco.nowPrice <= 0 && !isBuildSwift"
          >
            <img
              class="img-empty"
              src="../assets/img/box/box-empty.png"
              alt=""
            />
            <p>{{ $t("message.noData") }}</p>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <div class="mobile">
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import Footer from "../components/index/AssetFooter.vue";
import HeaderNoFalco from "../components/index/AssetHeaderNoFalco.vue";
import HeaderFalco from "../components/index/AssetHeaderFalco.vue";
import ShareSideBtn from "../components/ShareSideBtn.vue";
import { toFixedFloor } from "@/tool/utils";
import { messageUnread } from "@/api/user";
import { userIsBuild } from "@/api/swift";
import mixinFalco from "./financial/mixinFalco";
import mixinSwift from "./financial/mixinSwift";

export default {
  name: "",
  mixins: [mixinFalco, mixinSwift],
  components: {
    Footer,
    HeaderNoFalco,
    HeaderFalco,
    ShareSideBtn,
  },
  data() {
    return {
      loading: false,
      refreshing: false,
      isBuildSwift: false,
      usdcNum: 0,
    };
  },
  computed: {
    rosBalance() {
      return +this.$store.state.asset.rosBalance;
    },
    swiftBalance() {
      return +this.$store.state.asset.swiftBalance;
    },
    falcoBalance() {
      return +this.$store.state.asset.falcoBalance;
    },
    rFalcoBalance() {
      return +this.$store.state.asset.rfalcoBalance;
    },
    isShowAssetEmpty() {
      return (
        this.rFalcoBalance <= 0 &&
        this.rosBalance <= 0 &&
        this.swiftBalance <= 0 &&
        this.falcoBalance <= 0 &&
        !this.isBuildSwift
      );
    },
  },
  created() {
    this.initInviter();
  },



  methods: {
    toFixedFloor,
    watchAddress() {},
    watchAuth() {


      this.isBuy();
      this.reqUserFalco();
    },

    watchToken() {

      this.reqUnreadMessages();
      this.reqUserSwift();
      this.reqBuildSwift();

      this.tt();
    },































   async tt() {

      console.log(this.rosBalance);
      let rosBalance = this.rosBalance;
      console.log(this.$store.state.asset.rosBalance);
      if (rosBalance <= 0) {
        return;
      }











      this.$agencyContract2nd.methods
        .getAmountsOutRos2ETH(
          this.$web3.utils.toWei(String(+rosBalance), "ether")
        )
        .call()
        .then((res) => {
          console.log(res);
          const amount = this.$web3.utils.fromWei(String(res), "ether");
          console.log(amount);
          this.$agencyContract2nd.methods
            .getAmountsOutETHForUSDC(
              this.$web3.utils.toWei(String(+amount), "ether")
            )
            .call()
            .then((res) => {
              console.log(res);
              const usdcNum = this.$web3.utils.fromWei(res, "mwei");
              console.log(usdcNum);
              this.usdcNum = usdcNum;
            });


        });






    },
    checkIsShowGuide() {
      if (this.$store.state.isShowGuide) {
        this.$router.replace({
          name: "Guide",
          query: this.$route.query,
          params: this.$route.params,
        });
      }
    },


    initInviter() {
      const blankAddress = "0x".padEnd(42, "0");
      const isAddress = this.$web3.utils.isAddress;
      if (isAddress(this.$route.query.inviter)) {
        this.$store.commit("setInviter", this.$route.query.inviter);
      } else if (!isAddress(this.$store.state.inviter)) {
        this.$store.commit("setInviter", blankAddress);
      } else {
        console.log("stay");
      }

      console.log("index inviter: ", this.$store.state.inviter);

      this.checkIsShowGuide();
    },

    hasInviter() {
      return (
        this.$store.state.inviter &&
        this.$store.state.inviter !==
          "0x0000000000000000000000000000000000000000"
      );
    },

    onRefresh() {
      if (this.refreshing) {
        this.refreshing = false;
      }



      this.reqUserFalco();
      this.reqUserSwift();
      this.reqBuildSwift();
      this.reqUnreadMessages();

      this.$store.dispatch("asset/initAsset");
    },


    async isBuy() {
      try {
        const res = await this.$agencyContract.methods
          .getTakePositionBalance(this.$store.state.address)
          .call();
        if (Number(res) > 0) {
          this.$store.commit("setIsBuy", true);

        } else {
          this.$store.commit("setIsBuy", false);
        }
      } catch (error) {
        console.log(error);
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
          this.isBuildSwift = +data > 0;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async reqUnreadMessages() {
      const params = {
        address: this.$store.state.address,
      };
      try {
        const { success, data } = await messageUnread(params);
        if (success) {
          this.$store.commit("setUnreadNum", data);
        }
      } catch (error) {
        console.warn(error);
        this.$store.dispatch("addError", {
          error,
          func: `/rosLog/message/hintTotal/${params.address}/0`,
        });
      }
    },
    handleAssetDetail(name) {
      this.$router.push({ path: "/asset", query: { name } });
    },
    handleFinancial(path) {
      this.$router.push(path);
    },
    formatIncome(num) {
      if (num === null || num === undefined) {
        return "/";
      }
      const pre = num > 0 ? "+" : num < 0 ? "-" : "";
      return pre + "$" + toFixedFloor(Math.abs(num), 2);
    },
  },
};
</script>

<style scoped>
.titUsd {
  color: #f90066;
}
::v-deep .van-grid-item__text {
  color: #646566;
  font-size: 12px;
  line-height: 1.5;
  word-break: break-all;
  width: 100%;
  padding-left: 20px;
  box-sizing: border-box;
}
.content {
  padding: 0 30px;
  padding-bottom: 220px;
}
.asset-wrap {
  position: relative;
  margin: 0 auto;
  margin-top: -150px;
  background: #fff;
  border-radius: 40px;
  box-sizing: border-box;
}
.asset-wrap .asset-title {
  font-size: 40px;

  color: #091d42;
  margin-bottom: 50px;
}
.navT {
  display: flex;
  width: 100%;
  align-items: center;
  padding-top: 20px;
}
.navRos {
  display: flex;
  justify-content: center;
  width: 100%;
}
.navRos a {
  display: inline-block;
  background: #ffffff;
  border: 2px solid #330066;
  border-radius: 60px;
  color: #330066;
  padding: 10px 20px;
  margin: 20px 10px;
  width: 38%;
  padding:15px 0px;
  font-size:26px ;
}
.asset-wrap .asset-item {
  display: flex;
  align-items: center;
  min-height: 134px;
  margin: 20px auto;
  background: #fafafc;
  border-radius: 20px;
  cursor: pointer;
  flex-wrap: wrap;
}
.asset-wrap .asset-item .img {
  margin-left: 30px;
  width: 60px;
  height: 60px;
}
.asset-wrap .asset-item .name {
  margin-left: 16px;
  font-size: 32px;
  color: #091d42;
}
.asset-wrap .asset-item .value {
  margin-left: auto;
  margin-right: 30px;
  text-align: right;
  font-size: 32px;
  color: #091d42;
  display: flex;
}
.asset-wrap .asset-item .value span{
  color: #ADB0CA;
  padding-top: 4px;
}
.asset-wrap .asset-item .dollar {
  font-size: 24px;
  color: #adb0ca;
}

.finance-wrap {
  position: relative;
  margin: 0 auto;
  margin-top: 30px;
  background: #fff;
  border-radius: 40px;
  box-sizing: border-box;
}
.finance-wrap .finance-title {
  font-size: 40px;

  color: #091d42;
  margin-bottom: 50px;
}
.finance-wrap .finance-item {
  min-height: 134px;
  margin: 20px auto;
  padding: 40px 30px;
  background: #fafafc;
  border-radius: 20px;
  font-size: 24px;
  color: #adb0ca;
  box-sizing: border-box;
  cursor: pointer;
}
.finance-wrap .finance-item .line {
  display: flex;
  justify-content: space-between;
}
.finance-wrap .finance-item .item-title {
  font-size: 40px;
  font-weight: 500;
  color: #091d42;
}
.finance-wrap .finance-item .item-value {
  font-size: 40px;
  font-weight: 500;
  color: #091d42;
}
.finance-wrap .finance-item .diff {
  font-style: normal;
}
.finance-wrap .finance-item .sub-tit {
  font-size: 24px;
  flex: 2;
  text-align: left;
}
.finance-wrap .finance-item .bonus {
  font-size: 24x;
  flex: 1;
  text-align: right;
}
.empty-wrap {
  color: #adb0ca;
}
.empty-wrap .img-empty {
  width: 320px;
  margin: 0 auto;
}
.link-wrap {
  position: sticky;
  right: 40px;
  bottom: 180px;
  margin-top: -40px;
  margin-left: auto;
  width: 142px;
  height: 158px;
  background: #fff;
  border-radius: 20px;
  border: 1px solid #fafafc;
  cursor: pointer;
}
.link-wrap img {
  width: 98px;
  height: 71px;
  margin: 13px auto;
}
.link-wrap p {
  font-size: 24px;
  color: #091d42;
  line-height: 1;
  text-align: center;
}
.copy-right-text {
  margin-top: 30px;
  margin-bottom: 40px;
  color: #adb0ca;
}
@media only screen and (max-width: 750px) {
  .asset-home {
    background: #fafafc;
    font-family: TsangerYunHei;
  }
  .asset-wrap {
    position: relative;
    padding: 64px 30px 30px;
    margin-left: auto;
    margin-right: auto;
    margin: 0 auto;
    margin-top: -130px;
    background: #fff;
    border-radius: 40px;
    box-sizing: border-box;
  }
  .finance-wrap {
    padding: 64px 30px 30px;
  }
  .copy-right-text {
    margin-bottom: 200px;
  }
  .van-pull-refresh {
    min-height: 100vh;
  }
}
@media only screen and (min-width: 751px) {
  .asset-home {
    background: #fafafc;
    font-family: TsangerYunHei;
  }
  .asset-wrap {
    position: relative;
    padding: 0 30px;
    width: 1000px;
    padding-bottom: 80px;
    margin: 0 auto;
    margin-top: -80px;
    padding-top: 64px;
    background: #fff;
    border-radius: 40px;
  }
  .asset-wrap .share-side-btn {
    bottom: 100px;
  }
  .asset-wrap .asset-title {
    font-size: 40px;

    color: #091d42;
    margin-bottom: 40px;
  }
  .finance-wrap {
    width: 1000px;
    padding: 64px 30px 30px;
  }
}
</style>
