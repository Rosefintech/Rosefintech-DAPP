<template>
  <div class="panel-wrap">
    <div class="empty-wrap" v-if="!list.length" @click="handleShareBox(item)">
      <img class="img-empty" src="../../assets/img/box/box-empty.png" alt="" />
    </div>
    <van-list
      v-model="listLoading"
      :finished="listFinished"
      :finished-text="dataText"
      @load="onLoadData"
    >
      <ListItemSwap
        :class="{ last: index === list.length - 1 }"
        v-for="(item, index) in list"
        :key="index"
        :item="item"
      >
      </ListItemSwap>
    </van-list>
  </div>
</template>
<script>
import { swapLogs } from "@/api/asset";
import ListItemSwap from "./ListItemSwap.vue";

export default {
  components: {
    ListItemSwap,
  },
  props: {
    refreshing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      listLoading: false,
      listFinished: false,

      list: [],
      page: {
        pageNo: 1,
        pageSize: 6,
        totalResults: 0,
      },
    };
  },
  computed: {
    dataText() {
      return this.page.totalResults <= 0
        ? this.$t("message.noData")
        : this.$t("message.noMore");
    },
  },
  methods: {
    initData() {
      if (this.list.length <= 0) {
        this.onRefresh();
      }
    },
    onRefresh() {
      this.listFinished = false;
      this.list = [];
      this.listLoading = true;
      this.onLoadData();
    },

    async onLoadData() {
      if (!this.$store.state.token) {
        return;
      }
      if (this.refreshing) {
        this.list = [];

        this.$emit("update:refreshing", false);
      }
      if (swapLogs.state === "pending") return;
      if (!this.$store.state.address) return;
      if (this.list.length && this.list.length >= this.page.totalResults) {
        return;
      }
      try {
        const params = {
          address: this.$store.state.address,
          pageNo: Math.floor(this.list.length / 10) + 1,
          pageSize: 10,
        };
        swapLogs.state = "pending";
        const { success, data } = await swapLogs(params);
        swapLogs.state = "ready";
        if (success) {
          this.list.push(...data.data);
          this.page = data.page;
        }
      } catch (error) {
        console.log(error);
      }
      swapLogs.state = "ready";
      this.listLoading = false;
      if (this.list.length >= this.page.totalResults) {
        this.listFinished = true;
      }
    },
  },
};
</script>
<style scoped>
.panel-wrap .last {
  border-bottom: none;
  padding-bottom: 0;
}
.empty-wrap {
  padding-top: 60px;
  /*padding-bottom: 253px;*/
}
.img-empty {
  width: 381px;
  height: 237px;
}
::v-deep .van-list__error-text,
::v-deep .van-list__finished-text,
::v-deep .van-list__loading {
  color: #adb0ca !important;
  line-height: 50px;
  text-align: center;
  font-size: 24px;
   margin-top: 30px;
}
::v-deep .empty-wrap {
  margin-top: 90px;
  font-size: 24px;
}
</style>
