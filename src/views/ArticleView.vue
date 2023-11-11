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
const comment = ref<string>("")
const {article, getArticle, isLoading} = useArticle()
const { 
  isLoading: commentIsLoading,
  comment: newComment,
  commentsList, 
  getComments, 
  addComment, 
  deleteComment } = useComment()

provideArticle(article)

const profile = ref(article.value.author)
provideProfile(profile)

onMounted(async () => {
  watch(article, (newValue) => {
    profile.value = newValue.author
  })

  await getArticle(<string>route.params['slug'], store.user.token)
  await getComments(<string>route.params['slug'])
})

async function deleteArticleComment(id: number): Promise<void> {
  commentsList.value = commentsList.value.filter((comment) => comment.id !== id)
  await deleteComment(<string>route.params['slug'], id, store.user.token)
}

async function postComment(text: string): Promise<void> {
  await addComment({body: text}, <string>route.params['slug'], store.user.token)  
  commentsList.value.push(newComment.value)
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

                    <form v-if="store.user.token" class="card comment-form">
                        <div class="card-block">
                            <textarea v-model="comment" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
                        </div>
                        <div class="card-footer">
                            <img :src="store.user.image" class="comment-author-img" />
                            <button  :disabled="commentIsLoading" @click.prevent="postComment(comment)"  class="btn btn-sm btn-primary">Post Comment</button>
                        </div>
                    </form>
                    <p v-else>
                      <router-link :to="{name: 'login'}">Sign in</router-link>
                      or 
                      <router-link :to="{name: 'register'}">sign up</router-link>
                      to add comments on this article.
                    </p>

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
