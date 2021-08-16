<template>
  <div class="dialog-protocol">
    <van-dialog
      class="dialog-box"
      :show-cancel-button="false"
      :show-confirm-button="false"
      v-model="visible"
    >
      <div class="dialog-content">
        <p class="p title">{{ $t('finance.protocalTitle') }}</p>
        <p class="p desc" v-html="$t('finance.protocalDetail')"></p>
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
.dialog-protocol .title {
  font-size: 30px;
  font-weight: 400;
  color: #091D42;
  line-height: 48px;
}
.dialog-protocol .desc {
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
.dialog-protocol .btn {
  width: 460px;
}
.dialog-protocol .btn-sure {
  margin-top: 40px;
}
</style>
<style>
.dialog-protocol .desc .p {
  margin: 12px 0;
}
.dialog-protocol .desc .tit {
  margin: 20px 0;
  font-weight: bold;
}
</style>