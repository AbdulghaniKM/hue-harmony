<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
  <ToastContainer />
</template>

<script setup>
import DefaultLayout from '@/components/layout/DefaultLayout.vue';
import ToastContainer from '@/components/ui/ToastContainer.vue';
</script>
