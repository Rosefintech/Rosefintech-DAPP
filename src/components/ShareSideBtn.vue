<template>
  <div class="share-side-btn">
    <Copy :content="shareHref" @copyCallback="copyCallback">
      <i></i>
      <p class="p">{{ $t('message.share') }}</p>
    </Copy>
  </div>
</template>

<script>
import { debounce } from '@/tool/utils';

export default {
  name: 'ShareSideBtn',
  props: {
    wallet: {
      type: Boolean,
      default: false,
    },
    tag: {
      type: String,
      default: 'default',
    },
  },
  data() {
    return {};
  },
  computed: {

    shareHref() {
      return window.location.origin + '/index?inviter=' + this.$store.state.address;
    },
  },
  methods: {
    copyCallback: debounce(function() {
      this.$toast.success(this.$t('message.copy'));
    }, 350),
  },
};
</script>

<style scoped>
.share-side-btn {
  position: absolute;
  right: -82px;
  top: 400px;
  z-index: 6;
  display: flex;
  align-items: center;
  width: 80px;
  height: 80px;
  background: #fff;
  border-radius: 10px;
  color: #330066;
  cursor: pointer;
  box-shadow: 0px 0px 2px 2px #ececec;
}
.share-side-btn i {
  display: inline-block;
  width: 45px;
  height: 45px;
  background: url('../assets/img/share.png') no-repeat;
  background-size: 100% 100%;
}
.share-side-btn .copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
}
.share-side-btn .copy .p {
  line-height: 1;
}

@media only screen and (max-width: 750px) {
  .share-side-btn {
    display: none;
  }
}
@media only screen and (min-width: 751px) {
  .share-side-btn {
    display: block;
  }
}
</style>
