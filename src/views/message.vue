<template>
  <div class="message">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      :disabled="isPc"
    >
      <TheHeader :title="$t('message.title')" @click-left="handleBack" />
      <div class="message-content">
        <div class="content-bg mobile"></div>
        <div class="content">
          <section class="panel panel-list">
            <!-- <div class="title tabs">
              <div
                class="tab"
                :class="{ active: tabName == 'system' }"
                @click="handleTabChange('system')"
              >
                {{ $t('message.systemMessage') }}
                <span class="red-tag" v-show="newDt.system > 0">{{
                  newDt.system
                }}</span>
              </div>
              <div
                class="tab"
                :class="{ active: tabName == 'transfer' }"
                @click="handleTabChange('transfer')"
              >
                {{ $t('message.tradeInfo') }}
                <span class="red-tag" v-show="newDt.transfer > 0">{{
                  newDt.transfer
                }}</span>
              </div>
            </div> -->
            <!-- <SystemMessages
              ref="system"
              :refreshing="refreshing"
             v-show="tabName == 'system'"
            /> -->
            <TransferMessages
              ref="transfer"
              :refreshing="refreshing"

            />
            <ShareSideBtn />
          </section>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import ShareSideBtn from '../components/ShareSideBtn.vue';

import TransferMessages from '@/components/message/TransferMessages.vue';
import { messageUnread } from '@/api/user';

export default {
  name: '',
  components: {
    ShareSideBtn,

    TransferMessages,
  },
  data() {
    return {
      isPc: false,
      tabName: 'system',
      refreshing: false,
      erc20Contract: '',
      whiteList: ['Falco', 'ROS', 'rFalco', 'Swift'],
      sysNew: 0,
      transNew: 3,
      newDt: {
        system: 0,
        transfer: 0,
      },
    };
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
  },
  mounted() {
    this.newDt[this.tabName] = 0;




  },
  methods: {
    watchToken() {
      this.$nextTick(() => {
        this.$refs['transfer'].initData();
        this.onRefresh();
      });
    },
    watchAddress() {
      this.onRefresh();
    },
    handleTabChange(tab) {
      this.tabName = tab;
      this.$refs[this.tabName].initData();
      this.newDt[this.tabName] = 0;
      console.log(tab)
    },
    onRefresh() {



      this.reqUnreadMessage();

      this.refreshing = false;
    },

    async reqUnreadMessage() {
      const params = {
        address: this.$store.state.address,
        type: this.tabName == 'transfer' ? 1 : 4,
      };
      try {
        const { success, data } = await messageUnread(params);
        if (success) {
          this.tabName == 'system'
            ? (this.newDt.system = data)
            : (this.newDt.transfer = data);
        }
      } catch (error) {
        console.warn(error);
        this.$store.dispatch('addError', {
          error,
          func: `/rosLog/message/hintTotal/${params.address}/0`,
        });
      }
    },

    handleBack() {
      this.$router.isBack = true;
      this.$router.replace('/index');
    },
  },
};
</script>

<style scoped>
.van-list__error-text, .van-list__finished-text, .van-list__loading{
  color:#adb0ca;margin-top: 30px;
}
.message .message-content {
  position: relative;
  min-height: calc(100vh - 110px);
}
.message .content-bg {
  position: relative;
  background-color: #330066;
  border-radius: 0 0 50px 50px;
  height: 150px;
}
.message .content {
  position: relative;
  margin-top: -130px;
  padding: 50px;
  border-radius: 40px;
}
.message .content .panel {
  padding: 50px 40px;
  background-color: #fff;
  border-radius: 40px;
  text-align: left;
}
.panel-list .tabs {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 40px;
}
.panel-list .tab {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 500;
  color: #adb0ca;
  cursor: pointer;
  min-width: 200px;
  padding-bottom: 20px;
}
.panel-list .tab.active {
  font-size: 40px;

  color: #091d42;
  border-bottom: 6px solid #091d42;
}
.panel-list .tab .red-tag {
  margin-left: 10px;
  display: inline-block;
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #f90066;
  border-radius: 50%;
  font-size: 20px;
  color: #fff;
}
.footer-text {
  margin-top: 60px;
  margin-bottom: 200px;
}

@media only screen and (max-width: 750px) {
  .message .content {
    padding: 0 30px;
    margin-left: auto;
    margin-right: auto;
  }
}
@media only screen and (min-width: 751px) {
  .message .content {
    padding: 0;
    width: 1000px;
    margin: 0 auto;
    margin-top: 52px;
  }
}
</style>
