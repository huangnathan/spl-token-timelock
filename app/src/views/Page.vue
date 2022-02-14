<template>
  <div class="w-full flex flex-col home">
    <page-header></page-header>
    <router-view v-slot="{ Component }">
      <transition name="el-fade-in-linear">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>
<script setup>
import PageHeader from '@/components/PageHeader.vue'
</script>
<style lang="scss">
.home {
  max-width: 1940px;
}

::-webkit-scrollbar {
  width: 0;
  display: none;
}
</style>
