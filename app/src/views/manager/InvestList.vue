<template>
  <div class="w-full flex flex-col">
    <div class="w-full flex justify-around items-center">
      <text class="text-white text-size-32 font-bold">{{ $t('invest.list') }}</text>
      <div class="btn-common px-space-32" @click="$router.push({ path: '/invest/create' })">
        + {{ $t('invest.create') }}
      </div>
    </div>
    <div class="w-full">列表</div>
  </div>
</template>
<script setup></script>
<style lang="scss"></style>
