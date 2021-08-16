<template>
  <div class="index-header-wrapper">
    <div class="mobile">
      <header class="header-wrap">
        <!-- :class="{ news: $store.state.unreadNum > 0 }" -->
        <div class="side left"  :class="{ news: $store.state.unreadNum > 0 }" >
          <!-- <svg
            t="1620640787720"
            class="icon icon-notice"
            viewBox="0 0 1024 1024"
            version="1.1" xmlns="http:
            p-id="1614" width="32" height="32"
            @click="$router.push('/message')"
          >
            <path d="M877.625 797.037l-74.1-130.387v-262.8c0-100.688-75.712-209.625-186-249.562C612.125 100.925 576.425 62 529.7 62c-46.65 0-82.462 38.925-87.75 92.25-110.25 39.975-185.962 148.912-185.962 249.6v262.8l-77.7 136.763a29.137 29.137 0 0 0 25.275 43.5h184.95A144.45 144.45 0 0 0 529.737 962a144.375 144.375 0 0 0 141.188-115.088h186.263a29.063 29.063 0 0 0 20.437-49.875zM529.737 120.35c10.5 0 18.975 7.987 24.376 19.875-8.063-0.825-15.9-2.737-24.376-2.737-8.475 0-16.312 1.874-24.375 2.737 5.4-11.887 13.876-19.875 24.375-19.875z m0 783.375c-36.975 0-67.875-23.775-79.912-56.813H609.65c-12 33-42.863 56.775-79.913 56.775zM253.7 788.712l56.775-99.975a28.688 28.688 0 0 0 3.9-14.4V403.85c0-98.213 92.063-208.05 215.362-208.05 123.3 0 215.475 109.875 215.475 208.05v270.488c0 5.024 1.313 10.125 3.788 14.4l56.85 99.974H253.7z" p-id="1615" fill="#ffffff"></path>
          </svg> -->
          <van-popover
  v-model="showPopover"
  trigger="click"

  @select="onSelect"
  placement="bottom-start"
>
 <van-grid

    clickable
    :border="false"
    column-num="1"
    style="width: 140px;"
  >
    <van-grid-item
       @click="copyCallback"
    ><div class="ttit"><img width="24px" src="@/assets/img/ico_fx@2x.png" /> <span>{{$t('index.share')}}</span></div></van-grid-item>
    <van-grid-item
      @click="goMessages()"
      :class="{ news: $store.state.unreadNum > 0 }"
  ><div class="ttit"><img width="24px" src="@/assets/img/ico_me@2x.png" /> <span>{{$t('index.messages')}}</span></div> </van-grid-item>
    <van-grid-item
      @click="goHelp()"
     ><div class="ttit"><img width="24px" src="@/assets/img/ico_tu@2x.png" /> <span>{{$t('index.help')}}</span></div></van-grid-item>
    <van-grid-item
      @click="goAbout()"
     ><div class="ttit"><img width="24px" src="@/assets/img/ico_about@2x.png" /> <span>{{$t('index.about')}}</span></div> </van-grid-item>
  </van-grid>
  <template #reference>
   <van-icon name="wap-nav" class="bgColor" />
  </template>
</van-popover>
        </div>
        <img class="center img-logo img-logo-white" src="../../assets/img/logo.png" alt="">
        <div class="side right">
          <!-- <img class="icon icon-lang" @click="handleToggleLanguage" :src="imgUrlLang" :alt="$i18n.locale"> -->
          <!-- <Copy :content="shareHref" @copyCallback="copyCallback">
            <img
              class="icon icon-share"
              src="../../assets/img/share-white.png"
              alt="Share"
            />
          </Copy> -->
        </div>
      </header>
    </div>
    <div class="pc">
      <TheHeaderPC class="head"></TheHeaderPC>
    </div>
    <div class="bg-dark"></div>
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
      Share:require("@/assets/img/ico_fx@2x.png"),

       showPopover: false,

      actions: [{ text: this.$t('index.share') }, { text: this.$t('index.messages') }, { text: this.$t('index.help') },{ text: this.$t('index.about') }],
    };
  },
  computed: {
    imgUrlLang() {
      return this.$i18n.locale == 'zh-CN' ? require('../../assets/img/en.png') : require('../../assets/img/cn.png')
    },

    shareHref() {
      return window.location.origin + '/index?inviter=' + this.$store.state.address;
    },
  },
  methods: {
    goAbout(){
        location.href='https:
      this.showPopover = false
    },
    goHelp(){
      location.href='https:
      this.showPopover = false
    },
    goMessages(){
     this.$router.push('/message');
     this.showPopover = false
    },
     onSelect(action) {
      this.copyCallback();
       console.log(action)

    },
    handleToggleLanguage() {
      const lang = this.$i18n.locale == 'en-US' ? 'zh-CN' : 'en-US';
      this.$store.commit('setLanguage', lang);
    },
    handleFinancial() {
      this.$router.push('/finance-list')
    },
    handleToken() {
      this.$router.push('/home')
    },
    copyCallback: debounce(function() {

      this.$store.dispatch('showShareQR');
      this.showPopover = false
    }, 50),
  },
};
</script>

<style scoped>
.ttit{
  display: flex;
    align-items: center;
    width: 100%;
    padding-left: 20px;
    box-sizing: border-box;
}
.ttit img{margin-right: 10px;}
::v-deep .van-grid-item__content{
padding:16px 0px;
}
.ttit span{
  font-size: 28px;font-family: TsangerYunHei;
}
::v-deep .van-grid-item__text {
    color: #646566;
     font-size: 24px;
    line-height: 1.5;
    word-break: break-all;
    width: 100%;
    padding-left: 20px;
    box-sizing: border-box;
}
.bgColor{
  color: #fff;
  font-size: 48px;
}
.index-header-wrapper .header-wrap {
  display: flex;
  align-items: center;
  height: 110px;
  background-color: #330066;
  padding: 0 30px;
}
.header-wrap .side {
  flex: 1;
}
.header-wrap .left {
  position: relative;
  text-align: left;
}
.header-wrap .news::after, .van-grid-item.news::after  {
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
.van-grid-item.news::after {
  top: 5px;
}
.header-wrap .icon-notice {
  width: 44px;
  height: 44px;
}
.header-wrap .center {
  width: 320px;
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
.bg-dark {
  height: 130px;
  border-radius: 0 0 50px 50px;
  background-color: #330066;
}
</style>
