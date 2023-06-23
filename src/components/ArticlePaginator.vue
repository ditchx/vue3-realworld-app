<script lang="ts" setup>
import { computed } from 'vue';
const props = defineProps<{
    limit: number
    total: number
    currentPage: number
}>()

const emit = defineEmits<{
    (e: 'page-selected', page: number): void
}>()

const pageCount = computed(() => Math.ceil(props.total / props.limit))

</script>
<template>
    <nav v-if="pageCount > 2">
        <ul class="pagination">
            <li v-for="page in pageCount" :class="{ active: currentPage == page }" class="page-item"><a href=""
                    @click.prevent="$emit('page-selected', page)" class="page-link">{{ page }}</a></li>
        </ul>
    </nav>
</template>