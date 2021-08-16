<template>
  <div class="asset-btns-wrap mobile">
    <div class="btns-container">
      <div v-if="isRos" class="btn swap" @click="$router.push({ path: '/swap', query: { name } })">{{ $t('asset.swap') }}</div>
      <div v-if="isRos" class="btn mining" @click="$router.push({ path: '/mining', query: { name } })">{{ $t('asset.liquidity') }}</div>
      <div v-if="!isSwift" class="btn transfer" @click="$router.push({ path: '/transfer', query: { name } })">{{ $t('asset.send') }}</div>
      <div class="btn collection" @click="$router.push({ path:'/receipt', query: { name } })">{{ $t('asset.receive') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'ROS',
    }
  },
  computed: {
    isRos() {
      return this.$route.query.name === 'ROS'
    },
    isSwift() {
      return this.$route.query.name === 'Swift'
    }
  },
  methods: {
    handleClick(type) {
      this.$emit('btnEvent', type)
    }
  }
}
</script>
<style scoped>
.asset-btns-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 144px;
  overflow-y: auto;
}
.asset-btns-wrap .btns-container {
  height: 100%;
  max-width: 1680px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 40px 40px 0px 0px;
  background: #fff;
  padding: 0 4px;
}
.asset-btns-wrap .btn {
  min-width: 140px;
  height: 80px;
  padding: 0 17px;
  margin: 0 4px;
  line-height: 80px;
  background: #330066;
  border-radius: 40px;
  text-align: center;
  font-size: 28px;
  color: #fff;
}
</style>