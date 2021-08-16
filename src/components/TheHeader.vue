<template>
  <div class="header-common">
    <div class="mobile">
      <van-nav-bar
        :title="title"
        left-text=""
        left-arrow
        :border="false"
        @click-left="$emit('click-left')"
      >
        <template #right>
          <!-- <img
            class="icon icon-lang"
            @click="handleToggleLanguage"
            :src="imgUrlLang"
            :alt="$i18n.locale"
          /> -->
        </template>
      </van-nav-bar>
    </div>
    <TheHeaderPC class="pc"></TheHeaderPC>
  </div>
</template>

<script>
import TheHeaderPC from '@/components/TheHeaderPC.vue';

export default {
  name: '',
  components: {
    TheHeaderPC,
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    imgUrlLang() {
      return this.$i18n.locale == 'zh-CN'
        ? require('../assets/img/en.png')
        : require('../assets/img/cn.png');
    },
  },
  methods: {
    handleToggleLanguage() {
      const lang = this.$i18n.locale == 'en-US' ? 'zh-CN' : 'en-US';
      this.$store.commit('setLanguage', lang);
    },
  }
};
</script>

<style scoped>
.header-common .icon {
  width: 44px;
  height: 44px;
}
</style>
