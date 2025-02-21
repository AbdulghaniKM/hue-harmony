<template>
  <div class="relative">
    <!-- Custom Select Trigger -->
    <button
      type="button"
      @click="isOpen = !isOpen"
      :class="[
        'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-all duration-200',
        'bg-card/50 hover:bg-card/80 focus:outline-none focus:ring-2 focus:ring-primary/20',
        'border border-primary/10 hover:border-primary/20',
        triggerClass,
      ]"
    >
      <span :class="[modelValue ? 'text-foreground' : 'text-muted-foreground']">
        {{ selectedLabel || placeholder }}
      </span>
      <Icon
        icon="ph:caret-down"
        :class="['text-muted-foreground transition-transform', isOpen ? 'rotate-180' : '']"
      />
    </button>

    <!-- Dropdown Content -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-1 w-full rounded-md border border-primary/10 bg-card/95 py-1 shadow-lg backdrop-blur-sm"
      >
        <div
          v-if="label"
          class="px-2 py-1.5 text-xs font-medium text-muted-foreground"
        >
          {{ label }}
        </div>
        <div class="scrollbar-thin max-h-[200px] overflow-y-auto">
          <button
            v-for="item in items"
            :key="item.value"
            @click="selectItem(item)"
            :class="[
              'w-full px-2 py-1.5 text-left text-sm transition-colors',
              'hover:bg-primary/5 focus:bg-primary/5 focus:outline-none',
              modelValue === item.value ? 'bg-primary/5 text-primary' : 'text-foreground',
            ]"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { Icon } from '@iconify/vue';

  const props = defineProps({
    modelValue: {
      type: [String, Number],
      required: true,
    },
    items: {
      type: Array,
      required: true,
      validator: (items) => items.every((item) => 'value' in item && 'label' in item),
    },
    placeholder: {
      type: String,
      default: 'Select an option',
    },
    label: {
      type: String,
      default: '',
    },
    triggerClass: {
      type: String,
      default: 'w-full',
    },
  });

  const emit = defineEmits(['update:modelValue']);
  const isOpen = ref(false);

  const selectedLabel = computed(() => {
    const selected = props.items.find((item) => item.value === props.modelValue);
    return selected?.label;
  });

  function selectItem(item) {
    emit('update:modelValue', item.value);
    isOpen.value = false;
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event) {
    if (!event.target.closest('.relative')) {
      isOpen.value = false;
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<style scoped>
  .scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--primary) / 0.1) transparent;
  }

  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: hsl(var(--primary) / 0.1);
    border-radius: 2px;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: hsl(var(--primary) / 0.2);
  }
</style>
