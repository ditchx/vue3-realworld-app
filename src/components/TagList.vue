<script lang="ts" setup>
import { useTags } from '@/services/tags'

const { tags, getTags } = useTags()
const emits = defineEmits<{
  (e: 'tagSelected', selected: string): void
}>()
getTags()

function setTag(selected: string) {
  emits('tagSelected', selected)
}

</script>
<template>
  <div class="tag-list">
    <a @click.prevent="setTag(tag)" v-for="tag in tags" :key="tag" href="" class="tag-pill tag-default">{{ tag }}</a>
  </div>
</template>
