import { Api } from "./generated/Api"

export const api = new Api({
  baseUrl: "https://api.realworld.io/api",
})

export function errorMessage(response: any): string {
  if (response.error !== undefined) {
    return Object.keys(response.error.errors)
      .map((key) => {
        const msgs = response.error.errors[key] as string[]
        return `${key} ${msgs[0]}`
      })
      .join(" ")
  } else {
    return `could not extract error from: ${JSON.stringify(response)} `
  }
}
