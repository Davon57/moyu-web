import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      isDark.value = true
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  watch(isDark, (newVal) => {
    document.documentElement.setAttribute('data-theme', newVal ? 'dark' : 'light')
    localStorage.setItem('theme', newVal ? 'dark' : 'light')
  })

  return {
    isDark,
    initTheme,
    toggleTheme
  }
})
