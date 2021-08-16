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
      <ListItem
        :class="{ last: index === list.length - 1 }"
        v-for="(item, index) in list"
        :type="'out'"
        :key="index"
        :item="item"
        :tokenName="tokenName"
      >
      </ListItem>
    </van-list>
  </div>
</template>
<script>
import { transLogsRos, transLogsSwift, getGovernList } from "@/api/asset";
import ListItem from "./ListItem.vue";

export default {
  components: {
    ListItem,
  },
  props: {
    tokenName: {
      type: String,
      default: "ROS",
    },
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

    getFunc() {
      if (this.tokenName === "ROS") {
        return transLogsRos;
      } else if (this.tokenName === "Swift") {
        return transLogsSwift;
      } else {
        return getGovernList;
      }
    },

    getParams() {
      if (this.tokenName === "ROS" || this.tokenName === "Swift") {
        return {
          out_address: this.$store.state.address,
          pageNo: Math.floor(this.list.length / 10) + 1,
          pageSize: 10,
        };
      } else {
        return {
          address: this.$store.state.address,
          pageNo: Math.floor(this.list.length / 10) + 1,
          pageSize: 10,
          tokenType: this.tokenName,
          type: "OUT",
        };
      }
    },

    async onLoadData() {
      if (!this.$store.state.token) {
        return;
      }
      if (this.refreshing) {
        this.list = [];
        this.$emit("update:refreshing", false);
      }
      console.log("out onLoadData");
      const func = this.getFunc();
      const params = this.getParams();
      if (this.state === "pending") return;
      if (this.list.length && this.list.length >= this.page.totalResults) {
        return;
      }
      try {
        this.state = "pending";
        const { data } = await func(params);
        this.state = "ready";
        if (data) {
          this.list.push(...data.data);
          this.page = data.page;
        }
      } catch (error) {
        console.log(error);
      }
      this.state = "ready";
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
  text-align: center;
  font-size: 24px;
   margin-top: 30px;
}
::v-deep .empty-wrap {
  margin-top: 90px;
  font-size: 24px;
}
</style>
