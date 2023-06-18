<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth'
import { useUser, type User, type UpdateUser } from '@/services/users';

const store = useAuthStore()
const newPassword = ref("")
const user = reactive<User>(store.user)
const disable = ref(false)
const { currentUser, updateCurrentUser, lastError } = useUser()

async function doUpdate() {
    disable.value = true
    const data: UpdateUser = {}

    data.bio = user.bio

    if (user.email) {
        data.email = user.email
    }

    if (user.username) {
        data.username = user.username
    }

    if (user.image) {
        data.image = user.image
    }

    if (newPassword.value) {
        data.password = newPassword.value
    }

    const unwatch = watch(currentUser, (u) => {
        if (u && u.token == '') {
            return
        }

        unwatch()
        store.login(u)
    })

    await updateCurrentUser(data, store.user.token)

    disable.value = false
}

</script>
<template>
    <div class="settings-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Your Settings</h1>

                    <form @submit.prevent="doUpdate">
                        <fieldset>
                            <fieldset class="form-group">
                                <input :disabled="disable" v-model="user.image" class="form-control" type="text"
                                    placeholder="URL of profile picture" />
                            </fieldset>
                            <fieldset class="form-group">
                                <input :disabled="disable" required v-model="user.username"
                                    class="form-control form-control-lg" type="text" placeholder="Your Name" />
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea :disabled="disable" v-model="user.bio" class="form-control form-control-lg"
                                    rows="8" placeholder="Short bio about you"></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input :disabled="disable" required v-model="user.email"
                                    class="form-control form-control-lg" type="text" placeholder="Email" />
                            </fieldset>
                            <fieldset class="form-group">
                                <input :disabled="disable" v-model="newPassword" class="form-control form-control-lg"
                                    type="password" placeholder="Password" />
                            </fieldset>
                            <button :disabled="disable" class="btn btn-lg btn-primary pull-xs-right">Update
                                Settings</button>
                        </fieldset>
                        <ul class="error-messages">
                            <li v-for="erroMsg in lastError" :key="erroMsg">{{ erroMsg }}</li>
                        </ul>

                    </form>
                    <hr />
                    <button :disabled="disable" class="btn btn-outline-danger">Or click here to logout.</button>
                </div>
            </div>
        </div>
    </div>
</template>
