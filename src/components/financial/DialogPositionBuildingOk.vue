<template>
  <div class="dialog-auto-foud">
    <van-dialog
      class="dialog-box"
      :show-cancel-button="false"
      :show-confirm-button="false"
      v-model="visible"
    >
      <div class="dialog-content">
        <p class="tit">{{ $t('swift.buildingOkTitle') }}</p>
        <p class="p p-1" v-html="$t('swift.buildingOkDesc').replace(/{{XXX}}/, swiftNum)">{{ $t('finance.openInfo3') }}</p>
        <p class="p p-2" v-if="isValid">{{ $t('swift.buildingOkDesc2') }}</p>
        <img class="img" src="../../assets/img/successBuy.png" alt="">
        <div class="btn-box">
          <button class="btn btn-dark btn-sure" :disabled="seconds > 0" @click="handleOpen">
            {{ $t('message.sure') }}
            <span v-show="seconds > 0">({{ seconds }}s)</span>
          </button>
        </div>
      </div>
      <!-- <div class="cancel-box">
        <van-icon
          class="cancel-btn"
          name="close"
          @click="visible = false"
        />
      </div> -->
    </van-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      swiftNum: '0.00',
      timer: null,
      seconds: 10,
    }
  },
  computed: {
    isValid() {
      return new Date(this.$store.state.rewardDeadline).getTime() > Date.now();
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  methods: {
    handleOpen() {
      this.hide();
      localStorage.setItem('sftminetab', 'log');
      this.$router.replace('/swift-mine');
    },
    hide() {
      this.visible = false;
    },
    show(swiftNum = 0) {
      this.swiftNum = swiftNum;
      this.visible = true;
      this.startTimer();
      this.seconds = 5;
      console.log( this.seconds)
    },
    startTimer() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.seconds -= 1;
        if (this.seconds > 0) {
          this.startTimer()
        }
      }, 1000);
    }
  }
}
</script>
<style scoped>
.dialog-auto-foud .btn-sure {
  width: 460px;
}
.dialog-auto-foud .tit {
  font-size: 36px;
  font-weight: 500;
  color: #091D42;
  margin-bottom: 20px;
}
.dialog-auto-foud .p {
  font-size: 32px;
  font-weight: 400;
  color: #ADB0CA;
  line-height: 1.6;
}
.dialog-auto-foud .red {
  color: #f90066;
}

.dialog-auto-foud .img {
  width: 342px;
  height: 306px;
  margin: 20px auto;
}
</style>
