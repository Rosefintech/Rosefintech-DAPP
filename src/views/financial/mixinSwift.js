import { swiftDetailUser, updateUserSwift } from '@/api/swift';

export default {
  data() {
    return {
      swiftUpdating: false,
    }
  },
  computed: {
    address() {
      return this.$store.state.address;
    },
    userSwift() {
      return this.$store.state.swift.userSwift || {};
    },
    ratioData() {
      return this.userSwift.ratioData || {};
    },
  },

  methods: {
    
    async reqUserSwift(pageSize = 15) {
      this.$toast.loading();
      if (swiftDetailUser.loading) return;
      swiftDetailUser.loading = true;

      const params = {
        userAddress: this.address,
        pageNo: 1,
        pageSize,
      };
      try {
        const { success, data } = await swiftDetailUser(params);
        if (success && data) {
          data.totalRate *= 100;
          const obj = {};
          for (let key of Object.keys(data.trend)) {
            obj[key] = data.trend[key] * 100;
          }
          data.ratioData = obj;
          
          this.$store.commit('swift/SET_USER_SWIFT', data);

          
        }
      } catch (error) {
        console.warn(error);
        this.$store.dispatch('addError', {
          error,
          func: `/assets/user(${JSON.stringify(params)})`,
        });
      }
      swiftDetailUser.loading = false;
      this.$toast.clear();
    },

    async reqUpdateUserSwift() {
      if (this.swiftUpdating) {
        return this.$toast.fail(this.$t('message.notFrequently'));
      }
      this.swiftUpdating = true;
      this.updateTimer = setTimeout(() => {
        this.swiftUpdating = false;
      }, 10000);

      this.$toast({
        icon: 'clock-o',
        message: this.$t('message.sendRefresh')
      });
      const params = {
        userAddress: this.address
      }
      try {
        await updateUserSwift(params);
        this.reqUserSwift(15);
      } catch (error) {
        console.warn(error);
        this.$toast.clear();
        this.$store.dispatch('addError', {
          error,
          func: `/user/assets/refresh(${JSON.stringify(params)})`,
        });
      }
    }
  },
};
