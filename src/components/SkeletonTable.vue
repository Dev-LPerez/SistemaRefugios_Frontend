<template>
  <div class="animate-pulse space-y-4 p-5 bg-white">
    <!-- Fila de cabecera simulada -->
    <div class="h-6 bg-slate-200 rounded-lg w-full mb-6"></div>
    
    <!-- Filas de datos simuladas -->
    <div v-for="i in rows" :key="i" class="flex items-center justify-between gap-4 py-3 border-b border-slate-100">
      <div class="h-4 bg-slate-200 rounded w-1/6"></div>
      <div class="h-4 bg-slate-250 rounded w-2/5"></div>
      <div class="h-4 bg-slate-200 rounded w-12"></div>
      <div class="h-4 bg-slate-200 rounded w-20"></div>
      <div class="h-4 bg-slate-250 rounded w-24"></div>
      <div class="h-4 bg-slate-200 rounded w-8"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ rows?: number }>(), { rows: 5 })
</script>
