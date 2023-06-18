import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { emptyUser, type User } from '@/services/users'

export const useAuthStore = defineStore('auth', () => {
  const user = useLocalStorage('pinia/auth/login', emptyUser())
  const isLoggedIn = computed(() => user.value && user.value.token != '')

  function login(u: User) {
    user.value = u
  }

  function logout() {
    user.value = null
  }

  return {
    user,
    isLoggedIn,
    login,
    logout
  }
})
