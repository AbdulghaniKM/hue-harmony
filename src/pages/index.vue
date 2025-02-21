<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
    <!-- Dynamic Background -->
    <div class="fixed inset-0 -z-10">
      <div
        v-for="(color, i) in paletteStore.currentPalette"
        :key="i"
        :style="{
          backgroundColor: getColorString(color),
          transform: `rotate(${i * 72}deg) translateY(${i * 10}%)`,
          opacity: 0.03,
        }"
        class="absolute inset-0 origin-center blur-3xl transition-transform duration-1000"
      />
    </div>

    <div class="container relative py-8 md:py-16">
      <!-- Header -->
      <div class="mb-16 flex flex-col items-center text-center">
        <h1
          class="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl"
        >
          Create Your Color Harmony
        </h1>
        <p class="mt-4 max-w-md text-muted-foreground">
          Generate, customize, and save beautiful color combinations for your next project
        </p>
      </div>

      <!-- Main Content -->
      <div class="mx-auto max-w-5xl">
        <!-- Controls -->
        <Card class="mb-8 border-primary/10 bg-card/50 p-4">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <Button
                @click="randomizePalette"
                :disabled="paletteStore.isLoading"
                variant="default"
                size="lg"
                class="group relative overflow-hidden shadow-lg"
              >
                <span class="relative z-10 flex items-center gap-2">
                  <Icon
                    icon="ph:shuffle-bold"
                    class="text-lg transition-transform group-hover:rotate-180"
                  />
                  Generate New Palette
                </span>
                <div
                  class="absolute inset-0 -z-10 bg-primary/10 blur-xl transition-transform group-hover:scale-150"
                />
              </Button>
              <div class="flex items-center gap-2 rounded-lg bg-card/50 p-2">
                <Icon
                  icon="ph:paint-brush"
                  class="text-muted-foreground"
                />
                <CustomSelect
                  v-model="colorFormat"
                  :items="colorFormatOptions"
                  placeholder="Select format"
                  trigger-class="w-[100px] bg-transparent border-none focus:ring-0 focus:ring-offset-0"
                />
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Badge
                variant="outline"
                class="gap-2 px-3 py-1.5"
              >
                <Icon icon="ph:keyboard" />
                <span class="font-medium">Press Space</span>
              </Badge>
              <Button
                @click="savePalette"
                :disabled="
                  paletteStore.isLoading ||
                  !paletteStore.currentPalette.length ||
                  paletteStore.isPaletteExists(paletteStore.currentPalette)
                "
                variant="outline"
                size="lg"
                class="group relative min-w-[140px]"
              >
                <span class="relative z-10 flex items-center gap-2">
                  <Icon
                    :icon="
                      paletteStore.isPaletteExists(paletteStore.currentPalette)
                        ? 'ph:bookmark-simple-fill'
                        : 'ph:bookmark-simple'
                    "
                    class="text-lg transition-transform group-hover:scale-110"
                  />
                  {{ paletteStore.isPaletteExists(paletteStore.currentPalette) ? 'Saved' : 'Save' }}
                </span>
                <div
                  class="absolute inset-0 -z-10 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </Button>
            </div>
          </div>
        </Card>

        <!-- Color Display -->
        <Card class="overflow-hidden border-none bg-card/20 backdrop-blur-sm">
          <div class="grid grid-cols-5">
            <template v-if="!paletteStore.isLoading">
              <div
                v-for="(color, index) in paletteStore.currentPalette"
                :key="index"
                class="group relative aspect-square cursor-pointer transition-all duration-300 hover:z-10 hover:scale-105"
                :style="{
                  backgroundColor: getColorString(color),
                }"
                @click="copyColor(color)"
              >
                <!-- Color Info Overlay -->
                <div
                  class="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100"
                >
                  <!-- Color Value -->
                  <div
                    class="flex items-center gap-2 rounded-md bg-white/90 px-3 py-1.5 text-black shadow-lg"
                  >
                    <Icon
                      icon="ph:copy"
                      class="text-sm"
                    />
                    <span class="font-mono text-sm">
                      {{ getFormattedColor(color) }}
                    </span>
                  </div>

                  <!-- Adjust Buttons -->
                  <div class="flex gap-2">
                    <Button
                      @click.stop="adjustColor(index, 'lighter')"
                      variant="ghost"
                      size="sm"
                      class="h-8 w-8 rounded-full bg-white/90 p-0 text-black shadow-lg"
                    >
                      <Icon icon="ph:sun" />
                    </Button>
                    <Button
                      @click.stop="adjustColor(index, 'darker')"
                      variant="ghost"
                      size="sm"
                      class="h-8 w-8 rounded-full bg-white/90 p-0 text-black shadow-lg"
                    >
                      <Icon icon="ph:moon" />
                    </Button>
                  </div>
                </div>
              </div>
            </template>
            <div
              v-else
              class="col-span-5 flex h-[400px] items-center justify-center"
            >
              <div class="flex flex-col items-center gap-4">
                <div class="animate-spin">
                  <Icon
                    icon="ph:palette"
                    class="text-4xl text-muted-foreground"
                  />
                </div>
                <p class="text-muted-foreground">Generating your palette...</p>
              </div>
            </div>
          </div>
        </Card>
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
  import { onMounted, onUnmounted, ref } from 'vue';

  const toastStore = useToastStore();
  const paletteStore = usePaletteStore();
  const colorFormat = ref('rgb');

  // Add color format options
  const colorFormatOptions = [
    { value: 'hex', label: 'HEX' },
    { value: 'rgb', label: 'RGB' },
    { value: 'hsl', label: 'HSL' },
  ];

  async function randomizePalette() {
    if (paletteStore.isLoading) return;
    try {
      await paletteStore.generatePalette();
    } catch (error) {
      toastStore.addToast({
        title: 'Error',
        description: 'Failed to generate color palette. Please try again.',
        variant: 'destructive',
      });
    }
  }

  function savePalette() {
    if (
      paletteStore.currentPalette.length &&
      !paletteStore.isPaletteExists(paletteStore.currentPalette)
    ) {
      // Add dialog to get palette name and favorite state
      const paletteName = `Palette ${paletteStore.savedPalettes.length + 1}`;
      paletteStore.savePalette(paletteStore.currentPalette, {
        name: paletteName,
        isFavorite: false, // Default to not favorite
      });
      toastStore.addToast({
        description: 'Color story saved to your collection.',
      });
    }
  }

  function rgbToHex(r, g, b) {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }

  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  function getColorString(color) {
    return `rgb(${color.join(',')})`;
  }

  function getFormattedColor(color) {
    const [r, g, b] = color;
    switch (colorFormat.value) {
      case 'hex':
        return rgbToHex(r, g, b);
      case 'hsl':
        const [h, s, l] = rgbToHsl(r, g, b);
        return `hsl(${h}, ${s}%, ${l}%)`;
      default:
        return `rgb(${r}, ${g}, ${b})`;
    }
  }

  function copyColor(color) {
    const colorStr = getFormattedColor(color);
    navigator.clipboard.writeText(colorStr);
    toastStore.addToast({
      description: `Copied ${colorStr} to clipboard`,
    });
  }

  function adjustColor(index, type) {
    const color = [...paletteStore.currentPalette[index]];
    const amount = type === 'lighter' ? 20 : -20;

    color[0] = Math.min(255, Math.max(0, color[0] + amount));
    color[1] = Math.min(255, Math.max(0, color[1] + amount));
    color[2] = Math.min(255, Math.max(0, color[2] + amount));

    const newPalette = [...paletteStore.currentPalette];
    newPalette[index] = color;
    paletteStore.setCurrentPalette(newPalette);
  }

  function handleKeyPress(event) {
    if (event.key === ' ' && !paletteStore.isLoading) {
      event.preventDefault(); // Prevent space from scrolling
      randomizePalette();
    } else if (event.key === 's' && !event.metaKey && !event.ctrlKey) {
      savePalette();
    }
  }

  function isLightColor(color) {
    const [r, g, b] = color;
    // Calculate relative luminance using the formula
    // L = 0.299R + 0.587G + 0.114B
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  }

  onMounted(() => {
    if (!paletteStore.currentPalette.length) {
      randomizePalette();
    }
    window.addEventListener('keydown', handleKeyPress);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress);
  });
</script>

<style>
  .scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--primary) / 0.1) transparent;
  }

  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: hsl(var(--primary) / 0.1);
    border-radius: 3px;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: hsl(var(--primary) / 0.2);
  }
</style>
