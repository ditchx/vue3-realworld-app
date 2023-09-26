<script lang="ts" setup>
import { useProfile, injectProfile } from '@/services/profile'
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue'
const { profile, updateFollowing } = injectProfile()

const store = useAuthStore()
const { follow, unfollow } = useProfile()
const disabled = ref(false)

async function toggleFollow(): Promise<void> {
    if (!store.user.token) {
        return
    }

    const newValue = !profile.value.following

    if (profile.value.following) {
        disabled.value = true
        await unfollow(profile.value.username, store.user.token)
        updateFollowing(newValue)
        disabled.value = false
        return
    }

    disabled.value = true
    await follow(profile.value.username, store.user.token)
    updateFollowing(newValue)
    disabled.value = false
}

</script>
<template>
    <button :disabled="disabled" @click.prevent="toggleFollow" class="btn btn-sm btn-outline-secondary action-btn">
        <i class="ion-plus-round"></i>
        &nbsp; {{ profile.following ? 'Unfollow' : 'Follow' }} {{ profile.username }}
    </button>
</template>
