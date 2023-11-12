<script lang="ts" setup>
import { computed } from 'vue';
const props = defineProps<{
    limit: number
    total: number
    currentPage: number
}>()

const pageCount = computed(() => Math.ceil(props.total / props.limit))

</script>
<template>
    <nav v-if="pageCount > 1">
        <ul class="pagination">
            <li :key="page" v-for="page in pageCount" :class="{ active: currentPage == page }" class="page-item"><a href=""
                    @click.prevent="$emit('page-selected', page)" class="page-link">{{ page }}</a></li>
        </ul>
    </nav>
</template>
