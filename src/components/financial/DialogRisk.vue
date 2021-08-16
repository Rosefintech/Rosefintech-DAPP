<template>
  <div class="dialog-risk">
    <van-dialog
      class="dialog-box"
      :show-cancel-button="false"
      :show-confirm-button="false"
      v-model="visible"
    >
      <div class="dialog-content">
        <p class="p title">{{ $t('index.warningTit') }}</p>
        <p class="p p-tip" v-html="$t('index.riskWarning')"></p>
        <div class="btn-box">
          <button class="btn btn-dark" @click="hide">
            {{ $t('index.know') }}
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
  font-size: 26px;
  font-weight: 400;
  color: #666666;
  margin-top: 40px;
  margin-bottom: 60px;
  text-align: left;
  line-height: 48px;
  overflow: auto;
  height: 50vh;
}
.dialog-risk .btn {
  width: 460px;
}
.dialog-risk .btn-sure {
  margin-top: 40px;
}
</style>
