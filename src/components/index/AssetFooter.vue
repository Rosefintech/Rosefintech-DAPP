<template>
<div>
  <div class="content-bottom">
    <div class="side left financial" @click="handleFinancial">
      <i class="i"></i>
      <p class="p">{{ $t('finance.title') }}</p>
    </div>
    <div class="center" @click="connectWallet">
      <i class="i"></i>
      <p class="p">{{ addStr }}</p>
    </div>
    <div class="side right ros" @click="handleToReferendum">
      <i class="i"></i>
      <p class="p">{{ $t('message.govern') }}</p>
    </div>

  </div>
  <van-popup v-model="show" round closeable
  position="bottom"><IndexList></IndexList></van-popup>
  </div>
</template>

<script>
import { debounce } from '@/tool/utils';
import { governUrl } from '@/api/contract';
import IndexList from '@/components/index/indexList.vue';
export default {
  name: '',
      components: {
    IndexList,
  },
  data() {
    return {

       show: false,
    };
  },
  computed: {
    addStr() {
      const address = this.$store.state.address;
      if (!address) {
        return this.$t('message.connectAdd');
      } else {
        return (
          address.substring(0, 4) +
          '.....' +
          address.substring(address.length - 5, address.length)
        );
      }
    },
    isSealing() {
      return this.$store.state.isSealing;
    },
  },
  methods: {

    connectWallet: debounce(function() {
      this.$store.dispatch('ethereumConnect');
    }, 350),

    handleFinancial() {
       this.show = true;

    },


    handleToReferendum() {
      window.location.href = governUrl;
    }
  },
};
</script>

<style scoped>
::v-deep .van-popup__close-icon {
    position: absolute;
    z-index: 1;
    color: #c8c9cc;
    font-size: 18px;
    cursor: pointer;
}
.content-bottom {
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0;
  background: url('../../assets/img/footer-bg.png') no-repeat;
  width: 100%;
  /* max-width: 750px; */
  margin-left: auto;
  margin-right: auto;
  background-size: 100% 100%;
  padding: 20px 0;
  font-family: TsangerYunHei;
  z-index: 3000;
}
.content-bottom .side {
  flex: 1;
  font-size: 22px;
  color: #330066;
}
.content-bottom .center {
  margin-left: 20px;
  margin-right: 20px;
  font-size: 18px;
  color: #ffffff;
  width: 198px;
  height: 95px;
  background: #330066;
  border-radius: 48px;
  margin-top: -56px;
  pointer-events: auto;
}
.content-bottom .center .p {
  margin-top: -4px;
}
.content-bottom .i {
  display: inline-block;
  width: 50px;
  height: 50px;
}
.content-bottom .left .i {
  background: url('../../assets/img/index/icon-bag.png') no-repeat;
  background-size: 100% 100%;
}
.content-bottom .center .i {
  background: url('../../assets/img/btn-img.png') no-repeat;
  background-size: 100% 100%;
  margin-top: 4px;
}
.content-bottom .right .i {
  background: url('../../assets/img/index/icon-token.png') no-repeat;
  background-size: 100% 100%;
}
</style>
