<template>
  <van-dialog
    class="dialog-box"
    :show-cancel-button="false"
    :show-confirm-button="false"
    v-model="visible"
  >
    <div class="dialog-content">
      <div class="qr-box">
        <div id="qrcode" ref="qrcode"></div>
      </div>
      <div class="address-detail">{{ shareHref }}</div>
      <Copy :content="shareHref" @copyCallback="copyCallback">
        <div class="btn btn-dark" style="cursor:pointer;">{{ $t('message.copyShare') }}</div>
      </Copy>
    </div>
    <div class="cancel-box">
      <van-icon class="cancel-btn" name="close" @click="hide" />
    </div>
  </van-dialog>
</template>

<script>
import QRCode from 'qrcodejs2';

export default {
  data() {
    return {
      visible: false,
      isQRReady: false
    };
  },
  computed: {

    shareHref() {
      return window.location.origin + '/index?inviter=' + this.$store.state.address;
    },
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
      this.isQRReady = true;
      this.$toast.clear();
    },
    show() {
      this.visible = true;

      if (this.isQRReady) return;

      this.$toast.loading({
        duration: 0,
      });
      setTimeout(() => {
        this.creatQrCode();
      }, 200);
    },
    hide() {
      this.visible = false;
    },
    copyCallback() {
      this.$toast.success(this.$t('message.succeCopy'));
    },
  },
};
</script>

<style scoped>
.cancel-box{
  margin-top: 20px;
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
