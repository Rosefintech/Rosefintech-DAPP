<template>
  <div class="guide">
    <div class="lang-change">
      <!-- <img
        class="img-lang"
        :src="
          $i18n.locale == 'zh-CN'
            ? require(`../assets/img/en.png`)
            : require(`../assets/img/cn.png`)
        "
        @click="handleToggleLanguage"
      /> -->
    </div>
    <swiper
      ref="mySwiper"
      class="my-swiper"

      @slideChange="onSlideChange"
      :options="swiperOptions"
    >
      <swiper-slide>
        <div class="guide_content">
           <div class="guidLogo"><img src="@/assets/img/guide/logo.png"></div>
           <div class="guidcenter"><img src="@/assets/img/guide/img1.png"></div>
           <div class="guidtext">
             <h2>Rosefintech</h2>
             <p>An open platform for on-chain smart funds based on financial automata.<br />
Combining Defi and Al breaks the traditional fund model and provides you with brand-new product choices and experiences.</p>
           </div>
        </div>

        <!-- <div class="s-title">Rosefintech</div>
        <div :class="$i18n.locale == 'en-US' ? 's-desc-en' : 's-desc'">
          {{ $t('guide.text1') }}
        </div>
        <div class="s-img-wrap">
          <img src="../assets/img/guide/s1.png" alt="" />
        </div> -->
      </swiper-slide>
      <swiper-slide>
        <!-- <div class="s-title">{{ $t('guide.tit2') }}</div>
        <div :class="$i18n.locale == 'en-US' ? 's-desc-en' : 's-desc'">
          {{ $t('guide.text2') }}
        </div>
        <div class="s-img-wrap">
          <img src="../assets/img/guide/s2.png" alt="" />
        </div> -->
                <div class="guide_content">
           <div class="guidLogo"><img src="@/assets/img/guide/logo.png"></div>
           <div class="guidcenter"><img src="@/assets/img/guide/img2.png"></div>
           <div class="guidtext">
             <h2>AI Autopilot </h2>
             <p>The trading decisions of products are all driven by series of complex AI with massive data, no human decision, no fear, no FUD, no human influence. <br />
AI sees more than us.</p>
           </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <!-- <div class="s-title">{{ $t('guide.tit3') }}</div>
        <div :class="$i18n.locale == 'en-US' ? 's-desc-en' : 's-desc'">
          {{ $t('guide.text3') }}
        </div>
        <div class="s-img-wrap">
          <img src="../assets/img/guide/s3.png" alt="" />
        </div> -->
                <div class="guide_content">
           <div class="guidLogo"><img src="@/assets/img/guide/logo.png"></div>
           <div class="guidcenter"><img src="@/assets/img/guide/img3.png"></div>
           <div class="guidtext">
             <h2>Safty Ever</h2>
             <p>Rosefintech is built on non-custody defi structure running on blockchain, with smart contract audited. No others including admin could take your asset away without your receipt. <br />
Yours asset will still be your asset.</p>
           </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <!-- <div class="s-title">{{ $t('guide.tit4') }}</div>
        <div class="s-descs">{{ $t('guide.text4') }}</div>
        <div class="s-img-wrap">
          <img src="../assets/img/guide/s4.png" alt="" />
        </div> -->
                        <div class="guide_content">
           <div class="guidLogo"><img src="@/assets/img/guide/logo.png"></div>
           <div class="guidcenter"><img src="@/assets/img/guide/img4.png"></div>
           <div class="guidtext">
             <h2>DAO</h2>
             <p>Major business decisions, profit distribution, product direction and other proposals and decisions are made publicly on blockchain. The governance token (ROS) obtained through contributions is your voting right.<br />
You are the decision maker of Rosefintech.</p>
           </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="lastPage">
             <div class="guidLogo"><img src="@/assets/img/guide/logo.png"></div>
                 <div class="guidtext1">
             <h2>Meet
Rosefintech
Foresee the <br />
Incoming World</h2>

           </div>
        </div>
        <!-- <div class="s-title">{{ $t('guide.tit5') }}</div>
        <div
          :class="$i18n.locale == 'en-US' ? 's-desc-en padding-en' : 's-desc'"
        >
          {{ $t('guide.text5') }}
        </div>
        <div class="s-img-wrap-s5">
          <img src="../assets/img/guide/s5.png" alt="" />
        </div> -->
        <!-- <div class="btn s-btn" @click="goFirstPage">
          {{ $t('guide.btn') }}
        </div> -->
      </swiper-slide>
    </swiper>
    <div v-if="activeIndex<4" class="swiper-pagination my-swiper-pagination">
      <span
        class="dot"
        :class="{ active: i === activeIndex }"
        v-for="i of pagi"
        :key="i"
      ></span>
    </div>
    <!-- <div class="footer">
      <img class="logo" src="../assets/img/guide-logo.png" />
    </div> -->
    <!-- <div class="swiper-button-next swiper-button-black"></div> -->
    <!-- <div v-if="activeIndex<4"   class="btn s-btn next" @click="next()" >
      Next
    </div> -->

    <div v-else class="btn s-btn btnEnter" @click="goFirstPage">
      <!-- {{ $t('guide.btn') }} -->
     <span class=""> Enter</span>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.min.css';

export default {
  name: '',
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      swiperOptions: {
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true,
        },
         navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
      },
      pagi: [0, 1, 2, 3, 4],
      activeIndex: 0,
    };
  },
  methods: {

    handleToggleLanguage() {
      const lang = this.$i18n.locale == 'en-US' ? 'zh-CN' : 'en-US';
      this.$store.commit('setLanguage', lang);
    },
    onSlideChange({ activeIndex }) {
      this.activeIndex = activeIndex;
    },
    next(){

        if(this.activeIndex<5){

            this.activeIndex ++;


          this.$refs.mySwiper.$swiper.activeIndex=this.activeIndex

        }
    },
    goFirstPage() {
      this.$store.commit('setIsShowGuide', false);

      const pathName = 'Index';
      this.$router.replace({
        name: pathName,
        query: this.$route.query,
        params: this.$route.params,
      });
    },
  },
};
</script>

<style scoped>
.guidtext1{
  font-size: 65px !important;

font-family: TsangerYunHei;
font-weight: normal;
color: #330066;
line-height: 150px;
text-align: center;
max-width: 600px;
margin: 0 auto;
margin-top: 150px !important;
}
.lastPage{
  width: 100%;
  height: 100%;
  background: url('../assets/img/guide/img5.png') no-repeat;
  background-size:cover ;
  padding:30px;
  box-sizing: border-box;
  text-align: left;
}
.guide_content{
  text-align: left;
  padding: 30px;
  /* margin-top: 15vh; */
}
.guidLogo img{
  width: 300px;
}
.guidLogo{
  margin-top:4vh;
  padding-left: 30px;
}
.swiper-slide{
  background: url('../assets/img/guide/bg.png') no-repeat !important ;
  background-size: cover  !important;
  padding-top: 0px !important;

}
.guidcenter img{width: 100%;}
.guidtext h2{font-size: 72px;
font-family: TsangerYunHei;
font-weight: normal;
color: #091D42;    margin: 0px;
margin-bottom: 30px;
margin-top: 30px;
    text-align: center;}
.guidtext p{
      text-align: justify;
  font-size: 28px;
font-family: TsangerYunHei;
font-weight: normal;
color: #ADB0CA;
line-height: 48px;
    padding: 0px 60px;
}
.my-swiper-pagination {
    width: 100%;
    height: 0.26667rem;
    bottom: 13vh;
    text-align: center;
    /* padding: 0px 30px; */
}


.my-swiper-pagination {
    width: 100%;
    height: 0.26667rem;
    bottom: 9vh !important;
    /* padding-left: 10%  !important; */
}
@media only screen and (min-width: 750px) {
  .guidtext{
    max-width: 1000px;
    margin: 0 auto;
  }
  .btnEnter{
    position: relative;
    background: #330066;
    bottom: 120px;
    z-index: 44;
  }
  .next{
    position:relative !important;
  width: 179px !important;
height: 82px !important;
background: #330066;
border-radius: 40px;
right: 8% !important;
   z-index: 99;
   bottom: 60px;
   bottom: 1.8rem;
    left: 80%;
    margin: 0;
}
  .guidcenter img{width: 600px; display: block; margin: 0 auto;}
  .guide,
  .swiper-container {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 1200px;
    max-width: 1500px;
    margin: 0 auto;
    font-family: TsangerYunHei;
  }
  .swiper-container {
    height: 1160px;
    background: #fff;
    min-height: 1160px;
    border-radius: 40px;
  }
  .s-desc {
    margin: 60px auto 80px;
    width: 870px;
  }
  .s-descs,
  .s-desc-en {
    margin: 60px auto 80px;
    width: 1030px;
    font-weight: 400;
  }
  .padding-en {
    margin: 60px auto 40px;
    width: 1030px;
  }
  .footer {
    position: relative;
    background-color: #f5f6fd;
    z-index: 10;
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .my-swiper-pagination {
    position: relative;
    top: -60px;
    max-width: 1500px;
    box-sizing: border-box;

  }

}
@media only screen and (max-width: 750px) {
  .guidcenter{text-align:center;margin-top: 60px; margin-bottom: 60px;}
  .guidcenter img{
 width: 85%;
 margin: 0 auto;
 position: relative;
}
  .next{
  width: 179px !important;
height: 82px !important;
background: #330066;
border-radius: 40px;
left: 80% !important;
    bottom: 6vh !important;
}
  .s-btn {
  position: fixed;
  /* margin: 20px auto 0; */
  width: 460px;
  height: 80px;
  padding: 0px;
  line-height: 80px;
  text-align: center;
  font-size: 30px;
  color: #fff;
  background: #f90066;
  border-radius: 40px;
  transform: translateX(-50%);
  left: 50%;
  bottom:8vh;
  z-index: 100;
}
  .guide,
  .swiper-container {
    position: relative;
    width: 100%;
    height: 100vh;
    max-width: 750px;
    background: #fff;
    margin: 0 auto;
    font-family: TsangerYunHei;
  }
  .my-swiper-pagination {
    position: fixed;
    max-width: 750px;
  }
  .s-desc {
    margin: 60px auto 80px;
    width: 580px;
  }
  .s-desc-en {
    margin: 60px auto 80px;
    width: 580px;
    font-weight: 400;
  }
  .s-descs {
    width: 550px;
  }
  .padding-en {
    margin: 60px auto 40px;
    width: 660px;
  }
  .footer {
    position: relative;
    bottom: 9vh;
    background-color: #fff;
    z-index: 10;
    padding-bottom: 20px;
  }
  .my-swiper-pagination {
    position: fixed;
  }
}
.guide .lang-change {
  text-align: right;
  position: absolute;
  top: 40px;
  right: 30px;
  z-index: 10;
}
.guide .lang-change .img-lang {
  width: 46px;
  height: 46px;
}

.swiper-slide {
  color: #fff;
  font-size: 20px;

  text-align: center;
  background: #fff;
  padding-top: 8vh;
  box-sizing: border-box;
}
.s-title {
  font-size: 50px;
  font-family: TsangerYunHei;
  color: #091d42;
  line-height: 1;
}
.s-desc {
  margin: 60px auto 80px;
  /* width: 545px; */
  font-size: 26px;
  font-family: TsangerYunHei;
  color: #adb0ca;
  line-height: 58px;
  text-align: center;
}
.s-desc-en {
  margin: 60px auto 80px;
  /* width: 580px; */
  font-size: 26px;
  font-family: TsangerYunHei;
  color: #adb0ca;
  line-height: 58px;
  text-align: center;
}
.padding-en {
  margin: 60px auto 40px;
}
.s-descs {
  margin: 60px auto 80px;
  font-size: 26px;
  font-family: TsangerYunHei;
  color: #adb0ca;
  line-height: 58px;
  text-align: center;
}
.s-img-wrap {
  width: 640px;
  height: 40vh;
  margin: 0 auto;
}
.s-img-wrap-s5 {
  width: 640px;
  height: 36vh;
  margin: 0 auto;
}
.s-img-wrap-s5 img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.s-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.my-swiper-pagination {
  width: 100%;
  height: 20px;
  bottom: 13vh;
}
.my-swiper-pagination .dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #330066;
  opacity: 1;
  transition: all 0.2s;
}
.my-swiper-pagination .dot:not(:last-child) {
  margin-right: 26px;
}
.my-swiper-pagination .active {
  width: 30px;
  border-radius: 20px;
  border: none;
  background-color: #f90066 !important;
}
.guide .footer {
  position: relative;
  z-index: 10;
  padding-bottom: 20px;
}
.guide .footer img {
  width: 148px;
}
.guide .footer .text {
  font-size: 18px;
  font-family: TsangerYunHei;
  font-weight: 400;
  color: #adb0ca;
  line-height: 48px;
}
</style>
