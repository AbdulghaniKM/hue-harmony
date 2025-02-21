<script setup>
import { useToastStore } from '@/stores/useToastStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { cn } from '@/lib/utils';

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);

const variants = {
  default: 'bg-white/95 backdrop-blur-lg border-white/30 text-gray-900 dark:bg-gray-800/95 dark:text-white dark:border-gray-700/30',
  destructive: 'bg-red-500/95 backdrop-blur-lg border-red-500/30 text-white dark:bg-red-900/95 dark:border-red-700/30',
};

function getToastStyle(variant) {
  return cn(
    'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 sm:space-x-4 overflow-hidden rounded-xl border p-3 sm:p-4 shadow-2xl transition-all hover:scale-102 hover:shadow-xl ring-1 ring-black/5 dark:ring-white/10',
    variants[variant || 'default']
  );
}
</script>

<template>
  <div
    class="fixed bottom-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-3 sm:p-4 sm:bottom-0 sm:right-0 sm:max-w-[420px]"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="getToastStyle(toast.variant)"
      >
        <div class="grid gap-1">
          <div class="text-xs sm:text-sm font-semibold" v-if="toast.title">
            {{ toast.title }}
          </div>
          <div class="text-xs sm:text-sm opacity-90" v-if="toast.description">
            {{ toast.description }}
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease-out;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>