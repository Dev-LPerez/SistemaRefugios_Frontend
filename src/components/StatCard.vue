<template>
  <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm text-slate-500 mb-1">{{ title }}</p>
        <p class="text-2xl font-bold text-slate-800">{{ value }}</p>
        <p v-if="total" class="text-xs text-slate-400 mt-1">de {{ total }} total</p>
      </div>
      <div 
        :class="[
          'w-12 h-12 rounded-xl flex items-center justify-center',
          iconBgClass
        ]"
      >
        <!-- Home Icon -->
        <svg v-if="icon === 'home'" :class="['w-6 h-6', iconColorClass]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <!-- Users Icon -->
        <svg v-else-if="icon === 'users'" :class="['w-6 h-6', iconColorClass]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <!-- Truck Icon -->
        <svg v-else-if="icon === 'truck'" :class="['w-6 h-6', iconColorClass]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
        <!-- Alert Icon -->
        <svg v-else-if="icon === 'alert'" :class="['w-6 h-6', iconColorClass]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: number
  total?: number
  icon: 'home' | 'users' | 'truck' | 'alert'
  color: 'blue' | 'green' | 'amber' | 'red'
}>()

const iconBgClass = computed(() => {
  const classes: Record<string, string> = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    amber: 'bg-amber-50',
    red: 'bg-red-50'
  }
  return classes[props.color]
})

const iconColorClass = computed(() => {
  const classes: Record<string, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    amber: 'text-amber-600',
    red: 'text-red-600'
  }
  return classes[props.color]
})
</script>
