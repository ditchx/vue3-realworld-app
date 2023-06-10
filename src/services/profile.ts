import { ref, type Ref } from "vue"
import axios from "axios"
import { getServiceURL, getErrors } from "."

const serviceURL = getServiceURL()

export interface Profile {
    username: string,
    bio: string,
    image: string,
    following: boolean
}

export interface UseProfileReturnType {
    lastError: Ref<string[]>
    profile: Ref<Profile>
    getProfile: ((username: string) => void)
    follow: ((username: string, token: string) => void)
    unfollow: ((username: string, token: string) => void)
}

export function emptyProfile(): Profile {
    return {
        username: "",
        bio: "",
        image: "",
        following: false
    }
}

export function useProfile(): UseProfileReturnType {
    const lastError = ref<string[]>([])
    const profile = ref<Profile>(emptyProfile())

    function _cleanUp(error: any) {
        profile.value = emptyProfile()
        lastError.value = getErrors(error)
    }

    async function getProfile(username: string) {
        lastError.value = []
        try {
            const response = await axios.get(serviceURL + '/profiles/' + username)
            profile.value = response.data.profile
        } catch (error) {
            _cleanUp(error)
        }
    }

    async function follow(username: string, token: string) {
        lastError.value = []
        try {
            const response = await axios.post(
                serviceURL + '/profiles/' + username,
                {
                    headers: {
                        'Authorization': token
                    }
                }
            )
            profile.value = response.data.profile
        } catch (error) {
            _cleanUp(error)
        }
    }

    async function unfollow(username: string, token: string) {
        lastError.value = []
        try {
            const response = await axios.delete(
                serviceURL + '/profiles/' + username,
                {
                    headers: {
                        'Authorization': token
                    }
                }
            )
            profile.value = response.data.profile
        } catch (error) {
            _cleanUp(error)
        }
    }


    return {
        lastError,
        profile,
        getProfile,
        follow,
        unfollow
    }
}

export default useProfile