<template>
  <div class="w-full flex flex-col justify-center items-center relative home">
    <img class="absolute img-bg" src="/images/bg_page.png" />
    <page-header class="z-10"></page-header>
    <router-view v-slot="{ Component }">
      <transition name="el-fade-in-linear">
        <keep-alive>
          <div
            class="flex-grow flex flex-col items-center z-10 box-border container">
            <component :is="Component"></component>
          </div>
        </keep-alive>
      </transition>
    </router-view>
    <div class="w-full line"></div>
    <page-footer class="z-10"></page-footer>
  </div>
</template>
<script setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import PageFooter from '@/components/PageFooter.vue'
import { useWallet } from 'solana-wallets-vue'

const { connected } = useWallet()
const router = useRouter()
watch(
  connected,
  (v) => {
    router.replace({ path: v ? '/invest/list' : '/home' })
  },
  { immediate: true }
)
</script>
<style lang="scss">
.home {
  background: var(--neutral-100);
  min-height: 100vh;

  .img-bg {
    width: 100%;
    z-index: 1;
    right: 0;
    top: -40px;
  }
}

.container {
  width: 100%;
  max-width: var(--page-max-width);
}

.line {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin-top: 4px;
}

::-webkit-scrollbar {
  width: 0;
  display: none;
}
</style>
