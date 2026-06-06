<template>
  <div class="flex items-start gap-4 p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all">
    <div class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" :class="iconBgClass">
      <slot name="icon"></slot>
    </div>
    <div class="flex-1">
      <h3 class="text-lg font-semibold text-slate-800 mb-2">
        <slot name="heading"></slot>
      </h3>
      <p class="text-slate-600 leading-relaxed">
        <slot></slot>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  iconBgClass?: string
}>(), {
  iconBgClass: 'bg-blue-100 text-blue-600'
})
</script>
