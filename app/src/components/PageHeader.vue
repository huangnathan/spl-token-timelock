<template>
  <div class="w-full flex box-border justify-between items-center header">
    <img src="/images/logo_header.png" width="190" />
    <wallet-multi-button></wallet-multi-button>
  </div>
</template>
<script setup>
import { WalletMultiButton } from 'solana-wallets-vue'
</script>
<style>
.header {
  padding: 1.2rem 0;
  max-width: var(--page-max-width);
}

:root {
  --swv-button-background-color: var(--green);
}
</style>
