<script lang="ts" setup="">
import { injectArticle } from '@/services/articles';
import FavoriteButton from './FavoriteButton.vue';
import { useDateFormat } from '@vueuse/core';
import FollowUser from './FollowUser.vue';
const { article } = injectArticle()


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
    
  </div>
</template>
