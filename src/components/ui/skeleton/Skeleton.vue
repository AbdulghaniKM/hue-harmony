<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  class: { type: String, required: false }
})
</script>

<template>
  <div
    :class="cn('animate-pulse rounded-md bg-muted', props.class)"
  />
</template>
