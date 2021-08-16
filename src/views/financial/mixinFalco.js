import { getKestrelList, getKestrelInfo, getKestrelTotal } from '@/api/falco';

export default {
  data() {
    return {
      fundSize: 0,
    }
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
    userFalco() {
      return this.$store.state.falco.userFalco || {};
    },
    fundFalco() {
      return this.$store.state.falco.fundFalco;
    },
    ratioData() {
      return this.fundFalco.ratioData || {};
    },
  },

  methods: {
    async reqUserFalco() {
      const params = {
        address: this.address,
      };
      try {
        
        const { success, data } = await getKestrelInfo(params);
        
        if (success && data) {
          const ratioData = {
            month3: data.threeMonthRatio * 100,
            month6: data.sixMonthRatio * 100,
            month12: data.oneYearRatio * 100,
            month36: data.threeYearRatio * 100,
            monthAll: data.allRatio * 100,
          };
          data.totalProfit = data.nowPrice - data.assets;
          data.totalRate = (data.totalProfit / (data.assets || 1)) * 100;
          data.ratioData = ratioData;
          this.$store.commit('falco/SET_USER_FALCO', data);

          console.log('user falco', data);
        }
      } catch (error) {
        this.$store.dispatch('addError', {
          error,
          func: `/kestrel/detail(${JSON.stringify(params)})`,
        });
      }
    },

    
    async reqFundList(pageSize = 15) {
      this.$toast.loading({
        duration: 0,
      });
      const params = {
        pageNo: 1,
        pageSize,
      };
      try {
        const { success, data } = await getKestrelTotal(params);
        if (success && data) {
          const ratioData = {
            month3: data.threeMonthRatio * 100,
            month6: data.sixMonthRatio * 100,
            month12: data.oneYearRatio * 100,
            month36: data.threeYearRatio * 100,
            monthAll: data.allRatio * 100,
          };
          data.ratioData = ratioData;
          this.$store.commit('falco/SET_FUND_FALCO', data);
          const list = data.assetsRecord.map((item) => {
            return {
              date: this.dateChange(item.updateDate),
              value: item.assets,
            };
          });
          this.fundSize = list[0].value;
          setTimeout(() => {
           
            this.$refs.chart.drawLine(list, 'usd-fund');
          }, 500);
        } else {
          this.$toast.clear();
        }
      } catch (error) {
        console.log(error);
        this.$toast.clear();
        this.$store.dispatch('addError', {
          error,
          func: `/kestrel/list${JSON.stringify(params)}`,
        });
      }
    },

    
    async reqUserList(pageSize = 15) {
      this.$toast.loading({
        duration: 0,
      });
      const params = {
        address: this.$store.state.address,
        pageNo: 1,
        pageSize,
      };
      try {
        const { success, data } = await getKestrelList(params);
        console.log('user falco list', data);
        if (success && data) {
          
          
          
          
          
          
          
          
          
          const list = data.map((item) => {
            return {
              date: this.dateChange(item.createTime),
              value: item.nowPrice,
            };
          });
          this.fundSize = list[0].value;
          setTimeout(() => {
            this.$refs.chart.drawLine(list, 'usd-mine');
          }, 500);
        } else {
          this.$toast.clear();
        }
      } catch (error) {
        console.log(error);
        this.$toast.clear();
        this.$store.dispatch('addError', {
          error,
          func: `/kestrel/list${JSON.stringify(params)}`,
        });
      }
    },
    dateChange(time) {
      const date = new Date(time);
      const padS = (num) => (num >= 10 ? num : `0${num}`);
      const yr = date.getFullYear();
      const mon = padS(date.getMonth() + 1);
      const day = padS(date.getDate());
      return `${yr}-${mon}-${day}`;
    },
  },
};
