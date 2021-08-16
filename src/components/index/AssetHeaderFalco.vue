<template>
  <div class="index-header-wrapper">
    <div class="bg"></div>
    <div class="mobile">
      <header class="header-wrap">
        <div class="side left" :class="{ news: $store.state.unreadNum > 0 }">
          <svg t="1620640787720" class="icon icon-notice" viewBox="0 0 1024 1024" version="1.1" xmlns="http:
            <path d="M877.625 797.037l-74.1-130.387v-262.8c0-100.688-75.712-209.625-186-249.562C612.125 100.925 576.425 62 529.7 62c-46.65 0-82.462 38.925-87.75 92.25-110.25 39.975-185.962 148.912-185.962 249.6v262.8l-77.7 136.763a29.137 29.137 0 0 0 25.275 43.5h184.95A144.45 144.45 0 0 0 529.737 962a144.375 144.375 0 0 0 141.188-115.088h186.263a29.063 29.063 0 0 0 20.437-49.875zM529.737 120.35c10.5 0 18.975 7.987 24.376 19.875-8.063-0.825-15.9-2.737-24.376-2.737-8.475 0-16.312 1.874-24.375 2.737 5.4-11.887 13.876-19.875 24.375-19.875z m0 783.375c-36.975 0-67.875-23.775-79.912-56.813H609.65c-12 33-42.863 56.775-79.913 56.775zM253.7 788.712l56.775-99.975a28.688 28.688 0 0 0 3.9-14.4V403.85c0-98.213 92.063-208.05 215.362-208.05 123.3 0 215.475 109.875 215.475 208.05v270.488c0 5.024 1.313 10.125 3.788 14.4l56.85 99.974H253.7z" p-id="1615" fill="#3a486f"></path>
          </svg>
        </div>
        <img
          class="center img-logo img-logo-white"
          src="../../assets/img/logo1.png"
          alt=""
        />
        <div class="side right">
          <!-- <img
            class="icon icon-lang"
            @click="handleToggleLanguage"
            :src="imgUrlLang"
            :alt="$i18n.locale"
          /> -->
          <Copy :content="shareHref" @copyCallback="copyCallback">
            <img
              class="icon icon-share"
              src="../../assets/img/share.png"
              alt="Share"
            />
          </Copy>
        </div>
      </header>
    </div>
    <TheHeaderPC :bg="'white'" class="head pc"></TheHeaderPC>

    <div class="tree-wrap">
      <img class="tree-img" :src="imgUrl" alt="" />
      <p class="days">{{ dayNum }}{{ $t('index.day') }}</p>
    </div>
    <!-- <div class="tree-wrap tree-wrap-empty"></div> -->
  </div>
</template>

<script>
import { debounce } from '@/tool/utils';
import TheHeaderPC from '@/components/TheHeaderPC.vue';

export default {
  name: '',
  components: {
    TheHeaderPC,
  },
  data() {
    return {
      page: 'index2',
      imgUrl: require('../../assets/img/tree/tree01.png'),
      timer: null,
      index: 0,
      treeImgList: [
        require('../../assets/img/tree/tree01.png'),
        require('../../assets/img/tree/tree02.png'),
        require('../../assets/img/tree/tree03.png'),
        require('../../assets/img/tree/tree04.png'),
        require('../../assets/img/tree/tree05.png'),
        require('../../assets/img/tree/tree06.png'),
        require('../../assets/img/tree/tree07.png'),
        require('../../assets/img/tree/tree08.png'),
        require('../../assets/img/tree/tree09.png'),
        require('../../assets/img/tree/tree10.png'),
        require('../../assets/img/tree/tree11.png'),
        require('../../assets/img/tree/tree12.png'),
        require('../../assets/img/tree/tree13.png'),
        require('../../assets/img/tree/tree14.png'),
        require('../../assets/img/tree/tree15.png'),
        require('../../assets/img/tree/tree16.png'),
        require('../../assets/img/tree/tree17.png'),
        require('../../assets/img/tree/tree18.png'),
        require('../../assets/img/tree/tree19.png'),
        require('../../assets/img/tree/tree20.png'),
        require('../../assets/img/tree/tree21.png'),
        require('../../assets/img/tree/tree22.png'),
        require('../../assets/img/tree/tree23.png'),
      ],
    };
  },
  computed: {
    imgUrlLang() {
      return this.$i18n.locale == 'zh-CN'
        ? require('../../assets/img/en.png')
        : require('../../assets/img/cn.png');
    },
    dayNum() {
      const startTime = new Date('2021/04/26').getTime();
      const diff = Math.floor((Date.now() - startTime) / 86400000);
      return diff;
    },

    shareHref() {
      return window.location.origin + '/index?inviter=' + this.$store.state.address;
    },
  },
  mounted() {
    this.changeTree();
  },
  methods: {
    changeTree() {
      let date = new Date();
      let year = date.getFullYear();
      let mounth = date.getMonth() + 1;




      if (year == 2021) {
        if (mounth < 5) {
          this.imgUrl = this.treeImgList[0];
        } else {
          this.imgUrl = this.treeImgList[mounth - 4];
        }
      } else if (year == 2022) {
        if (mounth < 4) {
          this.imgUrl = this.treeImgList[10 + mounth - 1];
        } else if (mounth < 10) {
          this.imgUrl = this.treeImgList[13];
        } else {
          this.imgUrl = this.treeImgList[14];
        }
      } else if (year == 2023) {
        if (mounth < 4) {
          this.imgUrl = this.treeImgList[15];
        } else if (mounth < 10) {
          this.imgUrl = this.treeImgList[16];
        } else {
          this.imgUrl = this.treeImgList[17];
        }
      } else if (year == 2024) {
        if (mounth < 4) {
          this.imgUrl = this.treeImgList[17];
        } else {
          this.imgUrl = this.treeImgList[18];
        }
      } else if (year == 2025) {
        if (mounth < 4) {
          this.imgUrl = this.treeImgList[18];
        } else {
          this.imgUrl = this.treeImgList[19];
        }
      } else if (year == 2026) {
        if (mounth < 4) {
          this.imgUrl = this.treeImgList[19];
        } else {
          this.imgUrl = this.treeImgList[20];
        }
      } else if (year == 2028) {
        if (mounth < 4) {
          this.imgUrl = this.treeImgList[20];
        } else {
          this.imgUrl = this.treeImgList[21];
        }
      } else if (year == 2030) {
        if (mounth < 4) {
          this.imgUrl = this.treeImgList[21];
        } else {
          this.imgUrl = this.treeImgList[22];
        }
      } else {
        this.imgUrl = this.treeImgList[22];
      }
    },
    handleToggleLanguage() {
      const lang = this.$i18n.locale == 'en-US' ? 'zh-CN' : 'en-US';
      this.$store.commit('setLanguage', lang);
    },
    handleFinancial() {
      this.$router.push('/finance-list');
    },
    copyCallback: debounce(function() {

      this.$store.dispatch('showShareQR');
    }, 50),
  },
};
</script>

<style scoped>
.index-header-wrapper .header-wrap {
  display: flex;
  align-items: center;
  height: 110px;
  position: relative;
  background-color: transparent;
  padding: 0 30px;
}
.header-wrap .side {
  flex: 1;
}
.header-wrap .center {
  width: 319px;
}
.header-wrap .left {
  position: relative;
  text-align: left;
}
.header-wrap .icon-notice {
  width: 44px;
  height: 44px;
}
.header-wrap .news::after {
  content: '';
  display: block;
  position: absolute;
  left: 30px;
  top: -5px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: #F90066;
}
.header-wrap .right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.header-wrap .right .copy {
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-wrap .right .icon {
  width: 44px;
  height: 44px;
}
.header-wrap .right .icon-share {
  width: 44px;
  height: 44px;
  margin-left: 20px;
}
.tree-wrap .days {
  min-width: 107px;
  padding: 0 10px;
  height: 40px;
  line-height: 40px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  color: #fff;
  font-size: 24px;
  position: absolute;
  bottom: 140px;
  right: 60px;
}
.tree-wrap .tree-img {
  width: 100%;
  height: 672px;
  object-fit: contain;
}
@media only screen and (max-width: 750px) {
  .index-header-wrapper {
    height: 1027px;
  }
  .bg {
    position: absolute;
    width: 100%;
    height: 1027px;
    background: url('../../assets/img/index/bg.png') no-repeat;
    background-size: 100% 100%;
  }
  .tree-wrap {
    position: relative;
    width: 602px;
    height: 672px;
    margin: 55px auto 26px;
  }
  .tree-wrap .tree-img {
    width: 100%;
    height: 672px;
    object-fit: contain;
  }
  .pc {
    display: none !important;
  }
  .mobile {
    display: block;
    touch-action: auto;
  }
}
@media only screen and (min-width: 751px) {
  .index-header-wrapper {
    height: 535px;
  }
  .bg {
    position: absolute;
    width: 100%;
    height: 535px;
    background: url('../../assets/img/index/bg-pc.png') no-repeat;
    background-size: 100% 100%;
  }
  .tree-wrap {
    position: relative;
    width: 602px;
    height: 400px;
    margin: 0px auto;
  }
  .tree-wrap .tree-img {
    width: 100%;
    height: 370px;
    object-fit: contain;
  }
  .pc {
    display: block !important;
  }
  .pc-bg {
    background: rgba(255, 255, 255, 0.1);
    position: relative;
    z-index: 1000;
  }
  .mobile {
    display: none !important;
    touch-action: auto !important;
  }
}
</style>
