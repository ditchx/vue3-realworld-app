<script lang="ts" setup>
import type { Article } from '@/services/articles'
import { useDateFormat } from '@vueuse/core'
defineProps<{
  article: Article
}>()
</script>
<template>
  <div class="article-preview">
    <div class="article-meta">
      <a href="profile.html"><img :src="article.author.image" /></a>
      <div class="info">
        <a href="" class="author">{{ article.author.username }}</a>
        <span class="date">{{ useDateFormat(article.createdAt, 'MMMM D, YYYY').value }}</span>
      </div>
      <button :class="{'btn-primary' : article.favorited, 'btn-outline-primary': !article.favorited}" class="btn btn-sm pull-xs-right">
        <i class="ion-heart"></i> {{ article.favoritesCount }}
      </button>
    </div>
    <a href="" class="preview-link">
      <h1>{{ article.title }}</h1>
      <p>{{ article.description }}</p>
      <span>Read more...</span>
    </a>
  </div>
</template>
