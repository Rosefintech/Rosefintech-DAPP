<template>
  <van-dialog
    class="dialog-box"
    :show-cancel-button="false"
    :show-confirm-button="false"
    v-model="walletOpen"
  >
    <div class="dialog-content">
      <div class="dialog-tit">
        {{ $t('message.appDialogTit') }}
        <p class="tit-text">
          {{ $t('message.appDialogText') }}
        </p>
      </div>
      <div class="content">
        <p class="cont-text01">{{ $t('message.cont01') }}</p>
        <img class="img-width" src="../assets/img/app-01.png" />
        <p class="cont-text02">{{ $t('message.cont02') }}</p>
        <img class="img-width" src="../assets/img/app-02.png" />
      </div>
    </div>
    <div class="cancel-box">
      <van-icon class="cancel-btn" name="close" @click="hide" />
    </div>
  </van-dialog>
</template>

<script>
export default {
  data() {
    return {
      walletOpen: false,
    };
  },
  methods: {
    show() {
      this.walletOpen = true;
    },

    hide() {
      this.walletOpen = false;
    },
  },
};
</script>

<style scoped>
.dialog-box {
  width: 680px !important;
  margin-top: 40px;
}
.dialog-box .img-width {
  width: 520px;
}
.dialog-box .tit-text {
  font-size: 28px;
  margin-top: 30px;
  color: #adb0ca;
}
.dialog-box .dialog-tit {
  font-size: 30px;
}
.dialog-box .cancel-box {
  margin-top: 40px;
}
.dialog-box .content {
  margin-top: 35px;
  text-align: left;
  padding: 0 30px;
}
.dialog-box .content .cont-text01 {
  font-size: 22px;
}
.dialog-box .content .cont-text02 {
  font-size: 22px;
  margin-top: 50px;
}
</style>
