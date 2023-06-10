import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { emptyUser } from '@/services/users'

export const useAuthStore = defineStore('auth', () => {
    const user = useLocalStorage('pinia/auth/login', emptyUser())
    const isLoggedIn = computed(() => user.value.token != "")

    function $reset() {
        user.value = null
    }

    return {
        user,
        isLoggedIn,
        $reset
    }
})
