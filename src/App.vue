<template>
  <div id="app" v-cloak :class="(address || $route.path == '/guide') ? address : 'disabled'" :data-v="releaseTag">
    <router-view v-if="isPc && routerState" class="pc" />
    <transition v-else :name="transitionName">
      <router-view class="router mobile" v-if="routerState" />
    </transition>


    <DialogDapp ref="dialogDapp" />
    <DialogShareQR ref="dialogShareQR" />
    <DialogSwapRos />
  </div>
</template>

<script>
import DialogDapp from '@/components/DialogDapp.vue';
import DialogShareQR from '@/components/DialogShareQR.vue';
import DialogSwapRos from '@/components/DialogSwapRos.vue';
import { releaseTag } from '@/api/contract';

export default {
  name: 'App',
  components: {
    DialogDapp,
    DialogShareQR,
    DialogSwapRos
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isPc: false,
      releaseTag,
      transitionName: '',
      routerState: true,
    };
  },
  computed: {
    address() {
      return this.$store.state.address || '';
    },
  },
  watch: {
    address: {
      immediate: true,
      handler(value) {
        if (value) {
          this.isBuy();
        }
      },
    },
    $route(to, from) {
      if (from.path !== "/") {
        this.clearStateTimer();
        this.$toast.clear();
        const isBack = this.$router.isBack;
        if (isBack) {

          this.transitionName = 'slide-right';
        } else {
          this.transitionName = 'slide-left';
        }

        this.$router.isBack = false;
      }
    }
  },
  created() {
    window.addEventListener('resize', this.onResize);
    this.onResize();

    this.$store.commit('setAppVm', this);
    this.$store.dispatch('onAccountsChanged');
    this.$store.dispatch('onNetworkChanged');

  },
  mounted() {
    this.$toast.loading(this.$t('message.connectAdd'));

    this.$store.dispatch('ethereumConnect');
    window.addEventListener('focus', this.onWindowFocus);
  },
  beforeDestroy() {
    window.removeEventListener('focus', this.onWindowFocus);
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    reload() {
      console.log('reload');
      this.routerState = false;
      this.$nextTick(() => {
        this.routerState = true;
      });
    },
    onWindowFocus() {
      this.isBuy();
    },
    onResize() {
      this.isPc = window.innerWidth > 750;
    },

    checkIsShowGuide() {
      if (this.$store.state.isShowGuide) {
        this.$router.replace({
          name: 'Guide',
          query: this.$route.query,
          params: this.$route.params,
        });
      } else {

      }
    },

    isBuy() {
      if (!this.$store.state.address) {
        return
      }
      this.$agencyContract.methods
        .getTakePositionBalance(this.address)
        .call()
        .then((res) => {
          this.$store.commit('setIsBuy', Number(res) > 0);
        });
    },

    showDialog() {
      this.$refs.dialogDapp.show();
    },
    showQR() {
      this.$refs.dialogShareQR.show();
    },
  },
};
</script>

<style>

[v-cloak] {
  display: none !important;
}
@font-face {
  font-family: TsangerYunHei;
  src: url(/fonts/TSANGERYUNHEI-W01.TTF)
}
@font-face {
  font-family: TsangerYunHei-W03;
  src: url(/fonts/TSANGERYUNHEI-W03.TTF)
}
@font-face {
  font-family: TsangerYunHei;
  src: url(/fonts/TSANGERYUNHEI-W03.TTF)
  /* src: url(/fonts/POPPINS-LIGHT.TTF) */
}
@font-face {
  font-family: TsangerYunHei-W02;

  src: url(/fonts/TSANGERYUNHEI-W02.TTF)
}
@font-face {
  font-family: TsangerYunHei-W01;
  src: url(/fonts/TSANGERYUNHEI-W01.TTF)
}
#app {
  position: relative;
  font-family: TsangerYunHei, PingFang, PingFang SC, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-overflow-scrolling: touch;
  /*user-select: none; !* *!*/
  text-align: center;
  color: #666;
  /*margin-top: 60px;*/
  width: 100%;
  /*max-width: 750px;*/
  height: 100vh;
  margin-left: auto;
  margin-right: auto;
  background: #fafafc;
  overflow-y: auto;
  transition: all 0.3s;
}
#app.disabled {
  opacity: 0.6;
}
@media screen and (min-width: 750px) {
  /* #app {
    height: unset;
  } */
  #app::-webkit-scrollbar {
    width: 6px;
    height: 16px;
    background-color: #b3a9bd;
  }
  #app::-webkit-scrollbar-thumb {
    background-color: #2f025b;
  }
}
@media only screen and (max-width: 750px) {
  #app {
    user-select: none;
  }
  .router {
    width: 100%;
    min-height: 100vh;
    -webkit-overflow-scrolling: touch;
  }
  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active {
    will-change: transform;
    transition: all 480ms;
    position: fixed;
  }
  .slide-right-leave-to,
  .slide-right-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .slide-right-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-leave-to,
  .slide-left-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
}

</style>
