import { ref, provide, inject, type Ref, type InjectionKey } from 'vue'
import axios from 'axios'
import { getServiceURL, getErrors } from '.'


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
  follow: (username: string, token: string) => Promise<void>
  unfollow: (username: string, token: string) => Promise<void>
}

export interface ProfileProvider {
  profile: Ref<Profile>,
  updateFollowing: (follow: boolean) => void
}

export const profileProviderKey = Symbol() as InjectionKey<ProfileProvider>

export function provideProfile(profile: Ref<Profile>): void {

  const updateFollowing = function(follow: boolean): void {
    if (profile.value.following === follow) {
      return
    }

    profile.value.following = follow 
  }

  provide(profileProviderKey, {
    profile: profile,
    updateFollowing: updateFollowing
  })
}

export function injectProfile(): ProfileProvider {
  return inject(profileProviderKey) as ProfileProvider
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

  async function follow(username: string, token: string): Promise<void> {
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

  async function unfollow(username: string, token: string): Promise<void> {
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
