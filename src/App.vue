<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'

const route = useRoute()

</script>

<template>
  <TheHeader />
  <RouterView :key="route.fullPath" />
  <TheFooter />
</template>