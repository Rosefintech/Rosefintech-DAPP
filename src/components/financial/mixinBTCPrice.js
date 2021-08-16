import { wbtcPrices } from '@/api/swift';

export default {
  computed: {
    btcList() {
      return this.$store.state.btcList;
    },
    btcTimestamp() {
      return this.$store.state.btcTimestamp;
    }
  },
  methods: {
    async getBTCPrice(length = 30) {
      if (this.btcList) {
        
        const isOutDate = new Date(this.btcTimestamp).getDate() != new Date().getDate();
        const isNeedMore = length > this.btcList.length;
        if (isOutDate || isNeedMore) {
          await this.reqBTCPrice(length);
        }

        return this.btcList;
      }

      return await this.reqBTCPrice();
    },

    async reqBTCPrice(pageSize = 30) {
      let list = [];
      const params = {
        pageNo: 1,
        pageSize,
      }
      const { success, data } = await wbtcPrices(params);
      if (success && data) {
        this.$store.commit('SET_BTC_LIST', data.data);
        this.$store.commit('SET_BTC_TIMESTAMP', Date.now());
        list = data.data;
      }
      return list;
    },
  }
}
