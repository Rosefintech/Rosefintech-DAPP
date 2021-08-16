<template>
  <div class="cycle-picker">
    <van-popup v-model="isShow" position="bottom" round :style="{ height: '30%;', 'min-height': '308px' }">
      <van-picker
        :title="$t('finance.cyclePickerTitle')"
        :confirm-button-text="$t('message.sure')"
        :cancel-button-text="$t('message.cancel')"
        default-index="2"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {
      isShow: false,
      activeIndex: 2,
    }
  },
  computed: {
    columns() {
      return [

      ]
    }
  },
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    onConfirm(option) {
      this.$emit('selected-cycle', option);
      this.hide();
    },




    onCancel() {
      this.hide();
    },
  }
}
</script>
<style scoped></style>
