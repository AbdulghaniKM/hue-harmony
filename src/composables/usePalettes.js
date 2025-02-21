import { ref, onMounted } from 'vue'

export function usePalettes() {
  const savedPalettes = ref([])

  // Load palettes from localStorage on mount
  onMounted(() => {
    const stored = localStorage.getItem('colorStoryPalettes')
    if (stored) {
      savedPalettes.value = JSON.parse(stored)
    }
  })

  // Save palette
  function savePalette(palette) {
    savedPalettes.value.unshift([...palette])
    localStorage.setItem('colorStoryPalettes', JSON.stringify(savedPalettes.value))
  }

  // Remove palette
  function removePalette(index) {
    savedPalettes.value.splice(index, 1)
    localStorage.setItem('colorStoryPalettes', JSON.stringify(savedPalettes.value))
  }

  // Check if palette exists
  function isPaletteExists(palette) {
    if (!palette.length) return false
    return savedPalettes.value.some(savedPalette =>
      savedPalette.every((color, i) =>
        color[0] === palette[i][0] &&
        color[1] === palette[i][1] &&
        color[2] === palette[i][2]
      )
    )
  }

  return {
    savedPalettes,
    savePalette,
    removePalette,
    isPaletteExists
  }
}
