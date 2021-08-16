<template>
  <div class="receipt-wrapper">
    <TheHeader :title="$t('message.payment')" @click-left="handleBack" />
    <div class="qr-wrap">
      <div class="desc">{{ $t('receiptQr.desc1') }}</div>
      <div class="qr-box">
        <div id="qrcode" ref="qrcode"></div>
      </div>
      <div class="address-tit">{{ $t('receiptQr.walletAddress') }}</div>
      <div class="address-detail">{{ $store.state.address }}</div>
    </div>
    <Copy :content="$store.state.address" @copyCallback="copyCallback">
      <p style="cursor:pointer;">{{ $t('receiptQr.copyAddress') }}</p>
    </Copy>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2';

export default {
  name: '',
  data() {
    return {
      whiteList: ['ROS', 'Swift', 'Falco', 'rFalco'],
    };
  },
  created() {
    if (!this.whiteList.includes(this.$route.query.name)) {
      this.handleBack();
    }
  },
  mounted() {
    this.$toast.loading({
      duration: 0,

    });
    setTimeout(() => {
      this.creatQrCode();
    }, 200);
  },
  methods: {
    creatQrCode() {
      const address = this.$store.state.address;
      const width = document.querySelector('.qr-box').clientWidth;
      new QRCode(this.$refs.qrcode, {
        text: address,
        width: width,
        height: width,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H,
      });
      this.$toast.clear();
    },
    copyCallback() {
      this.$toast.success(this.$t('message.succeCopy'));
    },
    handleBack() {

      this.MyGo(-1);
    },
  },
};
</script>

<style scoped>
.receipt-wrapper {
  width: 100%;
  min-height: 100vh;
  background-color: #330066;
  padding-bottom: 60px;
}
.qr-wrap {
  margin-top: 80px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 100px;
  width: 631px;
  height: 882px;
  background: #fff;
  border-radius: 20px;
  box-sizing: border-box;
}
.desc,
.address-tit {
  font-size: 26px;
  color: #afb7d6;
}
.qr-box {
  margin: 65px auto 46px;
  width: 446px;
  height: 446px;
  display: flex;
  justify-content: center;
}
.address-detail {
  margin: 0 auto;
  margin-top: 27px;
  font-size: 26px;
  color: #091d42;
  width: 450px;
  overflow-wrap: break-word;
}
.copy {
  margin: 59px auto 0;
  width: 460px;
  height: 80px;
  line-height: 80px;
  background: #330066;
  border: 2px solid #fff;
  border-radius: 40px;
  color: #fff;
  font-size: 30px;
}
</style>
