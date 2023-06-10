import { ref, type Ref } from "vue"
import axios from "axios";
import { getServiceURL, getErrors } from ".";

const serviceURL = getServiceURL();

export interface UseTagsReturnType {
    lastError: Ref<string[]>
    tags: Ref<string[]>
    getTags: (() => void)
}

export function useTags(): UseTagsReturnType {
    const lastError = ref<string[]>([])
    const tags = ref<string[]>([])

    async function getTags() {
        lastError.value = []
        try {
            const response = await axios.get(serviceURL + '/tags')

            tags.value = response.data.tags
        } catch (error) {
            tags.value = []
            lastError.value = getErrors(error)
        }
    }

    return {
        lastError,
        tags,
        getTags
    }
}

export default useTags