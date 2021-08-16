<template>
  <div class="dialog-risk">
    <van-dialog
      class="dialog-box"
      :show-cancel-button="false"
      :show-confirm-button="false"
      v-model="visible"
    >
      <div class="dialog-content">
        <p class="p p-tip" v-html="$t('asset.warnSwap')"></p>
        <div class="btn-box">
          <button class="btn btn-dark" @click="handleSure">
            {{ $t('message.sure') }}
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
  data() {
    return {
      visible: false,
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
.dialog-risk .p {
  font-size: 30px;
  font-family: TsangerYunHei;
  font-weight: 400;
  color: #091D42;
  line-height: 48px;
}
.dialog-risk .p-tip {
  font-weight: 400;
  color: #091D42;
  margin-top: 40px;
  margin-bottom: 60px;
  text-align: center;
  line-height: 58px;
  overflow: auto;
  text-align: justify;
}
.dialog-risk .btn {
  width: 460px;
}
.dialog-risk .btn-sure {
  margin-top: 40px;
}
</style>
