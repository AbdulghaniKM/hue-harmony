import { defineStore } from 'pinia';

export const usePaletteStore = defineStore('palette', {
  state: () => ({
    savedPalettes: [],
    currentPalette: [],
    isLoading: false,
    favoriteColors: [],
    paletteHistory: [],
    maxHistoryLength: 10,
  }),

  actions: {
    savePalette(palette, options = {}) {
      const { name = '', isFavorite = false } = options;
      this.savedPalettes.unshift({
        colors: [...palette],
        name: name || `Palette ${this.savedPalettes.length + 1}`,
        createdAt: new Date().toISOString(),
        isFavorite: isFavorite,
      });
    },

    removePalette(index) {
      this.savedPalettes.splice(index, 1);
    },

    setCurrentPalette(palette) {
      this.currentPalette = palette;
    },

    togglePaletteFavorite(index) {
      if (this.savedPalettes[index]) {
        this.savedPalettes[index].isFavorite = !this.savedPalettes[index].isFavorite;
      }
    },

    addToFavoriteColors(color) {
      if (!this.isColorInFavorites(color)) {
        this.favoriteColors.push(color);
      }
    },

    removeFromFavoriteColors(index) {
      this.favoriteColors.splice(index, 1);
    },

    renamePalette(index, newName) {
      if (this.savedPalettes[index]) {
        this.savedPalettes[index].name = newName;
      }
    },

    addToHistory(palette) {
      this.paletteHistory.unshift([...palette]);
      if (this.paletteHistory.length > this.maxHistoryLength) {
        this.paletteHistory.pop();
      }
    },

    restoreFromHistory(index) {
      if (this.paletteHistory[index]) {
        this.currentPalette = [...this.paletteHistory[index]];
      }
    },

    async generatePalette(mode = 'default') {
      try {
        this.isLoading = true;
        const response = await fetch('http://colormind.io/api/', {
          method: 'POST',
          body: JSON.stringify({ model: mode }),
        });

        if (!response.ok) throw new Error('Failed to generate palette');

        const data = await response.json();
        if (this.currentPalette.length) {
          this.addToHistory(this.currentPalette);
        }
        this.currentPalette = data.result;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    toggleFavorite(palette) {
      if (!this.currentPalette.length) return;

      const savedIndex = this.savedPalettes.findIndex((saved) =>
        saved.colors.every(
          (color, i) =>
            color[0] === palette[i][0] && color[1] === palette[i][1] && color[2] === palette[i][2]
        )
      );

      if (savedIndex !== -1) {
        this.savedPalettes[savedIndex].isFavorite = !this.savedPalettes[savedIndex].isFavorite;
        return this.savedPalettes[savedIndex].isFavorite;
      }
      return false;
    },
  },

  getters: {
    isPaletteExists: (state) => (palette) => {
      if (!palette?.length) return false;
      return state.savedPalettes.some((saved) => {
        // Handle both old and new palette structures
        const savedColors = Array.isArray(saved) ? saved : saved.colors;
        return savedColors.every(
          (color, i) =>
            color[0] === palette[i][0] && color[1] === palette[i][1] && color[2] === palette[i][2]
        );
      });
    },

    isColorInFavorites: (state) => (color) => {
      return state.favoriteColors.some(
        (favColor) =>
          favColor[0] === color[0] && favColor[1] === color[1] && favColor[2] === color[2]
      );
    },

    favoritePalettes: (state) => {
      return state.savedPalettes.filter((palette) => palette.isFavorite);
    },

    recentPalettes: (state) => {
      return [...state.savedPalettes].slice(0, 5);
    },
  },

  persist: true,
});
