<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useArticle, type Article } from '@/services/articles'
import { useDateFormat } from '@vueuse/core'
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import FavoriteButton from './FavoriteButton.vue';

const store = useAuthStore()
const props = defineProps<{
  article: Article
}>()
const article = ref(props.article)

</script>
<template>
  <div class="article-preview">
    <div class="article-meta">
      <router-link :to="{name: 'profile', params: { username: article.author.username }}"><img :src="article.author.image" /></router-link>
      <div class="info">
        <router-link :to="{name: 'profile', params: { username: article.author.username }}" class="author">{{ article.author.username }}</router-link>
        <span class="date">{{ useDateFormat(article.createdAt, 'MMMM D, YYYY').value }}</span>
      </div>
      <FavoriteButton :article="article" class="pull-xs-right" />
    </div>
    <router-link :to="{name: 'article', params: { slug: article.slug }}" class="preview-link">
      <h1>{{ article.title }}</h1>
      <p>{{ article.description }}</p>
      <span>Read more...</span>
      <ul v-if="article.tagList.length" class="tag-list">
        <li v-for="tag in article.tagList" class="tag-default tag-pill tag-outline">{{ tag }}</li>
      </ul>
    </router-link>
  </div>
</template>
