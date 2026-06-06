<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 bg-white">
    <div class="flex items-center gap-3">
      <span class="text-xs text-slate-500">
        Mostrando {{ startItem }}–{{ endItem }} de {{ total }} registros
      </span>
      <select
        :value="perPage"
        @change="$emit('update:perPage', Number(($event.target as HTMLSelectElement).value))"
        class="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:outline-none focus:border-slate-400"
      >
        <option v-for="n in [10, 20, 50, 100]" :key="n" :value="n">{{ n }} por pág.</option>
      </select>
    </div>
    <div class="flex items-center gap-1">
      <button
        @click="$emit('update:page', 1)"
        :disabled="page === 1"
        class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Primera página"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
        </svg>
      </button>
      <button
        @click="$emit('update:page', page - 1)"
        :disabled="page === 1"
        class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Página anterior"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <template v-for="p in pageNumbers" :key="p">
        <span v-if="p === '...'" class="px-2 text-slate-400 text-sm">…</span>
        <button
          v-else
          @click="$emit('update:page', p as number)"
          :class="[
            'min-w-[32px] h-8 rounded-lg text-xs font-medium transition-colors',
            p === page ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          ]"
        >{{ p }}</button>
      </template>

      <button
        @click="$emit('update:page', page + 1)"
        :disabled="page === totalPages"
        class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Página siguiente"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
      <button
        @click="$emit('update:page', totalPages)"
        :disabled="page === totalPages"
        class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Última página"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  page: number
  perPage: number
}>()

defineEmits<{
  'update:page': [value: number]
  'update:perPage': [value: number]
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)))
const startItem = computed(() => props.total === 0 ? 0 : (props.page - 1) * props.perPage + 1)
const endItem = computed(() => Math.min(props.page * props.perPage, props.total))

const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = props.page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | string)[] = [1]
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
})
</script>
