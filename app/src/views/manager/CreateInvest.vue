<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex items-center mt-space-16" @click="$router.back()">
      <el-icon color="white"><arrow-left /></el-icon>
      <text class="text-white text-size-16">{{ $t('back') }}</text>
    </div>
    <div class="w-full flex flex-col box-border content">
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
              v-model="inputAmount"
              class="w-full mt-space-8"
              size="large"
              style="width: 100%"
              :controls="false"
              :min="1"></el-input-number>
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
              :disabled-date="disableEnd"></el-date-picker>
          </div>
          <div class="flex-grow flex flex-col">
            <text class="mb-space-8">{{ $t('invest.end.time') }}</text>
            <el-time-picker
              v-model="endTime"
              style="width: 100%"
              :placeholder="$t('invest.input.end.time')"></el-time-picker>
          </div>
        </div>

        <div class="w-full flex flex-col mt-space-32">
          <text class="mb-space-8">{{ $t('invest.period') }}</text>
          <div class="w-full flex">
            <div class="flex-grow">
              <el-input-number
                v-model="inputPeriod"
                class="flex-grow"
                size="large"
                style="width: 100%"
                :controls="false"
                :min="1"></el-input-number>
            </div>
            <div class="flex-grow ml-space-32">
              <el-select v-model="periodUnit">
                <el-option
                  v-for="(item, index) in UNITS"
                  :key="index"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div class="flex items-center mt-space-32">
          <text class="mr-space-8">{{ $t('invest.advanced') }}</text>
          <el-switch v-model="openAdvanced" active-color="#61e290" />
        </div>

        <div v-if="openAdvanced" class="w-full flex flex-col">
          <div class="w-full flex mt-space-32">
            <div class="flex-grow flex flex-col">
              <text class="mb-space-8">{{ $t('invest.cliff.date') }}</text>
              <el-date-picker
                v-model="cliffDate"
                type="date"
                style="width: 100%"
                :placeholder="$t('invest.input.cliff.date')"
                :disabled-date="disableCliff"></el-date-picker>
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
              <div class="w-full flex items-center">
                <el-input-number
                  v-model="inputCliffPercent"
                  style="width: 100%"
                  :controls="false"
                  :min="0"
                  :max="100"
                  size="large"></el-input-number>
                <div class="ml-space-8">%</div>
              </div>
            </div>
          </div>

          <div class="w-full flex mt-space-32">
            <div class="flex flex-col" style="flex: 1 1">
              <text class="mb-space-8">{{ $t('invest.tge.percent') }}</text>
              <div class="w-full flex items-center">
                <el-input-number
                  v-model="inputTgePercent"
                  style="width: 100%"
                  size="large"
                  :controls="false"
                  :min="0"
                  :max="100"></el-input-number>
                <div class="ml-space-8">%</div>
              </div>
            </div>
            <div style="flex: 1 1" class="mx-space-32"></div>
            <div style="flex: 1 1"></div>
          </div>

          <text class="mt-space-32">{{ $t('invest.desc') }}</text>
        </div>
        <div class="btn-common px-space-64 mt-space-32" @click="clickCreate">
          + {{ $t('invest.create') }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { throttle } from '@/utils'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useProgram } from '@/composable/anchorProgram'
import { useI18n } from 'vue-i18n'

dayjs.extend(duration)

const { t } = useI18n()
const { createVesting } = useProgram()

const inputAmount = ref(0)
const inputToken = ref('')
const inputInvestor = ref('')
const inputAccount = ref('')
const startDate = ref('')
const startTime = ref()
const disableStart = (date) => date.getTime() < Date.now()
const endDate = ref()
const endTime = ref()
const disableEnd = (date) => {
  return startDate.value
    ? date.getTime() < startDate.value.getTime()
    : date.getTime() < Date.now()
}
const inputPeriod = ref(0)
const UNITS = [
  { value: 'd', label: t('day') },
  { value: 'M', label: t('month') },
  { value: 'w', label: t('week') },
  { value: 'h', label: t('hour') },
  { value: 'm', label: t('minute') },
  { value: 's', label: t('second') }
]
const periodUnit = ref(UNITS[0].value)
const period = computed(() => {
  return dayjs.duration(inputPeriod.value,periodUnit.value).asSeconds()
})

const openAdvanced = ref(false)
const cliffDate = ref()
const cliffTime = ref()
const disableCliff = (date) => {
  const start = dayjs(startDate.value || new Date())
  const end = dayjs(endDate.value || new Date())
  const cur = dayjs(date)
  return cur.isBefore(start) || cur.isAfter(end)
}
const inputCliffPercent = ref(0)
const inputTgePercent = ref(0)

const start = computed(() => {
  const date = dayjs(startDate.value || new Date())
  const time = dayjs(startTime.value || new Date())
  return date.hour(time.hour()).minute(time.minute()).second(time.second())
})

const end = computed(() => {
  const date = dayjs(endDate.value || new Date())
  const time = dayjs(endTime.value || new Date())
  return date.hour(time.hour()).minute(time.minute()).second(time.second())
})

const cliff = computed(() => {
  if (cliffDate.value && cliffTime.value) {
    const date = dayjs(cliffDate.value)
    const time = dayjs(cliffTime.value)
    return date.hour(time.hour()).minute(time.minute()).second(time.second())
  }
  return null
})

const checkParams = () => {
  if (inputAmount.value === 0) {
    ElMessage.error(`${t('invest.num.hint')}`)
    return false
  }
  if (!inputToken.value || inputToken.value.length === 0) {
    ElMessage.error(`${t('invest.input.token')}`)
    return false
  }
  if (!inputInvestor.value || inputInvestor.value.length === 0) {
    ElMessage.error(`${t('invest.input.investor')}`)
    return false
  }
  if (!inputAccount.value || inputAccount.value.length === 0) {
    ElMessage.error(`${t('invest.input.account')}`)
    return false
  }
  if (start.value.isAfter(end.value)) {
    ElMessage.error(`${t('invest.start.end.hint')}`)
    return false
  }
  if (
    cliff.value &&
    (cliff.value.isAfter(end.value) || cliff.value.isBefore(start.value))
  ) {
    ElMessage.error(`${t('invest.cliff.hint')}`)
    return false
  }
  return true
}
const clickCreate = throttle(() => {
  if (checkParams()) {
    createVesting({
      amount: inputAmount.value,
      token: inputToken.value,
      investorName: inputInvestor.value,
      investorAddress: inputAccount.value,
      start: start.value,
      end: end.value,
      period: period.value,
      cliff: cliff.value || 0,
      cliffPercent: inputCliffPercent.value,
      tgePercent: inputTgePercent.value
    })
  }
})
</script>
<style lang="scss" scoped>
.content {
  padding: 1.6rem 8rem;
}
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
  text-align: start;
}
</style>
