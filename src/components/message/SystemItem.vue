<template>
  <div
    class="rosefinch-log-item"
    @click="handleShowAll"
    v-show="![10, 11, 12, 13].includes(item.type)"
  >
    <div class="line-1">
      <img class="icon" src="../../assets/img/icon-msg.png" alt="">
      <div class="title">
        {{ getTitleText(item) }}
      </div>
      <div class="date">{{ item.time }}</div>
    </div>
    <div class="line-2">
      <div class="desc" :class="{ all: showAll }" v-html="getMessageText(item)">
        
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showAll: false,
    };
  },
  methods: {
    getTitleText(item) {
      return this.$i18n.locale === 'zh-CN' ? item.title : item.e_title;
    },
    getMessageText(item) {
      return this.$i18n.locale === 'zh-CN' ? item.message : item.e_message;
    },
    handleShowAll() {
      this.showAll = !this.showAll;
    },
  },
};
</script>

<style scoped>
.rosefinch-log-item {
  width: 100%;
  padding: 20px 0;
  font-size: 24px;
  font-family: TsangerYunHei;
  font-weight: 400;
  color: #adb0ca;
  border-bottom: 1px solid #f5f6fd;
}
.line-1,
.line-2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.line-1 {
  margin-left: -20px;
}
.line-1 .icon {
  width: 32px;
  height: 32px;
}
.line-2 {
  margin-top: 20px;
  padding-left: 20px;
}
.btn-redeem {
  width: 140px;
  height: 60px;
  line-height: 60px;
  background: #fff;
  border: 2px solid #330066;
  border-radius: 30px;
  margin-left: auto;
  margin-right: 0;
}
.rosefinch-log-item .title {
  font-size: 26px;
  font-weight: 500;
  color: #091d42;
  text-align: left;
  flex: 5;
  padding-left: 8px; 
}
.rosefinch-log-item .date {
  font-size: 24px;
  font-weight: 500;
  flex: 4;
  text-align: right;
}
.rosefinch-log-item .desc {
  height: 1.4em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rosefinch-log-item .all {
  height: unset;
  text-overflow: initial;
  white-space: pre-wrap;
}
</style>
