<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useArticle } from '@/services/articles'
import router from '@/router'
import { useRoute } from 'vue-router';

const title = ref('')
const description = ref('')
const body = ref('')
const tag = ref('')
const tagList = ref<Set<string>>(new Set<string>())

const store = useAuthStore()

const { 
  article, 
  isLoading, 
  lastError, 
  addArticle, 
  getArticle, 
  updateArticle } = useArticle()

const formDisabled = computed(() => isLoading.value)

const route = useRoute()

const slug = <string>route.params['slug']

onMounted(async () => {
  if (slug) {
    await getArticle(slug, store.user.token)

    title.value = article.value.title
    description.value = article.value.description
    body.value = article.value.body
    tagList.value = new Set<string>(article.value.tagList)
  }
})


async function publishArticle(): Promise<void> {

  if (slug) {
    await updateArticle({
      title: title.value,
      description: description.value,
      body: body.value,
      tagList: Array.from(tagList.value)
    }, slug, store.user.token) 

  } else {
    await addArticle({
      title: title.value,
      description: description.value,
      body: body.value,
      tagList: Array.from(tagList.value)
    }, store.user.token) 
  }
  
  if (!lastError.value.length && article.value.slug) {
    router.push({name: 'article', params: { slug: article.value.slug }})
  }
}

function checkTag(event: Event) {
  const key: string | null  = (event instanceof InputEvent) ? 
    (event as InputEvent).data : (event as KeyboardEvent).key
 
  if (key === null) {
    return
  }
  
  if (key == ',' || key == ' ' || key == 'Enter') {
    if (key !== 'Enter') {
      tag.value = tag.value.slice(0, -1)
    }

    tagList.value.add(tag.value)
    tag.value = ''
    return
  }

  if (!/^[0-9a-zA-Z\-\_]*$/.test(tag.value)) {
    tag.value = tag.value.slice(0, -1)
  }
}


function removeTag(tag: string) {
  tagList.value.delete(tag)
}

</script>
<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
              <li v-for="erroMsg in lastError" :key="erroMsg">{{ erroMsg }}</li>
          </ul>
          <form @submit.prevent="">
            <fieldset>
              <fieldset class="form-group">
                <input
                  :disabled="formDisabled"
                  v-model="title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input :disabled="formDisabled" v-model="description" type="text" class="form-control" placeholder="What's this article about?" />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  :disabled="formDisabled"
                  v-model="body"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input v-model="tag" @input="checkTag" @keyup.enter="checkTag" @paste.prevent="" :disabled="formDisabled" type="text" class="form-control" placeholder="Enter tags" />
                <div class="tag-list">
                  <span v-for="tag in tagList" :key="tag" class="tag-default tag-pill">{{ tag }} <i @click="removeTag(tag)" class="ion-close-round"></i></span>
                </div>
              </fieldset>
              <button @click.prevent="publishArticle" class="btn btn-lg pull-xs-right btn-primary" type="button">
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
