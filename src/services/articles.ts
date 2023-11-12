import { provide, inject, ref, type Ref, type InjectionKey } from 'vue'
import { getServiceURL, getErrors } from '.'
import axios from 'axios'
import { emptyProfile, type Profile } from './profile'

const serviceURL = getServiceURL()

export type Pagination = {
  offset?: number | null
  limit?: number | null
}

export type ArticleFilters = {
  tag?: string | null
  author?: string | null
  favorited?: string | null
}

export type ArticleParams = ArticleFilters & Pagination

export interface Article {
  slug: string
  title: string
  description: string
  body: string
  tagList: string[]
  createdAt: string
  updateAt: string
  favorited: boolean
  favoritesCount: number
  author: Profile
}

export interface NewArticle {
  title: string
  description: string
  body: string
  tagList?: string[]
}

export interface UpdateArticle {
  title?: string
  description?: string
  body?: string
}

export interface UseArticleReturnType {
  lastError: Ref<string[]>
  isLoading: Ref<boolean>
  article: Ref<Article>
  articleList: Ref<Article[]>
  totalCount: Ref<number>
  getFeed: (token: string, params?: Pagination) => Promise<void>
  listArticles: (params?: ArticleParams, token?: string) => Promise<void>
  addArticle: (newArticle: NewArticle, token: string) => Promise<void>
  getArticle: (slug: string, token?: string) => Promise<void>
  updateArticle: (modArticle: UpdateArticle, slug: string, token: string) => Promise<void>
  deleteArticle: (slug: string, token: string) => Promise<void>
  addFavorite: (slug: string, token: string) => Promise<void>
  removeFavorite: (slug: string, token: string) => Promise<void>
}

export interface ArticleProvider {
  article: Ref<Article>
  updateFavorite: (favorite: boolean) => void
}

export const articleProviderKey = Symbol() as InjectionKey<ArticleProvider>

export function emptyArticle(): Article {
  return {
    slug: '',
    title: '',
    description: '',
    body: '',
    tagList: [],
    createdAt: '',
    updateAt: '',
    favorited: false,
    favoritesCount: 0,
    author: emptyProfile()
  }
}

export function provideArticle(article: Ref<Article>): void{

  const updateFavorite = function updateFavorite(favorite: boolean): void {
    if (article.value.favorited === favorite) {
        return
    }

    article.value.favorited = favorite;

    if (favorite) {
      article.value.favoritesCount++       
    } else {
      article.value.favoritesCount-- 
    }

  }

  provide(articleProviderKey, {
    article,
    updateFavorite
  })
}

export function injectArticle(): ArticleProvider {
  return inject(articleProviderKey) as ArticleProvider 
}

export function useArticle(): UseArticleReturnType {
  const lastError = ref<string[]>([])
  const isLoading = ref(false)
  const article = ref<Article>(emptyArticle())
  const articleList = ref<Article[]>([])
  const totalCount = ref(0)

  async function getFeed(
    token: string, 
    {
      limit = null,
      offset = null
    }: Pagination = {}
  ): Promise<void> {
    lastError.value = []
    isLoading.value = true
    try {

      const cfg: any = {
        params: { limit, offset },
        headers: {
          Authorization: 'Token ' + token
        }
      }

      const response = await axios.get(serviceURL + '/articles/feed', cfg)
      articleList.value = response.data.articles
      totalCount.value = response.data.articlesCount
    } catch (error) {
      articleList.value = []
      totalCount.value = 0
      lastError.value = getErrors(error)
    }
    isLoading.value = false
  }

  async function listArticles(
    {
      tag = null,
      author = null,
      favorited = null,
      limit = null,
      offset = null
    }: ArticleParams = {}, 
    token: string = ''
  ): Promise<void> {
    lastError.value = []
    isLoading.value = true
    try {
      const cfg: any = { 
        params: { tag, author, favorited, limit, offset }
      } 

      if (token) {
        cfg.headers = {
          Authorization: 'Token ' + token
        }
      }

      const response = await axios.get(serviceURL + '/articles', cfg)
      articleList.value = response.data.articles
      totalCount.value = response.data.articlesCount
    } catch (error) {
      articleList.value = []
      totalCount.value = 0
      lastError.value = getErrors(error)
    }
    isLoading.value = false
  }

  async function addArticle(newArticle: NewArticle, token: string): Promise<void> {
    lastError.value = []
    isLoading.value = true
    try {
      const response = await axios.post(
        serviceURL + '/articles',
        {
          article: newArticle
        },
        {
          headers: {
            Authorization: 'Token ' + token
          }
        }
      )
      article.value = response.data.article
    } catch (error) {
      article.value = emptyArticle()
      lastError.value = getErrors(error)
    }
    isLoading.value = false
  }

  async function getArticle(slug: string, token?: string): Promise<void> {
    lastError.value = []
    isLoading.value = true
    try {
      const cfg: any = {}

      if (token) {
        cfg.headers = {
          Authorization: 'Token ' + token
        }
      }

      const response = await axios.get(serviceURL + '/articles/' + slug, cfg)
      article.value = response.data.article
    } catch (error) {
      article.value = emptyArticle()
      lastError.value = getErrors(error)
    }
    isLoading.value = false
  }

  async function updateArticle(modArticle: UpdateArticle, slug: string, token: string): Promise<void> {
    lastError.value = []
    isLoading.value = true
    try {
      const response = await axios.put(
        serviceURL + '/articles/' + slug ,
        {
          article: modArticle
        },
        {
          headers: {
            Authorization: 'Token ' + token
          }
        }
      )
      article.value = response.data.article
    } catch (error) {
      article.value = emptyArticle()
      lastError.value = getErrors(error)
    }
    isLoading.value = false
  }

  async function deleteArticle(slug: string, token: string): Promise<void> {
    lastError.value = []
    isLoading.value = true
    try {
      const response = await axios.delete(serviceURL + '/articles/' + slug, {
        headers: {
          Authorization: 'Token ' + token
        }
      })
      articleList.value = response.data.article
    } catch (error) {
      article.value = emptyArticle()
      lastError.value = getErrors(error)
    }
    isLoading.value = false
  }

  async function addFavorite(slug: string, token: string): Promise<void> {
    lastError.value = []
    isLoading.value = true
    try {
      const response = await axios.post(serviceURL + '/articles/' + slug + '/favorite', {}, {
        headers: {
          Authorization: 'Token ' + token
        }
      })
      article.value = response.data.article
    } catch (error) {
      lastError.value = getErrors(error)
    }
    isLoading.value = false
  }

  async function removeFavorite(slug: string, token: string): Promise<void> {
    lastError.value = []
    isLoading.value = true
    try {
      const response = await axios.delete(serviceURL + '/articles/' + slug + '/favorite', {
        headers: {
          Authorization: 'Token ' + token
        }
      })
      article.value = response.data.article
    } catch (error) {
      lastError.value = getErrors(error)
    }
    isLoading.value = false
  }

  return {
    lastError,
    isLoading,
    article,
    articleList,
    totalCount,
    getFeed,
    listArticles,
    addArticle,
    getArticle,
    updateArticle,
    deleteArticle,
    addFavorite,
    removeFavorite
  }
}

export default useArticle
