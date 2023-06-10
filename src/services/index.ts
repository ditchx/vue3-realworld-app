import axios
 from "axios"
let serviceURL = "https://api.realworld.io/api"

export function getServiceURL(): string {
    return serviceURL
}

export function setServiceURL(url: string) {
    serviceURL = url
}

export function getErrors(e: any): string[] {
    if (axios.isAxiosError(e) && e.response) {
        return e.response.data.errors.body
    }
    return []
}