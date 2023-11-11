<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useArticle, provideArticle } from '@/services/articles'
import { provideProfile } from '@/services/profile';
import useComment from '@/services/comments';
import ArticleMeta from '@/components/ArticleMeta.vue';
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref, watch } from 'vue';
import ArticleTagList from '@/components/ArticleTagList.vue';
import ArticleComment from '@/components/ArticleComment.vue';

const route = useRoute()
const store = useAuthStore()
const {article, getArticle, isLoading} = useArticle()
const { commentsList, getComments, deleteComment } = useComment()

provideArticle(article)

const profile = ref(article.value.author)
provideProfile(profile)

onMounted(() => {
  watch(article, (newValue) => {
    profile.value = newValue.author
  })

  getArticle(<string>route.params['slug'], store.user.token)
  getComments(<string>route.params['slug'])
})

function deleteArticleComment(id: number): void {
  commentsList.value = commentsList.value.filter((comment) => comment.id !== id)
  deleteComment(<string>route.params['slug'], id, store.user.token)
}

</script>
<template>
    <div v-if="!isLoading" class="article-page">
        <div class="banner">
            <div class="container">
                <h1>{{ article.title }}</h1>
                <ArticleMeta />
            </div>
        </div>

        <div class="container page">
            <div class="row article-content">
                <div class="col-md-12">
                <p>{{ article.body }}</p>
                </div>
                <ArticleTagList :tags="article.tagList" />
            </div>

            <hr />

            <div class="article-actions">
                <ArticleMeta />
            </div>

            <div class="row">
                <div class="col-xs-12 col-md-8 offset-md-2">
                    <form class="card comment-form">
                        <div class="card-block">
                            <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
                        </div>
                        <div class="card-footer">
                            <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
                            <button class="btn btn-sm btn-primary">Post Comment</button>
                        </div>
                    </form>

                    <ArticleComment 
                      v-for="comment in commentsList" 
                      :comment="comment" 
                      :key="comment.id" 
                      :user="store.user"

                      @delete="deleteArticleComment"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
