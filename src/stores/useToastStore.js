import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([]);
  const TOAST_DURATION = 5000;

  function addToast({ title, description, variant = 'default' }) {
    const id = Math.random().toString(36).slice(2);
    const toast = {
      id,
      title,
      description,
      variant,
      timestamp: Date.now(),
    };

    toasts.value.push(toast);

    setTimeout(() => {
      removeToast(id);
    }, TOAST_DURATION);

    return id;
  }

  function removeToast(id) {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  }

  return {
    toasts,
    addToast,
    removeToast,
  };
});