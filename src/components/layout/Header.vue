<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
    <div class="container flex h-16 items-center justify-between">
      <!-- Logo & Navigation -->
      <div class="flex items-center gap-6">
        <router-link
          to="/"
          class="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div class="rounded-lg bg-primary p-1">
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
            class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            :class="{ 'text-foreground': $route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </nav>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <router-link
          to="/saved"
          class="hidden sm:block"
        >
          <Button
            variant="outline"
            size="sm"
            class="group relative overflow-hidden border-primary/20"
          >
            <span class="relative z-10 flex items-center gap-3">
              <div class="flex items-center gap-2">
                <Icon
                  icon="ph:book-bookmark"
                  class="text-lg transition-transform group-hover:scale-110"
                />
                <span class="font-medium">Saved Palettes</span>
              </div>
              <Badge
                variant="secondary"
                class="bg-primary/10 text-primary"
              >
                {{ paletteStore.savedPalettes.length }}
              </Badge>
            </span>
            <div
              class="absolute inset-0 -z-10 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Button>
        </router-link>
        <a
          href="https://github.com/AbdulghaniKM/hue-harmony"
          target="_blank"
          class="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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
  import Badge from '@/components/ui/badge/Badge.vue';
  import { Button } from '@/components/ui/button';
  import { usePaletteStore } from '@/stores/usePaletteStore';
  import { Icon } from '@iconify/vue';

  const paletteStore = usePaletteStore();

  const navigation = [
    { name: 'Create', path: '/' },
    { name: 'Saved', path: '/saved' },
  ];
</script>
