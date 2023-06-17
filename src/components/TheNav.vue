<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { RouterLink, useRoute } from 'vue-router';
const store = useAuthStore()
const route = useRoute()

</script>
<template>
    <nav class="navbar navbar-light">
        <div class="container">
            <a class="navbar-brand" href="index.html">conduit</a>
            <ul class="nav navbar-nav pull-xs-right">
                <li class="nav-item">
                    <!-- Add "active" class when you're on that page" -->
                    <router-link :to="{name: 'home'}" :class="{active: route.name == 'home'}" class="nav-link" >Home</router-link>
                </li>
                <li v-if="store.isLoggedIn" class="nav-item">
                    <router-link :to="{name: 'create_article'}" class="nav-link" :class="{active: route.name == 'create_article'}" > <i class="ion-compose"></i>&nbsp;New Article </router-link>
                </li>
                <li v-if="store.isLoggedIn" class="nav-item">
                    <a class="nav-link" href=""> <i class="ion-gear-a"></i>&nbsp;Settings </a>
                </li>
                <li v-if="!store.isLoggedIn" class="nav-item">
                    <a class="nav-link" href="">Sign in</a>
                </li>
                <li v-if="!store.isLoggedIn" class="nav-item">
                    <a class="nav-link" href="">Sign up</a>
                </li>
            </ul>
        </div>
    </nav>
</template>