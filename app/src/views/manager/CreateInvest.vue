<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex items-center mt-space-16">
      <el-icon color="white"><arrow-left /></el-icon>
      <text class="text-white text-size-16">{{ $t('back') }}</text>
    </div>
    <div class="w-full flex flex-col box-border px-space-64 py-space-32">
      <div
        class="w-full flex flex-col box-border text-light-9a text-size-12 card">
        <text class="text-white text-size-32 font-bold">{{
          $t('invest.create')
        }}</text>
        <text class="mt-space-24">0x21523423423434</text>

        <div class="w-full flex flex-row justify-between mt-space-32">
          <div class="flex-grow flex flex-col mr-space-32">
            <text>{{ $t('invest.num') }}</text>
            <el-input-number
              v-model="inputNum"
              class="w-full mt-space-8"
              size="large"
              style="width: 100%"
              :controls="false"
              :min="0"
              :max="100"></el-input-number>
          </div>
          <div class="flex-grow flex flex-col">
            <text>{{ $t('invest.token') }}</text>
            <el-input
              v-model="inputToken"
              class="w-full mt-space-8"
              size="large"
              :placeholder="$t('invest.input.token')"></el-input>
          </div>
        </div>

        <div class="w-full flex flex-col mt-space-32">
          <text>{{ $t('invest.investor') }}</text>
          <el-input
            v-model="inputInvestor"
            class="w-full mt-space-8"
            size="large"
            :placeholder="$t('invest.input.investor')"></el-input>
        </div>

        <div class="w-full flex flex-col mt-space-32">
          <text>{{ $t('invest.account') }}</text>
          <el-input
            v-model="inputAccount"
            class="w-full mt-space-8"
            size="large"
            :placeholder="$t('invest.input.account')"></el-input>
        </div>

        <div class="w-full flex flex-row justify-between mt-space-32">
          <div class="flex-grow flex flex-col mr-space-32">
            <text class="mb-space-8">{{ $t('invest.start.date') }}</text>
            <el-date-picker
              v-model="startDate"
              type="date"
              style="width: 100%"
              :placeholder="$t('invest.input.start.date')"
              :disabled-date="disableStart"></el-date-picker>
          </div>
          <div class="flex-grow flex flex-col">
            <text class="mb-space-8">{{ $t('invest.start.time') }}</text>
            <el-time-picker
              v-model="startTime"
              style="width: 100%"
              :placeholder="$t('invest.input.start.time')"></el-time-picker>
          </div>
        </div>

        <div class="w-full flex flex-row justify-between mt-space-32">
          <div class="flex-grow flex flex-col mr-space-32">
            <text class="mb-space-8">{{ $t('invest.end.date') }}</text>
            <el-date-picker
              v-model="endDate"
              type="date"
              style="width: 100%"
              :placeholder="$t('invest.input.end.date')"
              :disabled-date="disableStart"></el-date-picker>
          </div>
          <div class="flex-grow flex flex-col">
            <text class="mb-space-8">{{ $t('invest.end.time') }}</text>
            <el-time-picker
              v-model="endTime"
              style="width: 100%"
              :placeholder="$t('invest.input.end.time')"></el-time-picker>
          </div>
        </div>

        <div class="flex items-center mt-space-32">
          <text class="mr-space-8">{{ $t('invest.advanced') }}</text>
          <el-switch v-model="openAdvanced" active-color="#61e290" />
        </div>

        <div class="w-full flex mt-space-32">
          <div class="flex-grow flex flex-col">
            <text class="mb-space-8">{{ $t('invest.cliff.date') }}</text>
            <el-date-picker
              v-model="cliffDate"
              type="date"
              style="width: 100%"
              :placeholder="$t('invest.input.cliff.date')"
              :disabled-date="disableStart"></el-date-picker>
          </div>
          <div class="flex-grow flex flex-col mx-space-32">
            <text class="mb-space-8">{{ $t('invest.cliff.time') }}</text>
            <el-time-picker
              v-model="cliffTime"
              style="width: 100%"
              :placeholder="$t('invest.input.cliff.time')"></el-time-picker>
          </div>
          <div class="flex-grow flex flex-col">
            <text class="mb-space-8">{{ $t('invest.cliff.percent') }}</text>
            <el-input-number
              v-model="inputCliffPercent"
              style="width: 100%"
              :controls="false"
              :min="0"
              :max="100"
              size="large"></el-input-number>
          </div>
        </div>

        <div class="w-full flex mt-space-32">
          <div class="flex flex-col" style="flex:1 1">
            <text class="mb-space-8">{{ $t('invest.tge.percent') }}</text>
            <el-input-number
              v-model="inputTgePercent"
              style="width: 100%"
              size="large"
              :controls="false"
              :min="0"
              :max="100"></el-input-number>
          </div>
          <div style="flex:1 1" class="mx-space-32"></div>
          <div style="flex:1 1"></div>
        </div>

        <text class="mt-space-32">{{ $t('invest.desc') }}</text>

        <div
          class="btn-common px-space-64 mt-space-32"
          @click="clickCreate">+ {{ $t('invest.create') }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { throttle } from '@/utils'
import { ArrowLeft } from '@element-plus/icons-vue'

const inputNum = ref(0)
const inputToken = ref(0)
const inputInvestor = ref(0)
const inputAccount = ref(0)
const startDate = ref()
const startTime = ref()
const endDate = ref()
const endTime = ref()
const disableStart = (date) => date.getTime() < Date.now()
const openAdvanced = ref(false)
const cliffDate = ref()
const cliffTime = ref()
const inputCliffPercent = ref(0)
const inputTgePercent = ref(0)

const clickCreate = throttle(() => {})
</script>
<style lang="scss" scoped>
.card {
  border-radius: 1.6rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: #282828;
  padding: 2rem 1.6rem;
}

:deep(.el-input) {
  background: transparent;
}
:deep(.el-input__inner) {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.6rem;
  height: 2.4rem;
  color: white;
}
</style>
