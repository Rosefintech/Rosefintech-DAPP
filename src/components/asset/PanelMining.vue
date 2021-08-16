<template>
  <div class="panel-wrap">
    <div class="empty-wrap" v-if="!list.length">
      <img class="img-empty" src="../../assets/img/box/box-empty.png" alt="" />
    </div>
    <van-list
      v-model="listLoading"
      :finished="listFinished"
      :finished-text="dataText"
      @load="onLoadData"
    >
      <ListItemMining
        :class="{ last: index === list.length - 1 }"
        v-for="(item, index) in list"
        :key="index"
        :item="item"
      >
      </ListItemMining>
    </van-list>
  </div>
</template>
<script>
import { fluidLogs } from "@/api/asset";
import ListItemMining from "./ListItemMining.vue";

export default {
  components: {
    ListItemMining,
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
        pageSize: 10,
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
      if (fluidLogs.state === "pending") return;
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
        fluidLogs.state = "pending";
        const { success, data } = await fluidLogs(params);
        fluidLogs.state = "ready";
        if (success) {
          this.list.push(...data.data);
          this.page = data.page;
        }
      } catch (error) {
        console.log(error);
      }
      fluidLogs.state = "ready";

      this.listLoading = false;


      if (this.list.length >= this.page.totalResults) {
        this.listFinished = true;
      }
    },
  },
};
</script>
<style scoped>
.last {
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
  font-size: 24px;
  text-align: center;
   margin-top: 30px;
}
::v-deep .empty-wrap {
  margin-top: 90px;
  font-size: 24px;
}
</style>
