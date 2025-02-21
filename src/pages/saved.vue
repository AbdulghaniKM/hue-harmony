<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
    <div class="container py-8 md:py-16">
      <!-- Header -->
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <router-link
            to="/"
            class="group"
          >
            <Button
              variant="ghost"
              size="sm"
              class="gap-2"
            >
              <Icon
                icon="ph:arrow-left"
                class="text-lg transition-transform group-hover:-translate-x-1"
              />
              Back
            </Button>
          </router-link>
          <div>
            <h1 class="text-2xl font-bold">Saved Color Stories</h1>
            <p class="text-sm text-muted-foreground"
              >Your collection of beautiful color combinations</p
            >
          </div>
        </div>
        <div class="flex items-center gap-3">
          <CustomSelect
            v-model="filterBy"
            :items="filterOptions"
            placeholder="Filter by"
            trigger-class="w-[120px]"
          />
          <Badge
            variant="secondary"
            class="px-3 py-1 text-lg"
          >
            {{ filteredPalettes.length }}
          </Badge>
        </div>
      </div>

      <!-- Grid of Saved Palettes -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="(palette, index) in filteredPalettes"
          :key="index"
          hover
          class="group overflow-hidden"
        >
          <div class="relative aspect-video">
            <div class="absolute inset-0 flex">
              <div
                v-for="(color, colorIndex) in Array.isArray(palette) ? palette : palette.colors"
                :key="colorIndex"
                :style="{ backgroundColor: getColorString(color) }"
                class="flex-1 transition-transform duration-300 hover:z-10 hover:scale-[1.02]"
                @click="copyColor(color)"
              />
            </div>
            <div
              class="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100"
              :style="{
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
              }"
            >
              <div class="flex gap-3">
                <Button
                  @click="copyPalette(Array.isArray(palette) ? palette : palette.colors)"
                  variant="outline"
                  size="sm"
                  class="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                >
                  <Icon
                    icon="ph:copy"
                    class="mr-2"
                  />
                  Copy All
                </Button>
                <Button
                  @click="toggleFavorite(index)"
                  variant="outline"
                  size="sm"
                  class="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                >
                  <Icon
                    :icon="palette.isFavorite ? 'ph:heart-fill' : 'ph:heart'"
                    class="mr-2"
                  />
                  {{ palette.isFavorite ? 'Favorited' : 'Favorite' }}
                </Button>
              </div>
            </div>
          </div>
          <div class="bg-card p-4">
            <div class="mb-3 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Badge
                  variant="outline"
                  class="bg-card"
                >
                  Story #{{ paletteStore.savedPalettes.length - index }}
                </Badge>
                <Icon
                  v-if="palette.isFavorite"
                  icon="ph:heart-fill"
                  class="text-primary"
                />
              </div>
              <Button
                @click="handleRemove(index)"
                variant="ghost"
                size="icon"
                class="text-muted-foreground opacity-0 transition-opacity hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
              >
                <Icon icon="ph:trash" />
              </Button>
            </div>
            <input
              v-model="palette.name"
              class="mb-1 w-full rounded bg-transparent px-1 text-sm font-medium transition-colors hover:bg-accent/5 focus:bg-accent/10 focus:outline-none"
              :placeholder="`Palette ${paletteStore.savedPalettes.length - index}`"
              @change="renamePalette(index, $event.target.value)"
            />
            <p class="text-xs text-muted-foreground">
              {{
                new Date(palette.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }}
            </p>
          </div>
        </Card>
      </div>

      <!-- Empty State -->
      <div
        v-if="!paletteStore.savedPalettes.length"
        class="py-12 text-center"
      >
        <div class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Icon
            icon="ph:book"
            class="text-3xl text-muted-foreground"
          />
        </div>
        <h3 class="mb-2 text-lg font-medium">No saved palettes yet</h3>
        <p class="mb-4 text-muted-foreground">Start by saving some color combinations you love</p>
        <router-link to="/">
          <Button variant="default">Create New Palette</Button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
  import CustomSelect from '@/components/CustomSelect.vue';
  import Badge from '@/components/ui/badge/Badge.vue';
  import { Button } from '@/components/ui/button';
  import Card from '@/components/ui/card/Card.vue';
  import { usePaletteStore } from '@/stores/usePaletteStore';
  import { useToastStore } from '@/stores/useToastStore';
  import { Icon } from '@iconify/vue';
  import { computed, ref } from 'vue';

  const toastStore = useToastStore();
  const paletteStore = usePaletteStore();
  const filterBy = ref('all');

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'favorites', label: 'Favorites' },
    { value: 'recent', label: 'Recent' },
  ];

  const filteredPalettes = computed(() => {
    switch (filterBy.value) {
      case 'favorites':
        return paletteStore.favoritePalettes;
      case 'recent':
        return paletteStore.recentPalettes;
      default:
        return paletteStore.savedPalettes;
    }
  });

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
    const colors = palette.map((color) => `rgb(${color.join(',')})`).join(', ');
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

  function toggleFavorite(index) {
    paletteStore.togglePaletteFavorite(index);
    const isFavorite = paletteStore.savedPalettes[index].isFavorite;
    toastStore.addToast({
      description: isFavorite ? 'Added to favorites ❤️' : 'Removed from favorites',
      variant: isFavorite ? 'default' : 'secondary',
    });
  }

  function renamePalette(index, newName) {
    paletteStore.renamePalette(index, newName);
    toastStore.addToast({
      description: 'Palette name updated',
    });
  }
</script>
