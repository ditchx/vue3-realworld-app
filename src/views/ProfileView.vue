<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import useProfile from '@/services/profile';
import FollowUser from '@/components/FollowUser.vue';
import useArticle from '@/services/articles';
import ArticlePreview from '@/components/ArticlePreview.vue'
import ArticlePaginator from '@/components/ArticlePaginator.vue';

const route = useRoute()
const router = useRouter()
const store = useAuthStore()
const username = <string>route.params.username
const selfProfile = username === store.user.username
const { profile, lastError, getProfile } = useProfile()
const { articleList, isLoading, totalCount, listArticles } = useArticle()
const limit = ref(10), page = ref(1)
const offset = computed(() => (page.value - 1) * limit.value)
const feedType = ref("author")

function loadProfile() {
  getProfile(<string>route.params.username, store.user.token)
}

async function loadFeed(which: string) {
  if (which == 'author') {
      await listArticles({
        offset: offset.value,
        limit: limit.value,
        author: username
      }, store.user.token)
    }

    if (which == 'favorite') {
      await listArticles({
        offset: offset.value,
        limit: limit.value,
        favorited: username
      }, store.user.token)
    }
}

function setFeed(which: string) {
  feedType.value = which
}

async function getPage(p: number) {
  page.value = p
  loadFeed(feedType.value)
}

onMounted(() => {

  watch( () => lastError.value, (newValue) => {
    if (newValue.length) {
      router.push("/")
    }
  })

  loadProfile()

  watch(feedType, async(which) => {
    page.value = 1
    await loadFeed(which)
  }, {immediate: true})


})




</script>
<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <FollowUser @unfollowed="loadProfile" @followed="loadProfile" v-if="!selfProfile" :profile="profile" />
            <router-link v-if="selfProfile" :to="{ name: 'settings' }"
              class="btn btn-sm btn-outline-secondary action-btn"><i class="ion-gear-a"></i>&nbsp; Edit Profile
              Settings</router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">

          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="store.isLoggedIn" class="nav-item">
                <a @click.prevent="setFeed('author')" class="nav-link" :class="{ active: feedType == 'author' }" href="">My Articles</a>
              </li>
              <li class="nav-item">
                <a @click.prevent="setFeed('favorite')" class="nav-link" :class="{ active: feedType == 'favorite' }" href="">Favorited Articles</a>
              </li>
            </ul>
          </div>

          <div v-if="isLoading" class="article-preview">Loading articles ...</div>
          <div v-else>
            <div v-if="!articleList.length" class="article-preview">No articles are here... yet.</div>

            <ArticlePreview v-for="article in articleList" :article="article" :key="article.slug" />

            <ArticlePaginator @page-selected="getPage" :current-page="page" :limit="limit" :total="totalCount" />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
