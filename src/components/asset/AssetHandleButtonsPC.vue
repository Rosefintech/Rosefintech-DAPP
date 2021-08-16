<template>
  <div class="asset-btns-wrap pc">
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
  position: relative;
  width: 100%;
  margin-top: 48px;
}
.asset-btns-wrap .btns-container {
  height: 100%;
  max-width: 1500px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.asset-btns-wrap .btn {
  width: 200px;
  height: 60px;
  line-height: 60px;
  margin: 0 28px;
  background: #330066;
  border: 2px solid #fff;
  border-radius: 30px;
  text-align: center;
  font-size: 28px;
  font-weight: 500;
  color: #fff;
}
</style>