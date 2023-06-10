<script lang="ts" setup>
import { useTags } from '@/services/tags';

const { tags, getTags } = useTags()

getTags()

</script>
<template>
    <div class="tag-list">
        <a v-for="tag in tags" :key="tag" href="" class="tag-pill tag-default">{{ tag }}</a>
    </div>
</template>