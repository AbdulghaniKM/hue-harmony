<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  class: { type: String, required: false },
  hover: { type: Boolean, default: false }
})
</script>

<template>
  <div
    :class="cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      'transition-all duration-200 ease-in-out',
      hover && 'hover:shadow-lg hover:scale-[1.02]',
      props.class
    )"
  >
    <slot />
  </div>
</template>
