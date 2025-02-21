<template>
  <footer class="border-t bg-background/80 backdrop-blur-sm">
    <div class="container py-6">
      <div class="flex flex-col items-center justify-center gap-4 text-center">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div class="rounded-lg bg-primary p-1">
            <Icon
              icon="ph:palette-fill"
              class="text-xl text-primary-foreground"
            />
          </div>
          <span class="text-lg font-semibold">Hue Harmony</span>
        </div>

        <!-- Links -->
        <div class="flex items-center gap-4 text-sm text-muted-foreground">
          <router-link
            to="/"
            class="transition-colors hover:text-foreground"
          >
            Create
          </router-link>
          <router-link
            to="/saved"
            class="transition-colors hover:text-foreground"
          >
            Saved
          </router-link>
          <a
            href="https://github.com/AbdulghaniKM/hue-harmony"
            target="_blank"
            class="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </div>

        <!-- Copyright -->
        <p class="text-xs text-muted-foreground"> Built with ❤️ by AbdulghaniKM </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
  import { Icon } from '@iconify/vue';
</script>
