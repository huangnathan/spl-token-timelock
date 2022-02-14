<template>
  <div class="w-full flex flex-col justify-center items-center relative home">
    <img class="absolute img-bg" src="/images/bg_page.png" />
    <page-header></page-header>
    <router-view v-slot="{ Component }">
      <transition name="el-fade-in-linear">
        <keep-alive>
          <div
            class="flex-grow flex flex-col justify-center items-center container">
            <component :is="Component"></component>
          </div>
        </keep-alive>
      </transition>
    </router-view>
    <div class="w-full line"></div>
    <page-footer></page-footer>
  </div>
</template>
<script setup>
import PageHeader from '@/components/PageHeader.vue'
import PageFooter from '@/components/PageFooter.vue'
</script>
<style lang="scss">
.home {
  background: var(--neutral-100);
  height: 100vh;

  .img-bg {
    width: 100%;
    z-index: 1;
    right: 0;
    top: -40px;
  }
}

.container {
  z-index: 10;
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
