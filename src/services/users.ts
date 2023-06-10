import { computed, ref, type ComputedRef, type Ref } from "vue"
import { getServiceURL, getErrors } from "."
import axios from "axios"

const serviceURL = getServiceURL();

export interface User {
    email: string
    token: string
    username: string
    bio: string
    image: string
}

export interface UseUserReturnType {
    lastError: Ref<string[]>
    currentUser: Ref<User>
    isLoggedIn: ComputedRef<boolean>
    errorMessage: Ref<string>
    login: ((email: string, password: string) => void)
    logout: (() => void)
    register: ((username: string, email: string, password: string) => void)
    getCurrentUser: ((token: string) => void)
    updateCurrentUser: ((user: UserUpdatableFields, token: string) => void)
}

export interface LoginUser {
    email: string,
    password: string
}

export interface NewUser {
    username: string
    email: string
    password: string
}

export interface UpdateUser {
    email?: string
    password?: string
    username?: string
    bio?: string
    image?: string
}


export interface UserUpdatableFields {
    email?: string,
    username?: string,
    bio?: string,
    image?: string
}

export function emptyUser(): User {
    return {
        email: "",
        token: "",
        username: "",
        bio: "",
        image: "",
    }
}

export function useUser(): UseUserReturnType {
    const lastError = ref<string[]>([])
    const currentUser = ref<User>(emptyUser())
    const isLoggedIn = computed(() => currentUser.value.token != "")
    const errorMessage = ref<string>("")

    function _cleanUp(error: any) {
        currentUser.value = emptyUser();
        lastError.value = getErrors(error)
    }

    async function login(email: string, password: string) {
        lastError.value = []
        try {
            const response = await axios.post(serviceURL + '/users/login', {
                user: {
                    email: email,
                    password: password
                }
            })
            currentUser.value = response.data.user
        } catch (error) {
            _cleanUp(error)
        }
    }

    function logout() {
        currentUser.value = emptyUser()
    }

    async function register(username: string, email: string, password: string) {
        lastError.value = []
        try {
            const response = await axios.post(serviceURL + '/users', {
                user: {
                    username: username,
                    email: email,
                    password: password
                }
            })
            currentUser.value = response.data.user
        } catch (error) {
            _cleanUp(error)
        }

    }

    async function getCurrentUser(token: string) {
        lastError.value = []
        try {
            const response = await axios.get(serviceURL + '/user', {
                headers: {
                    'Authorization': token,
                }
            })
            currentUser.value = response.data.user
        } catch (error) {
            _cleanUp(error)
        }
    }

    async function updateCurrentUser(user: UserUpdatableFields, token: string) {
        lastError.value = []
        try {
            const response = await axios.put(serviceURL + '/user', { user: user }, {
                headers: {
                    'Authorization': token,
                }
            })
            currentUser.value = response.data.user
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    _cleanUp(error)
                } else if (error.response.data.errors) {
                    lastError.value = getErrors(error)
                }
            }
        }
    }

    return {
        lastError,
        currentUser,
        isLoggedIn,
        errorMessage,
        login,
        logout,
        register,
        getCurrentUser,
        updateCurrentUser,
    }
}

export default useUser