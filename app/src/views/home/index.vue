<template>
  <div class="text-white text-size-48 font-bold">{{ $t('home.subtitle') }}</div>
  <div class="text-white text-size-24 mt-space-12">{{ $t('home.desc') }}</div>
  <el-image fit="fill" class="mt-space-16" style="width:500px; height:384px;" src="/images/img_home_bg.png"></el-image>
</template>
<script setup>
</script>
<script>
export default {
  name: 'Home'
}
</script>