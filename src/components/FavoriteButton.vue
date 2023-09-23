<script lang="ts" setup>
import { useArticle, articleProviderKey, type ArticleProvider } from '@/services/articles'
import { useAuthStore } from '@/stores/auth';
import { inject } from 'vue';

const store = useAuthStore()
const { isLoading, addFavorite, removeFavorite } = useArticle()
const { article, updateFavorite } = inject(articleProviderKey) as ArticleProvider

async function toggleFavorite() {
  if (!store.isLoggedIn || isLoading.value) {
    return
  }

  if (article.value.favorited) {
    await removeFavorite(article.value.slug, store.user.token)
  } else {
    await addFavorite(article.value.slug, store.user.token)
  }

  updateFavorite(!article.value.favorited) 
}


</script>
<template>
    <button :disabled="isLoading" @click.prevent="toggleFavorite" 
        :class="{ 'btn-primary': article.favorited, 'btn-outline-primary': !article.favorited }"
        class="btn btn-sm">
        <slot>
          <i class="ion-heart"></i> {{ article.favoritesCount }}
        </slot>
    </button>
</template>
