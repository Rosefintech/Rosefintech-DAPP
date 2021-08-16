<template>
  <div class="dialog-auto-foud">
    <van-dialog
      class="dialog-box"
      :show-cancel-button="false"
      :show-confirm-button="false"
      v-model="visible"
    >
      <div class="dialog-content">
        <!-- <p class="p p-1" v-html="$t('finance.openInfo1')"></p> -->
        <p class="p p-2">
          <span v-html="$t('finance.openInfo1')"></span>
          (1 : {{ eth2rosRate }})
        </p>
        <p class="p p-3">
          <span v-html="$t('finance.openInfo2')"></span>
          <span class="red">{{ toFixedFloor(rosPledge) }} ROS</span>
          <span v-html="$t('finance.openInfo3')"></span>
        </p>
        <!-- <p class="p p-4" v-html="$t('finance.openInfo3')"></p> -->
        <div class="btn-box">
          <button class="btn btn-dark btn-sure" @click="handleOpen">
            {{ $t('index.confirm') }}
          </button>
          <p class="p p-tip" v-html="$t('finance.openTip')"></p>
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
import { toFixedFloor } from '@/tool/utils';

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
    toFixedFloor,
    handleOpen() {
      this.$emit('open');
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
  font-family: TsangerYunHei;
  font-weight: 400;
  color: #091D42;
  line-height: 48px;
}
.dialog-auto-foud .red {
  color: #f90066;
}
.dialog-auto-foud .btn-box {
  margin-top: 40px;
}
.dialog-auto-foud .p-tip {
  font-size: 24px;
  line-height: 1.5;
  font-weight: 400;
  color: #ADB0CA;
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>