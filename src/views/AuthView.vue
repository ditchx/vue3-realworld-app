<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useUser } from '@/services/users'
import { useAuthStore } from '@/stores/auth'
const username = ref('')
const email = ref('')
const password = ref('')
const route = useRoute()
const router = useRouter()
const { currentUser, lastError, login } = useUser()
const loginMode = ref('login' === route.name)
const disable = ref(false)
const store = useAuthStore()

async function doLogin() {
    disable.value = true
    await login(email.value, password.value)
    disable.value = false
}

const unwatch = watch(currentUser, (u) => {
    if (u && u.token == '') {
        return
    }

    unwatch()
    store.login(u)

})

</script>
<template>
    <div class="auth-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-6 offset-md-3 col-xs-12">

                    <h1 class="text-xs-center">Sign {{ loginMode ? 'in' : 'up' }}</h1>
                    <p class="text-xs-center">
                        <router-link :to="{ name: loginMode ? 'register' : 'login' }">{{ loginMode ? 'Need' : 'Have' }} an
                            account?</router-link>
                    </p>
                    <ul class="error-messages">
                        <li v-for="erroMsg in lastError" :key="erroMsg">{{ erroMsg }}</li>
                    </ul>


                    <form @submit.prevent="doLogin">
                        <fieldset :disabled="disable" v-if="!loginMode" class="form-group">
                            <input required v-model.trim="username" class="form-control form-control-lg" type="text"
                                placeholder="Username" />
                        </fieldset>
                        <fieldset :disabled="disable" class="form-group">
                            <input required type="email" v-model.trim="email" class="form-control form-control-lg"
                                placeholder="Email" />
                        </fieldset>
                        <fieldset :disabled="disable" class="form-group">
                            <input required v-model.trim="password" class="form-control form-control-lg" type="password"
                                placeholder="Password" />
                        </fieldset>
                        <button :disabled="disable" class="btn btn-lg btn-primary pull-xs-right">Sign {{ loginMode ? 'in' :
                            'up' }}</button>
                    </form>



                </div>
            </div>
    </div>
</div></template>