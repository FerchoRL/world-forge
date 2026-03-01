const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not defined. Check your frontend .env.<mode> file.')
}

export const env = {
    mode: import.meta.env.MODE,
    apiBaseUrl,
}