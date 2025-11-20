export const useApi = () => {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase as string
    const { isOnline, getFromCache } = useOffline()

    const getToken = () => {
        if (import.meta.client) {
            return localStorage.getItem('token')
        }
        return null
    }

    const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
        const token = getToken()
        const fullUrl = `${apiBase}${endpoint}`
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        // Pour les requêtes GET, essayer le cache si offline
        if (options.method === 'GET' || !options.method) {
            if (!isOnline.value && import.meta.client) {
                const cached = await getFromCache<T>(fullUrl)
                if (cached) {
                    return cached
                }
            }
        }

        try {
            const response = await fetch(fullUrl, {
                ...options,
                headers,
            })

            if (!response.ok) {
                // Si offline et erreur, essayer le cache pour les GET
                if (!isOnline.value && (options.method === 'GET' || !options.method) && import.meta.client) {
                    const cached = await getFromCache<T>(fullUrl)
                    if (cached) {
                        return cached
                    }
                }
                const error = await response.json().catch(() => ({ message: 'An error occurred' }))
                throw new Error(error.message || `HTTP error! status: ${response.status}`)
            }

            return response.json()
        } catch (error: any) {
            // Si erreur réseau et offline, essayer le cache pour les GET
            if (!isOnline.value && (options.method === 'GET' || !options.method) && import.meta.client) {
                const cached = await getFromCache<T>(fullUrl)
                if (cached) {
                    return cached
                }
            }
            throw error
        }
    }

    return {
        get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
        post: <T>(endpoint: string, data: any) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
        patch: <T>(endpoint: string, data: any) => request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
        delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
    }
}
