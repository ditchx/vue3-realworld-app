<script lang="ts" setup>
import useArticle from '@/services/articles'
import { useAuthStore } from '@/stores/auth'
import { onMounted, watch, ref } from 'vue'
import ArticlePreview from "@/components/ArticlePreview.vue"

const store = useAuthStore()
const isFeed = ref(false)
const {articleList, isLoading, getFeed, listArticles } = useArticle()

function setFeed(feed: boolean) {
    isFeed.value = feed
}

onMounted(() => {

    watch(isFeed, (val) => {
        if (val) {
            getFeed(store.user.token)
        } else {
            listArticles()
        }
    })

    if (store.isLoggedIn) {
        isFeed.value = true
    }
})

</script>
<template>
    <div class="col-md-9">
        <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
                <li v-if="store.isLoggedIn" class="nav-item">
                    <a @click.prevent="setFeed(true)" class="nav-link" :class="{active: isFeed}" href="">Your Feed</a>
                </li>
                <li class="nav-item">
                    <a @click.prevent="setFeed(false)" class="nav-link" :class="{active: !isFeed}" href="">Global Feed</a>
                </li>
            </ul>
        </div>

        <div v-if="isLoading" class="article-preview">
            Loading articles ...
        </div>
        <div v-else>

            <div v-if="!articleList.length" class="article-preview">
                No articles are here... yet.
            </div>

            <ArticlePreview v-for="article in articleList" :article="article" :key="article.slug" />
        </div>


    </div>
</template>