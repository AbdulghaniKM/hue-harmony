import { defineStore } from 'pinia'

export const usePaletteStore = defineStore('palette', {
  state: () => ({
    savedPalettes: [],
    currentPalette: [],
    isLoading: false
  }),

  actions: {
    savePalette(palette) {
      this.savedPalettes.unshift([...palette])
    },

    removePalette(index) {
      this.savedPalettes.splice(index, 1)
    },

    setCurrentPalette(palette) {
      this.currentPalette = palette
    },

    setLoading(status) {
      this.isLoading = status
    },

    async generatePalette() {
      try {
        this.isLoading = true
        const response = await fetch('http://colormind.io/api/', {
          method: 'POST',
          body: JSON.stringify({ model: 'default' }),
        })

        if (!response.ok) throw new Error('Failed to generate palette')

        const data = await response.json()
        this.currentPalette = data.result
      } catch (error) {
        throw error
      } finally {
        this.isLoading = false
      }
    }
  },

  getters: {
    isPaletteExists: (state) => (palette) => {
      if (!palette?.length) return false
      return state.savedPalettes.some(savedPalette =>
        savedPalette.every((color, i) =>
          color[0] === palette[i][0] &&
          color[1] === palette[i][1] &&
          color[2] === palette[i][2]
        )
      )
    }
  },

  persist: true
})
