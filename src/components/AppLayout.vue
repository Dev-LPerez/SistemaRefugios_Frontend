<template>
  <div class="flex min-h-screen bg-slate-50">
    <TheSidebar ref="sidebar" />

    <!-- Main content pushed by sidebar -->
    <div
      :class="[
        'flex-1 flex flex-col min-h-screen transition-all duration-300',
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
      ]"
    >
      <!-- Top bar mobile -->
      <header class="lg:hidden bg-white border-b border-slate-200 h-14 flex items-center px-4 gap-3 sticky top-0 z-20">
        <button @click="toggleSidebar" class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <span class="font-semibold text-slate-800 text-sm">{{ title }}</span>
      </header>

      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import TheSidebar from '@/components/TheSidebar.vue'

withDefaults(defineProps<{ title?: string }>(), { title: 'Refugios Montería' })

const sidebar = ref<InstanceType<typeof TheSidebar> | null>(null)
const sidebarOpen = computed(() => sidebar.value?.open ?? true)

function toggleSidebar() {
  if (sidebar.value) sidebar.value.open = !sidebar.value.open
}
</script>
