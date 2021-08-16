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
      <component
        :class="{'last': index === (list.length - 1)}"
        v-for="(item, index) in list"
        :item="item"
        :key="index"
        :is="getCompName(item)"
      >
      </component>
    </van-list>
  </div>
</template>
<script>
import { transLogs } from '@/api/asset';
import ListItem from './ListItem.vue';
import ListItemSwap from './ListItemSwap.vue';
import ListItemMining from './ListItemMining.vue';

export default {
  components: {
    ListItem,
    ListItemSwap,
    ListItemMining
  },
  props: {
    refreshing: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      listLoading: false,
      listFinished: false,
      dataText: this.$t('message.noData'),
      list: [],
      page: {
        pageNo: 1,
        pageSize: 6,
        totalResults: 0,
      },
    };
  },
  computed: {
    tabType() {
      if (this.tab === 'enter') {
        return 'INTO';
      } else if (this.tab === 'out') {
        return 'OUT';
      } else {
        return null;
      }
    },
  },
  watch: {
    '$store.state.token': {
      immediate: true,
      handler(value) {
        if (value) {
          this.onRefresh();
        }
      },
    },
  },
  methods: {
    onRefresh() {
      this.listFinished = false;
      this.list = [];
      this.listLoading = true;
      this.onLoadData();
    },

    async onLoadData() {
      console.log('onLoadData');
      if (this.refreshing) {
        this.list = [];

        this.$emit('update:refreshing', false);
      }
      if (transLogs.state === 'pending') return;
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
        transLogs.state = 'pending';
        const { success, data } = await transLogs(params);
        transLogs.state = 'ready';
        if (success) {
          if (data.page.totalResults < 1) {
            this.dataText = this.$t('message.noData');
          } else {
            this.dataText = this.$t('message.noMore');
          }
          this.list.push(...data.data);
          this.page = data.page;
        }
      } catch (error) {
        console.log(error);
      }
      transLogs.state = 'ready'

      this.listLoading = false;

      if (this.list.length >= this.page.totalResults) {
        this.listFinished = true;
      }
    },

    getCompName(item) {
      console.log('item name', item);
      return 'ListItem';
    },
  },
};
</script>
<style scoped>
.panel-wrap .last{
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
