import axios from 'axios'
let serviceURL = 'https://api.realworld.io/api'

export function getServiceURL(): string {
  return serviceURL
}

export function setServiceURL(url: string) {
  serviceURL = url
}

export function getErrors(e: any): string[] {
  if (axios.isAxiosError(e) && e.response) {
    const msg: string[] = []

    Object.keys(e.response.data.errors).forEach((k) =>
      msg.push(k + ' : ' + e.response?.data.errors[k].join(''))
    )
    return msg
  }
  return []
}
