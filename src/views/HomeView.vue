<script setup lang="ts">
import { ref } from 'vue'
import TagList from '@/components/TagList.vue'
import ArticleFeed from '@/components/ArticleFeed.vue'

const tag = ref('')

function emptyTag() {
  tag.value = '';
}

function setTag(targetTag: string) {
  tag.value = targetTag;
}

</script>

<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
    <div class="container page">
      <div class="row">
        <ArticleFeed @feed-changed="emptyTag" :tag="tag" />
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <TagList @tag-selected="setTag" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
