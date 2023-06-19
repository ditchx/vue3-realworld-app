<script lang="ts" setup>
import useArticle from '@/services/articles'
import { useAuthStore } from '@/stores/auth'
import { onMounted, watch, ref } from 'vue'
import ArticlePreview from '@/components/ArticlePreview.vue'

const props = defineProps<{
  tag?: string
}>()
const emits = defineEmits<{
  (e: 'feedChanged', feedType: string): void
}>()
const store = useAuthStore()
const isFeed = ref(false)
const { articleList, isLoading, getFeed, listArticles } = useArticle()

function setFeed(feed: boolean) {
  if (isLoading.value) {
    return
  }

  isFeed.value = feed

  if (feed) {
    emits('feedChanged', 'user')
  } else {
    emits('feedChanged', 'global')
  }
}

onMounted(() => {
  watch(isFeed, (val) => {
    if (val) {
      getFeed(store.user.token)
    } else {
      listArticles()
    }
  })

  watch(() => props.tag, (val) => {
    if (val == '') {
      listArticles()
      return
    }
    listArticles({ tag: val })
  })

  if (store.isLoggedIn) {
    isFeed.value = true
  } else {
    listArticles()
  }
})
</script>
<template>
  <div class="col-md-9">
    <div class="feed-toggle">
      <ul class="nav nav-pills outline-active">
        <li v-if="store.isLoggedIn" class="nav-item">
          <a @click.prevent="setFeed(true)" class="nav-link" :class="{ active: isFeed && !tag }" href="">Your Feed</a>
        </li>
        <li class="nav-item">
          <a @click.prevent="setFeed(false)" class="nav-link" :class="{ active: !isFeed && !tag }" href="">Global Feed</a>
        </li>
        <li v-if="props.tag" class="nav-item">
          <a class="nav-link active">#{{ props.tag }}</a>
        </li>
      </ul>
    </div>

    <div v-if="isLoading" class="article-preview">Loading articles ...</div>
    <div v-else>
      <div v-if="!articleList.length" class="article-preview">No articles are here... yet.</div>

      <ArticlePreview v-for="article in articleList" :article="article" :key="article.slug" />
    </div>
  </div>
</template>
