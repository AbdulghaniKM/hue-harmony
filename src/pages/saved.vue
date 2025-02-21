<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
    <div class="container py-8 md:py-16">
      <!-- Header -->
      <div class="mb-12 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <router-link to="/" class="group">
            <Button variant="ghost" size="sm" class="gap-2">
              <Icon icon="ph:arrow-left" class="text-lg transition-transform group-hover:-translate-x-1" />
              Back
            </Button>
          </router-link>
          <h1 class="text-2xl font-bold">Saved Color Stories</h1>
        </div>
        <Badge variant="secondary" class="text-lg px-3 py-1">
          {{ paletteStore.savedPalettes.length }}
        </Badge>
      </div>

      <!-- Grid of Saved Palettes -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="(palette, index) in paletteStore.savedPalettes"
          :key="index"
          hover
          class="group overflow-hidden"
        >
          <div class="relative aspect-video">
            <div class="absolute inset-0 flex">
              <div
                v-for="(color, colorIndex) in palette"
                :key="colorIndex"
                :style="{ backgroundColor: getColorString(color) }"
                class="flex-1 transition-transform group-hover:scale-105"
                @click="copyColor(color)"
              />
            </div>
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
              <Button variant="outline" size="sm" class="border-white/20 text-white">
                <Icon icon="ph:copy" class="mr-2" />
                Copy Colors
              </Button>
            </div>
          </div>
          <div class="p-4 flex items-center justify-between">
            <div class="space-y-1">
              <Badge variant="outline">Story #{{ paletteStore.savedPalettes.length - index }}</Badge>
              <p class="text-sm text-muted-foreground">
                {{ new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }) }}
              </p>
            </div>
            <Button
              @click="handleRemove(index)"
              variant="ghost"
              size="icon"
              class="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive-foreground hover:bg-destructive"
            >
              <Icon icon="ph:trash" />
            </Button>
          </div>
        </Card>
      </div>

      <!-- Empty State -->
      <div v-if="!paletteStore.savedPalettes.length" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Icon icon="ph:book" class="text-3xl text-muted-foreground" />
        </div>
        <h3 class="text-lg font-medium mb-2">No saved palettes yet</h3>
        <p class="text-muted-foreground mb-4">Start by saving some color combinations you love</p>
        <router-link to="/">
          <Button variant="default">Create New Palette</Button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card/Card.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import { usePaletteStore } from '@/stores/usePaletteStore';
import { useToastStore } from '@/stores/useToastStore';

const toastStore = useToastStore();
const paletteStore = usePaletteStore();

function getColorString(color) {
  return `rgb(${color.join(',')})`;
}

function copyColor(color) {
  const colorStr = `rgb(${color.join(',')})`;
  navigator.clipboard.writeText(colorStr);
  toastStore.addToast({
    description: `Copied ${colorStr} to clipboard`,
  });
}

function copyPalette(palette) {
  const colors = palette.map(color => `rgb(${color.join(',')})`).join(', ');
  navigator.clipboard.writeText(colors);
  toastStore.addToast({
    description: 'Copied all colors to clipboard',
  });
}

function handleRemove(index) {
  paletteStore.removePalette(index);
  toastStore.addToast({
    description: 'Palette removed from collection',
  });
}
</script>
