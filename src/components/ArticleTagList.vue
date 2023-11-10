<script setup lang="ts">
const props = defineProps<{
  tags: string[]
}>()

</script>
<template>
  <ul v-if="props.tags.length" class="tag-list">
    <li v-for="tag in props.tags" class="tag-default tag-pill tag-outline">{{ tag }}</li>
  </ul>
</template>
