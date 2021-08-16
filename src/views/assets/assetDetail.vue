<template>
  <div class="asset">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      :disabled="isPc"
    >
      <TheHeader :title="$route.query.name" @click-left="handleBack" />
      <div class="asset-content">
        <div class="bg-box">
          <div class="user-info">
            <p class="coin">{{ formatNumber(tokenBalance) }}</p>
            <Copy
              :content="this.$store.state.address"
              class="list-item"
              @copyCallback="copyCallback"
            >
              <p class="address-line">
                {{ addressChanges(address) }} <i class="copy-icon"></i>
              </p>
            </Copy>
          </div>
          <AssetHandleButtonsPC :name="tokenName" v-if="tokenName != 'Swift'" />
        </div>
        <AssetLogsPanel
          ref="logsPanel"
          :tokenName="tokenName"
          :refreshing="refreshing"
        />
      </div>
    </van-pull-refresh>
    <AssetHandleButtons :name="tokenName" v-if="tokenName != 'Swift'" />
  </div>
</template>

<script>
import AssetHandleButtons from '@/components/asset/AssetHandleButtons.vue';
import AssetHandleButtonsPC from '@/components/asset/AssetHandleButtonsPC.vue';
import AssetLogsPanel from '@/components/asset/AssetLogsPanel.vue';
import { debounce, toFixedFloor } from '@/tool/utils';

export default {
  name: '',
  components: {
    AssetLogsPanel,
    AssetHandleButtons,
    AssetHandleButtonsPC,
  },
  data() {
    return {
      isPc: false,
      widthPc: 750,
      refreshing: false,
      erc20Contract: '',
      whiteList: ['Falco', 'ROS', 'rFalco', 'Swift'],
    };
  },
  computed: {
    tokenName() {
      return this.$route.query.name;
    },
    tokenBalance() {
      let name = this.tokenName.toLowerCase();
      const key = `${name}Balance`;
      return this.$store.state.asset[key];
    },
    address() {
      return this.$store.state.address;
    },
  },
  created() {
    if (!this.whiteList.includes(this.$route.query.name)) {
      this.handleBack();
      return;
    }
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    watchAuth() {
      setTimeout(() => {
        this.onRefresh();
      }, 0);
    },
    onResize() {
      console.log('window.innerWidth', window.innerWidth);
      this.isPc = window.innerWidth > this.widthPc;
    },
    addressChanges(str) {
      return (
        str.substring(0, 10) + '...' + str.substring(str.length - 8, str.length)
      );
    },
    onRefresh() {

      this.$refs.logsPanel.onRefresh();



      this.refreshing = false;
    },

    formatNumber(num) {
      return toFixedFloor(num, 4);
    },

    handleBack() {
      this.$router.isBack = true;
      localStorage.setItem("assettab", "enter");
      this.$router.replace('/index');
    },
    copyCallback: debounce(function() {
      this.$toast.success(this.$t('message.addressCopied'));
    }, 350),
  },
};
</script>

<style scoped>
.asset-content {
  padding-bottom: 220px;
}
.bg-box {
  background-color: #330066;
  margin-top: 0px;
  border-radius: 0 0 50px 50px;
  padding-bottom: 170px;
  padding-top: 10px;
}
.bg-box .coin {
  font-size: 70px;
  font-weight: bold;
  color: #fa227a;
}
.bg-box .address-line {
  font-size: 26px;
  color: #bcbfd4;
  margin-top: 35px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bg-box .address-line .copy-icon {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: url('../../assets/img/copy-add.png') no-repeat;
  background-size: 100% 100%;
  margin-left: 12px;
}

.footer-text {
  margin-top: 30px;
  margin-bottom: 40px;
}
@media only screen and (max-width: 750px) {
  .footer-text {
    margin-bottom: 200px;
  }
}
@media only screen and (min-width: 751px) {
  .bg-box {
    padding-top: 40px;
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
