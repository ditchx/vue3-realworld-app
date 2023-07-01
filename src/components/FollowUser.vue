<script lang="ts" setup>
import { useProfile, type Profile } from '@/services/profile'
import { useAuthStore } from '@/stores/auth';
import { ref, watch } from 'vue'

const props = defineProps<{
    profile: Profile
}>()

const emit = defineEmits<{
    (e: 'followed' ): void
    (e: 'unfollowed'): void
}>()

const store = useAuthStore()
const { follow, unfollow } = useProfile()
const disabled = ref(false)

watch(() => props.profile, () => {
    disabled.value = false
})

async function toggleFollow(): Promise<void> {
    if (!store.user.token) {
        return
    }

    if (props.profile.following) {
        disabled.value = true
        await unfollow(props.profile.username, store.user.token)
        emit('unfollowed')
        return
    }

    disabled.value = true
    await follow(props.profile.username, store.user.token)
    emit('followed')

}


</script>
<template>
    <button :disabled="disabled" @click.prevent="toggleFollow" class="btn btn-sm btn-outline-secondary action-btn">
        <i class="ion-plus-round"></i>
        &nbsp; {{ props.profile.following ? 'Unfollow' : 'Follow' }} {{ props.profile.username }}
    </button>
</template>