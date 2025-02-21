<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
    <div class="container flex items-center justify-between h-16">
      <!-- Logo & Navigation -->
      <div class="flex items-center gap-6">
        <router-link
          to="/"
          class="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div class="p-1 rounded-lg bg-primary">
            <Icon
              icon="ph:palette-fill"
              class="text-xl text-primary-foreground"
            />
          </div>
          <span class="text-lg font-semibold">Hue Harmony</span>
        </router-link>
        <nav class="hidden gap-4 md:flex">
          <router-link
            v-for="item in navigation"
            :key="item.path"
            :to="item.path"
            class="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
            :class="{ 'text-foreground': $route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </nav>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <a
          href="https://github.com/hunghg255/hue-harmony"
          target="_blank"
          class="p-2 transition-colors rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Icon
            icon="ph:github-logo"
            class="text-xl"
          />
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
  import { Icon } from '@iconify/vue';

  const navigation = [
    { name: 'Create', path: '/' },
    { name: 'Saved', path: '/saved' },
  ];
</script>
