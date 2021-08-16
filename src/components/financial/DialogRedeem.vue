<template>
  <div class="dialog-auto-foud">
    <van-dialog
      class="dialog-box"
      :show-cancel-button="false"
      :show-confirm-button="false"
      v-model="visible"
    >
      <div class="dialog-content">
        <p class="p p-1" v-html="$t('message.redeemWarnTip')"></p>
        <div class="btn-box">
          <button class="btn btn-dark btn-sure" @click="handleSure">
            {{ $t('index.confirm') }}
          </button>
        </div>
      </div>
      <div class="cancel-box">
        <van-icon
          class="cancel-btn"
          name="close"
          @click="visible = false"
        />
      </div>
    </van-dialog>
  </div>
</template>
<script>
export default {
  props: {
    rosPledge: {
      type: Number,
      default: 0,
    },
    eth2rosRate: {
      type: [String, Number],
      default: 1,
    }
  },
  data() {
    return {
      visible: false,
      rosCost: '1000.00'
    }
  },
  methods: {
    handleSure() {
      this.$emit('sure');
      this.hide();
    },
    hide() {
      this.visible = false;
    },
    show() {
      this.visible = true;
    }
  }
}
</script>
<style scoped>
.dialog-auto-foud .btn-sure {
  width: 460px;
}
.dialog-auto-foud .p {
  font-size: 30px;
  font-weight: 400;
  color: #091D42;
  line-height: 48px;
  margin-bottom: 50px;
}
.dialog-auto-foud .p-tip {
  font-size: 24px;
  line-height: 1.5;
  font-weight: 400;
  color: #ADB0CA;
  margin-top: 40px;
  margin-bottom: 10px;
}
</style>