import { ref, type Ref } from "vue"
import { getServiceURL, getErrors } from "."
import axios from "axios"
import { emptyProfile, type Profile } from "./profile"

const serviceURL = getServiceURL();

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
    tagList?: [string]
}

export interface UpdateArticle {
    title?: string
    description?: string
    body?: string
}


export interface UseArticleReturnType {
    lastError: Ref<string[]>
    article: Ref<Article>
    articleList: Ref<Article[]>
    getFeed: ((token: string) => void)
    listArticles: (() => void)
    addArticle: ((newArticle: NewArticle, token: string) => void)
    getArticle: ((slug: string) => void)
    updateArticle: ((modArticle: UpdateArticle, slug: string, token: string) => void)
    deleteArticle: ((slug: string, token: string) => void)
    addFavorite: ((slug: string, token: string) => void)
    removeFavorite: ((slug: string, token: string) => void)
}

export function emptyArticle(): Article {
    return {
        slug: "",
        title: "",
        description: "",
        body: "",
        tagList: [],
        createdAt: "",
        updateAt: "",
        favorited: false,
        favoritesCount: 0,
        author: emptyProfile()

    }
}

export function useArticle(): UseArticleReturnType {
    const lastError = ref<string[]>([])
    const article = ref<Article>(emptyArticle())
    const articleList = ref<Article[]>([])

    async function getFeed(token: string) {
        lastError.value = []
        try {
            const response = await axios.get(
                serviceURL + '/articles/feed',
                {
                    headers: {
                        'Authorization': 'Token ' + token
                    }
                }
            )
            articleList.value = response.data.articles

        } catch (error) {
            articleList.value = []
            lastError.value = getErrors(error)
        }
    }

    async function listArticles() {
        lastError.value = []
        try {
            const response = await axios.get(serviceURL + '/articles')
            articleList.value = response.data.articles
        } catch (error) {
            articleList.value = []
            lastError.value = getErrors(error)
        }
    }

    async function addArticle(newArticle: NewArticle, token: string) {
        lastError.value = []
        try {
            const response = await axios.post(
                serviceURL + '/articles',
                {
                    article: newArticle
                },
                {
                    headers: {
                        'Authorization': 'Token ' + token
                    }
                }
            )
            article.value = response.data.article
        } catch (error) {
            article.value = emptyArticle()
            lastError.value = getErrors(error)
        }
    }

    async function getArticle(slug: string) {
        lastError.value = []
        try {
            const response = await axios.get(serviceURL + '/articles/' + slug)
            articleList.value = response.data.article
        } catch (error) {
            article.value = emptyArticle()
            lastError.value = getErrors(error)
        }
    }


    async function updateArticle(modArticle: UpdateArticle, slug: string, token: string) {
        lastError.value = []
        try {
            const response = await axios.put(
                serviceURL + '/articles',
                {
                    article: modArticle
                },
                {
                    headers: {
                        'Authorization': 'Token ' + token
                    }
                }
            )
            article.value = response.data.article
        } catch (error) {
            article.value = emptyArticle()
            lastError.value = getErrors(error)
        }
    }

    async function deleteArticle(slug: string, token: string) {
        lastError.value = []
        try {
            const response = await axios.delete(
                serviceURL + '/articles/' + slug,
                {
                    headers: {
                        'Authorization': 'Token ' + token
                    }
                }
            )
            articleList.value = response.data.article
        } catch (error) {
            article.value = emptyArticle()
            lastError.value = getErrors(error)
        }
    }


    async function addFavorite(slug: string, token: string) {
        lastError.value = []
        try {
            const response = await axios.post(
                serviceURL + '/articles/' + slug + '/favorite',
                {
                    headers: {
                        'Authorization': 'Token ' + token
                    }
                }
            )
            article.value = response.data.article
        } catch (error) {
            lastError.value = getErrors(error)
        }
    }

    async function removeFavorite(slug: string, token: string) {
        lastError.value = []
        try {
            const response = await axios.delete(
                serviceURL + '/articles/' + slug + '/favorite',
                {
                    headers: {
                        'Authorization': 'Token ' + token
                    }
                }
            )
            article.value = response.data.article
        } catch (error) {
            lastError.value = getErrors(error)
        }
    }

    return {
        lastError,
        article,
        articleList,
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