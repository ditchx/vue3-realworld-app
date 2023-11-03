<script lang="ts" setup>
import { useProfile, injectProfile } from '@/services/profile'
import { useAuthStore } from '@/stores/auth';
import { ref, computed } from 'vue'
const { profile, updateFollowing } = injectProfile()

const store = useAuthStore()
const isSelf = computed(() => profile.value.username == store.user.username);

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
    <button v-if="!isSelf" :disabled="disabled" @click.prevent="toggleFollow" class="btn btn-sm btn-outline-secondary action-btn">
        <i class="ion-plus-round"></i>
        &nbsp; {{ profile.following ? 'Unfollow' : 'Follow' }} {{ profile.username }}
    </button>
</template>
