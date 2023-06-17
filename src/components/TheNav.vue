<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { RouterLink, useRoute } from 'vue-router'
const store = useAuthStore()
const route = useRoute()
</script>
<template>
  <nav class="navbar navbar-light">
    <div class="container">
      <router-link :to="{ name: 'home' }" class="navbar-brand">conduit </router-link>
      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <!-- Add "active" class when you're on that page" -->
          <router-link
            :to="{ name: 'home' }"
            :class="{ active: route.name == 'home' }"
            class="nav-link"
            >Home</router-link
          >
        </li>
        <li v-if="store.isLoggedIn" class="nav-item">
          <router-link
            :to="{ name: 'create_article' }"
            class="nav-link"
            :class="{ active: route.name == 'create_article' }"
          >
            <i class="ion-compose"></i>&nbsp;New Article
          </router-link>
        </li>
        <li v-if="store.isLoggedIn" class="nav-item">
          <router-link
            :to="{ name: 'settings' }"
            class="nav-link"
            :class="{ active: route.name == 'settings' }"
          >
            <i class="ion-gear-a"></i>&nbsp;Settings
          </router-link>
        </li>
        <li v-if="store.isLoggedIn" class="nav-item">
          <router-link
            :to="{ name: 'profile', params: { username: store.user.username } }"
            class="nav-link"
            :class="{ active: route.name == 'profile' }"
          >
            <img :src="store.user.image" class="user-pic" />&nbsp;{{ store.user.username }}
          </router-link>
        </li>
        <li v-if="!store.isLoggedIn" class="nav-item">
          <router-link
            :to="{ name: 'login' }"
            class="nav-link"
            :class="{ active: route.name == 'login' }"
            >Sign in</router-link
          >
        </li>
        <li v-if="!store.isLoggedIn" class="nav-item">
          <router-link
            :to="{ name: 'register' }"
            class="nav-link"
            :class="{ active: route.name == 'register' }"
            >Sign up</router-link
          >
        </li>
      </ul>
    </div>
  </nav>
</template>
