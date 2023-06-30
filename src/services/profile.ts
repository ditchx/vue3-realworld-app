import { ref, type Ref } from 'vue'
import axios from 'axios'
import { getServiceURL, getErrors } from '.'
import { w } from 'vitest/dist/types-dea83b3d.js'

const serviceURL = getServiceURL()

export interface Profile {
  username: string
  bio: string
  image: string
  following: boolean
}

export interface UseProfileReturnType {
  lastError: Ref<string[]>
  profile: Ref<Profile>
  getProfile: (username: string, token: string) => void
  follow: (username: string, token: string) => void
  unfollow: (username: string, token: string) => void
}

export function emptyProfile(): Profile {
  return {
    username: '',
    bio: '',
    image: '',
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

  async function getProfile(username: string, token: string) {
    lastError.value = []
    try {
      const params: any = {}
      if (token) {
        params.headers = {
          Authorization: 'Token ' + token
        }
      }

      const response = await axios.get(serviceURL + '/profiles/' + username, params)
      profile.value = response.data.profile
    } catch (error) {
      _cleanUp(error)
    }
  }

  async function follow(username: string, token: string) {
    lastError.value = []
    try {
      const response = await axios.post(serviceURL + '/profiles/' + username + '/follow', {}, {
        headers: {
          Authorization: 'Token ' + token
        }
      })
      profile.value = response.data.profile
    } catch (error) {
      _cleanUp(error)
    }
  }

  async function unfollow(username: string, token: string) {
    lastError.value = []
    try {
      const response = await axios.delete(serviceURL + '/profiles/' + username + '/follow', {
        headers: {
          Authorization: 'Token ' + token
        }
      })
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
