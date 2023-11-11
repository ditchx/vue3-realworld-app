<script setup lang="ts">
import type { Comment } from '@/services/comments'
import type { User } from '@/services/users'
import { useDateFormat } from '@vueuse/core'


const props = defineProps<{
  comment: Comment
  user: User
}>()

const emit= defineEmits<{
  delete: [comment_id: number]
}>()

function deleteComment(id: number): void {
  emit('delete', id);
}

</script>
<template>
  <div class="card">
      <div class="card-block">
          <p class="card-text">
            {{ props.comment.body }}
          </p>
      </div>
      <div class="card-footer">
        <router-link 
          class="comment-author" 
          :to="{name: 'profile', params: { username: props.comment.author.username }}">
            <img :src="props.comment.author.image" class="comment-author-img" /></router-link>
          &nbsp;
        <router-link 
          class="comment-author" 
          :to="{name: 'profile', params: { username: props.comment.author.username }}">
            {{ comment.author.username }}
        </router-link>
      <span class="date-posted">{{ useDateFormat(props.comment.createdAt, 'MMM Do').value }}</span>
          <span v-if="props.comment.author.username == user.username" class="mod-options">
              <i @click.prevent="deleteComment(props.comment.id)" class="ion-trash-a"></i>
          </span>
      </div>
  </div>
</template>
