<script lang="ts" setup="">
import useArticle, { injectArticle } from '@/services/articles';
import FavoriteButton from './FavoriteButton.vue';
import { useDateFormat } from '@vueuse/core';
import FollowUser from './FollowUser.vue';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
const { article } = injectArticle()

const store = useAuthStore()
const isArticleOwner = store.user.username === article.value.author.username
const { deleteArticle } = useArticle()

function redirectToEdit() {
  router.push({ name: 'edit_article', params: { slug: article.value.slug }})
}

async function removeArticle(): Promise<void> {

  if (confirm('Are you sure you want to delete this article?')) {
    await deleteArticle(article.value.slug, store.user.token)
    router.push({name: 'home'}) 
  }
}

</script>
<template>
  <div v-if="article.author.username" class="article-meta">
    <router-link :to="{name: 'profile', params: { username: article.author.username  }}"><img :src="article.author.image" /></router-link>
    <div class="info">
      <router-link :to="{name: 'profile', params: { username: article.author.username }}" class="author">{{ article.author.username }}</router-link>
      <span class="date">{{ useDateFormat(article.createdAt, 'MMMM D, YYYY').value }}</span>
    </div>
    <FollowUser />
    &nbsp;&nbsp;
    <favorite-button>  
        <i class="ion-heart"></i>
      &nbsp; {{ article.favorited ? 'Unfavorite' : 'Favorite' }} Article <span class="counter">({{ article.favoritesCount }})</span>
    </favorite-button>
    <button @click.prevent="redirectToEdit" v-if="isArticleOwner" class="btn btn-sm btn-outline-secondary">
      <i class="ion-edit"></i> Edit Article
    </button>
    &nbsp;
    <button @click.prevent="removeArticle" v-if="isArticleOwner" class="btn btn-sm btn-outline-danger">
      <i class="ion-trash-a"></i> Delete Article
    </button>
  </div>
</template>
