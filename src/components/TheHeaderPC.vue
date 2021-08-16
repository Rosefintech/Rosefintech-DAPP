<template>
  <div class="head-box" :class="{ white: bg == 'white' }">
    <div class="head-cont">
      <img class="logo" :src="imgUrlLogo" @click="tebChange('/index')" />
      <div class="page-list">
        <div
          :class="$route.path == '/index' ? 'active' : 'page'"
          @click="tebChange('/index')"
        >
          {{ $t('index.assets') }}
        </div>
        <div
          :class="$route.path == '/finance-list' ? 'active' : 'page'"
          @click="tebChange('/finance-list')"
        >
          {{ $t('finance.title') }}
        </div>
        <div
          :class="$route.path == '/home' ? 'active' : 'page'"
          @click="handleToReferendum"
        >
          {{ $t('message.govern') }}
        </div>
        <div
          class="page"
          :class="{
            news: $store.state.unreadNum > 0,
            active: $route.path == '/message',
          }"
          @click="$router.push('/message')"
        >
          {{ $t('message.title') }}
        </div>
      </div>
      <div class="operation">
        <div class="center" @click="connectWallet">
          <i></i>
          <p class="addr">{{ addStr }}</p>
        </div>
        <!-- <img
          class="icon icon-lang"
          @click="handleToggleLanguage"
          :src="imgUrlLang"
          :alt="$i18n.locale"
        /> -->
        <!-- <div class="lang-change">
          <p class="lang-text" @click="handleToggleLanguage">
            {{ langText }}
          </p>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/tool/utils';
import { governUrl } from '@/api/contract';

export default {
  name: '',
  props: {
    bg: {
      type: String,
      default: 'black',
    },
  },
  data() {
    return {
      active: 'home',
    };
  },
  computed: {
    addStr() {
      const address = this.$store.state.address;
      if (!address) {
        return this.$t('message.connectAdd');
      } else {
        return (
          address.substring(0, 4) +
          '.....' +
          address.substring(address.length - 5, address.length)
        );
      }
    },
    imgUrlLogo() {
      return this.bg == 'white'
        ? require('../assets/img/logo1.png')
        : require('../assets/img/logo.png');
    },
    imgUrlLang() {
      return this.$i18n.locale == 'zh-CN'
        ? require('../assets/img/en.png')
        : require('../assets/img/cn.png');
    },
    langText() {
      return this.$i18n.locale == 'en-US'
        ? this.$t('message.Chinese')
        : 'English';
    },
  },
  methods: {

    tebChange(route) {
      if (this.$route.path === route) {
        return;
      }
      this.$router.push(route);
    },
    handleToIndex() {
      if (this.$route.path !== '/index') this.$router.push('/index');
    },

    languageChange(lg) {
      this.$i18n.locale = lg;
      localStorage.setItem('lang', this.$i18n.locale);
    },

    handleToggleLanguage() {
      const toLang = this.$i18n.locale === 'en-US' ? 'zh-CN' : 'en-US';
      this.$store.commit('setLanguage', toLang);
    },

    connectWallet: debounce(function() {
      this.$store.dispatch('ethereumConnect');
    }, 350),


    handleToReferendum() {
      window.location.href = governUrl;
    },
  },
};
</script>

<style scoped>
.head-box {
  position: relative;
  width: 100%;
  height: 80px;
  background: #330066;
}
.white {
  background: rgba(255, 255, 255, 0);
}
.head-cont {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  text-align: left;
}
.head-cont .logo {
  width: 240px;
  cursor: pointer;
}
.page-list {
  display: flex;
  align-items: center;
  margin-left: 80px;
  margin-right: auto;
}
.page-list .page {
  position: relative;
  font-size: 18px;
  font-weight: 400;
  color: #fff;
  margin-left: 80px;
  cursor: pointer;
}
.white .page-list .page {
  font-size: 18px;
  font-weight: 400;
  color: #24355d;
  margin-left: 80px;
  cursor: pointer;
}
.page-list .active {
  font-size: 18px;
  font-weight: 400;
  color: #f90066;
  margin-left: 80px;
  cursor: pointer;
}
.white .page-list .active {
  color: #f90066;
}
.page-list .news::after {
  content: '';
  display: block;
  position: absolute;
  right: -5px;
  top: -1px;
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background: #f90066;
}
.operation {
  display: flex;
  align-items: center;
  height: 100%;
}
.operation .center {
  margin-right: 40px;
  cursor: pointer;
  pointer-events: auto;
}
.center .addr {
  color: #fff;
}
.white .center .addr {
  color: #24355d;
}
.operation .icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.operation .lang-change {
  cursor: pointer;
  position: relative;
  min-width: 4em;
}
.lang-change .lang-text {
  color: #fff;
}
.white .lang-change .lang-text {
  color: #24355d;
}
</style>
