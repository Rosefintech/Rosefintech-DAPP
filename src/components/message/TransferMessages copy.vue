<template>
  <div class="rosefinch-message-list">
    <div class="empty-wrap" v-if="!list.length">
      <img class="img-empty" src="../../assets/img/box/box-empty.png" alt="" />
    </div>

    <van-list
      v-model="listLoading"
      :finished="listFinished"
      :finished-text="dataText"
      @load="onLoadData"
    >
       <!-- <SystemItem
        :class="{ last: index === list.length - 1 }"
        v-for="(item, index) in list"
        :key="index"
        :item="item"
      >
      </SystemItem> -->
      <TransferItem
        :class="{ last: index === list.length - 1 }"
        v-for="(item, index) in list"
        :key="index"
        :item="item"
      >
      </TransferItem>
    </van-list>
  </div>
</template>
<script>


import TransferItem from '@/components/message/TransferItem.vue';
import { messageList, messageReadAll } from '@/api/user';

export default {
  components: {
    TransferItem,


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
        pageSize: 20,
        totalResults: 0,
      },
    };
  },
  computed: {
    dataText() {
      return this.list.length > 0
        ? this.$t('message.noMore')
        : this.$t('message.noData');
    },
  },
  methods: {
    watchToken() {
      this.onLoadData();
      this.reqMessageList();
      this.reqMessageLists();
    },
    initData() {
      if (this.list.length <= 0) {
        this.onRefresh();
      } else {

        this.reqReadAll();
        this.reqReadAlls();
      }
    },
    onRefresh() {

      this.listFinished = false;
      this.list = [];


      this.listLoading = true;
      this.$toast.loading();
      this.onLoadData();


      this.reqReadAll();
    },
    onLoadData() {
      if (!this.$store.state.token) return;

      if (this.refreshing) {
        this.list = [];
        this.$emit('update:refreshing', false);
      }
      if (this.list.length && this.list.length >= this.page.totalResults) {
        this.$toast.clear();
        return;
      }
      this.reqMessageList();
    },
    async reqMessageList() {
      const params = {
        type: 1,
        address: this.$store.state.address,
        pageNo: Math.floor(this.list.length / 20) + 1,
        pageSize: 20,
      };
      if (messageList.loading) return;
      messageList.loading = true;
      try {
        const { success, data } = await messageList(params);
        if (success && data) {
          const list = data.data.reduce((arr, item) => {
            if (item.type == 8) {
              const i = Object.assign({}, item);
              i.type = 801;
              arr.push(i);




            } else if (item.type === 15) {
              const i3 = Object.assign({}, item);
              i3.type = 1501;
              arr.push(i3);
              const i4 = Object.assign({}, item);
              i4.type = 1502;
              arr.push(i4);
              data.page.totalResults += 1;
              if (+item.assist > 0) {
                const i5 = Object.assign({}, item);
                i5.type = 1503;
                arr.push(i5);
                data.page.totalResults += 1;
              }
            } else {
              arr.push(item);
            }

            return arr;
          }, []);
          this.list.push(...list);
          this.page = data.page;
        }
      } catch (error) {
        console.warn(error);
      }
      messageList.loading = false;
      this.$toast.clear();

      this.listLoading = false;


      if (this.list.length >= this.page.totalResults) {
        this.listFinished = true;
      }
    },

    async reqReadAll() {
      const params = {
        address: this.$store.state.address,
        type: 1,
      };
      try {
        await messageReadAll(params);
      } catch (error) {
        console.warn(error);
        this.$store.dispatch('addError', {
          error,
          func: `/rosLog/message/readAll/${params.address}/1`,
        });
      }
    },
        async reqMessageLists() {
      const params = {
        type: 4,
        address: this.$store.state.address,
        pageNo: Math.floor(this.list.length / 20) + 1,
        pageSize: 20,
      };
      if (messageList.loading) return;
      messageList.loading = true;
      try {
        const { success, data } = await messageList(params);
        if (success && data) {
          this.list.push(...data.data);
          this.page = data.page;
        }
      } catch (error) {
        console.warn(error);
      }
      messageList.loading = false;
      this.$toast.clear();

      this.listLoading = false;


      if (this.list.length >= this.page.totalResults) {
        this.listFinished = true;
      }
    },

    async reqReadAlls() {
      const params = {
        address: this.$store.state.address,
        type: 4,
      };
      try {
        await messageReadAll(params);
      } catch (error) {
        console.warn(error);
        this.$store.dispatch('addError', {
          error,
          func: `/rosLog/message/readAll/${params.address}/4`,
        });
      }
    },
  },
};
</script>

<style scoped>
.rosefinch-message-list {
  width: 100%;
}
.rosefinch-message-list .rosefinch-log-item:last-child {
  border-bottom: none;
}
.empty-wrap img {
  display: block;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
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
