<template>
  <div class="rosefinch-logs-wrapper">
    <div class="empty-wrap" v-if="!list.length">
      <img class="img-empty" src="../../assets/img/box/box-empty.png" alt="" />
    </div>
    <van-list
      v-model="listLoading"
      :finished="listFinished"
      :finished-text="dataText"
      @load="onLoadData"
    >
      <RedemptionLogItem
        :class="{'last': index === (list.length - 1)}"
        v-for="(item, index) in list"
        :key="index"
        :item="item"
        @refresh="onRefresh"
        @fatherMethod="onLoadData"
      >
      </RedemptionLogItem>
    </van-list>
    <!-- <div class="empty" v-if="list.length == 0">
      {{ $t('message.noData') }}
    </div> -->
  </div>
</template>
<script>
import RedemptionLogItem from '@/components/financial/RedemptionLogItem.vue';
import { userRedemptionRecord } from '@/api/swift';

export default {
  components: {
    RedemptionLogItem,
  },
  refreshing: {
    type: Boolean,
    default: false,
  },
  data() {
    return {
      list: [],
      listLoading: false,
      listFinished: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        totalResults: 0,
      },
    };
  },
  computed: {
    dataText() {
      return this.list.length > 0 ? this.$t('message.noMore') : this.$t('message.noData');
    },
  },
  methods: {
    watchAuth() {
      this.onLoadData();
    },
    initData() {
      if (this.list.length <= 0) {
        this.onRefresh();
      }
    },
    onRefresh() {

      this.listFinished = false;
      this.list = [];


      this.listLoading = true;
      this.$toast.loading();
      this.onLoadData();
    },
    onLoadData() {
      console.log(1)
      if (this.refreshing) {
        this.list = [];
        this.$emit('update:refreshing', false);
      }
      if (this.list.length && this.list.length >= this.page.totalResults) {
        this.$toast.clear();
        return;
      }
      this.reqSwiftLogs();
    },
    async reqSwiftLogs() {
      if (this.requesting) return;
      this.requesting = true;
      const params = {

        userAddress: this.$store.state.address,
        pageNo: Math.floor(this.list.length / 10) + 1,
        pageSize: 10,
      }
      try {
        const { success, data } = await userRedemptionRecord(params);
        if (success && data) {
          this.list.push(...data.data);
          this.page = data.page;
        }
      } catch (error) {
        console.warn(error);
      }
      this.requesting = false;
      this.$toast.clear();

      this.listLoading = false;


      if (this.list.length >= this.page.totalResults) {
        this.listFinished = true;
      }
    }
  }
};
</script>

<style scoped>
.rosefinch-logs-wrapper {
  width: 100%;
}
.rosefinch-logs-wrapper .rosefinch-log-item:last-child {
  border-bottom: none;
}
.empty-wrap img {
  display: block;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
}
</style>
