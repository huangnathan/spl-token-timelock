<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import init from '@/core/init'

onMounted(() => {
  init()
})
</script>
<style lang="scss">
@import 'assets/style/global.scss';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
