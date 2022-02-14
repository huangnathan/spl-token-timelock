<template>
  <div class="text-green text-size-24">{{ $t('home.subtitle') }}</div>
  <el-button @click="clickSwitch">Switch lang</el-button>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { LANGUAGE_EN_US, LANGUAGE_ZH_HK } from '@/store/mutation-types'

const store = useStore()
const current = computed(() => store.getters.lang)

const clickSwitch = () => {
  console.error('-- clickSwitch:', current.value)
  store.dispatch('setLang', current.value === LANGUAGE_EN_US ? LANGUAGE_ZH_HK : LANGUAGE_EN_US)
}
</script>
<script>
export default {
  name: 'Home'
}
</script>
