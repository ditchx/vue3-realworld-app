import { ref, type Ref } from 'vue'
import axios from 'axios'
import { getServiceURL, getErrors } from '.'
import { emptyProfile, type Profile } from './profile'

const serviceURL = getServiceURL()

export interface Comment {
  id: number
  createdAt: string
  updatedAt: string
  body: string
  author: Profile
}

export interface NewComment {
  body: string
}

export interface UseCommentReturnType {
  isLoading: Ref<boolean>
  lastError: Ref<string[]>
  commentsList: Ref<Comment[]>
  comment: Ref<Comment>
  getComments: (slug: string, token?: string) => Promise<void>
  addComment: (text: NewComment, slug: string, token: string) => Promise<void>
  deleteComment: (slug: string, id: number, token: string) => Promise<void>
}

export function emptyComment(): Comment {
  return {
    id: 0,
    createdAt: '',
    updatedAt: '',
    body: '',
    author: emptyProfile()
  }
}

export function useComment(): UseCommentReturnType {
  const isLoading = ref(false)
  const lastError = ref<string[]>([])
  const commentsList = ref<Comment[]>([])
  const comment = ref<Comment>(emptyComment())

  async function getComments(slug: string, token?: string): Promise<void> {
    lastError.value = []
    isLoading.value = true
    try {

      const cfg: any = {}

      if (token) {
        cfg.headers = {
          Authorization: 'Token ' + token
        }
      }

      const response = await axios.get(serviceURL + '/articles/' + slug + '/comments', cfg)
      commentsList.value = response.data.comments
    } catch (error) {
      commentsList.value = []
      lastError.value = getErrors(error)
    }
    isLoading.value = false
  }

  async function addComment(text: NewComment, slug: string, token: string): Promise<void> {
    lastError.value = []
    isLoading.value = true
    try {
      const response = await axios.post(
        serviceURL + '/articles/' + slug + '/comments',
        {
          comment: text
        },
        {
          headers: {
            Authorization: 'Token ' + token
          }
        }
      )
      comment.value = response.data.comment
    } catch (error) {
      comment.value = emptyComment()
      lastError.value = getErrors(error)
    }
    isLoading.value = false
  }

  async function deleteComment(slug: string, id: number, token: string): Promise<void> {
    lastError.value = []
    isLoading.value = true
    try {
      await axios.delete(serviceURL + '/articles/' + slug + '/comments/' + id, {
        headers: {
          Authorization: 'Token ' + token
        }
      })
    } catch (error) {
      comment.value = emptyComment()
      lastError.value = getErrors(error)
    }
    isLoading.value = false
  }

  return {
    isLoading,
    lastError,
    commentsList,
    comment,
    getComments,
    addComment,
    deleteComment
  }
}

export default useComment
