<template>
  <div class="dialog-protocol">
    <van-dialog
      class="dialog-box"
      :show-cancel-button="false"
      :show-confirm-button="false"
      v-model="visible"
      style="z-index: 3008"
    >
      <div class="dialog-content">
        <p class="p desc">
          Liquidity is provided by users. The functional interface is provided by Uniswap. You can also go to Uniswap V2 to exchange or provide liquidity.
        </p>
        <p class="p desc">
          <van-checkbox v-model="checked" shape="square" checked-color="#330066"
            >No remind again</van-checkbox
          >
        </p>

        <div class="btn-box">
          <button class="btn btn-dark" @click="hide">
            <!-- {{ $t('index.know') }} -->
            OK
          </button>
        </div>
      </div>
      <div class="cancel-box">
        <van-icon class="cancel-btn" name="close" @click="visible = false" />
      </div>
    </van-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: true,
      checked: false,
    };
  },

  created() {
    this.tt();
  },
  methods: {
    IsHide() {
      if(this.$route.path==='/swap'){
        if (this.checked === true) {
        localStorage.setItem("visible", false);
        this.visible = false;
      }
      }else if(this.$route.path==='/mining'){
         if (this.checked === true) {
        localStorage.setItem("visibleMining", false);
        this.visible = false;
      }
      }
    },
    tt() {
       if(this.$route.path==='/swap'){
          if (localStorage.getItem("visible") === "false") {
        this.visible = false;
        console.log(localStorage.getItem("visible"));
      }
       }else if(this.$route.path==='/mining'){
          if (localStorage.getItem("visibleMining") === "false") {
        this.visible = false;
        console.log(localStorage.getItem("visible"));
      }
       }

    },
    hide() {
      this.visible = false;
      this.IsHide();
    },
    show() {
      console.log(1);
      this.visible = true;
    },
  },
};
</script>
<style scoped>
::v-deep .van-checkbox__icon .van-icon {
    display: block;
    box-sizing: border-box;
    width: 1.25em;
    height: 1.25em;
    color: transparent;
    font-size: .6em !important;
    line-height: 1.25;
    text-align: center;
    border: 1px solid #c8c9cc;
    -webkit-transition-duration: .2s;
    transition-duration: .2s;
    -webkit-transition-property: color,border-color,background-color;
    transition-property: color,border-color,background-color;
    border-radius: 5px  !important;
}
::v-deep .van-checkbox__icon {
    -webkit-box-flex: 0;
    -webkit-flex: none;
    flex: none;
    height: auto;

    line-height: auto;
    cursor: pointer;
}
::v-deep .van-checkbox {
  justify-content: center;
  color: #fff;
}
::v-deep .van-icon-success::before {
    content: '\F0C8';
    color: #fff;
}
::v-deep .van-checkbox__label {
  margin-left: 8px;
  /* color: #323233; */
  color: #adb0ca;
  line-height: 20px;
}
.dialog-protocol .title {
  font-size: 30px;
  font-weight: 400;
  color: #091d42;
  line-height: 48px;
}
.dialog-protocol .desc {
  font-size: 32px;
  font-family: TsangerYunHei;
  font-weight: normal;
  color: #091d42;
  margin-top: 40px;
  margin-bottom: 60px;
  text-align: left;
  line-height: 48px;
  overflow: auto;
  text-align: justify;
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
