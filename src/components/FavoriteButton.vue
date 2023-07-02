<script lang="ts" setup>
import { ref } from 'vue'
import { useArticle, type Article } from '@/services/articles'
import { useAuthStore } from '@/stores/auth';


const props = defineProps<{
    article: Article
}>()

const emit = defineEmits<{
    (e: 'favorite-clicked', newValue: boolean, oldValue: boolean): void
}>()
const store = useAuthStore()

const { article, isLoading, addFavorite, removeFavorite } = useArticle()

article.value = props.article

async function toggleFavorite() {
  if (!store.isLoggedIn || isLoading.value) {
    return
  }

  emit('favorite-clicked', !article.value.favorited, article.value.favorited)
  if (article.value.favorited) {
    await removeFavorite(props.article.slug, store.user.token)
  } else {
    await addFavorite(props.article.slug, store.user.token)
  }
}


</script>
<template>
    <button :disabled="isLoading" @click.prevent="toggleFavorite"
        :class="{ 'btn-primary': article.favorited, 'btn-outline-primary': !article.favorited }"
        class="btn btn-sm pull-xs-right">
        <i class="ion-heart"></i> {{ article.favoritesCount }}
    </button>
</template>