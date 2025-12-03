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
            
            // Améliorer les messages d'erreur pour le débogage
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                const errorDetails = {
                    url: fullUrl,
                    apiBase,
                    origin: window.location?.origin,
                    userAgent: navigator.userAgent,
                    isCapacitor: !!(window as any).Capacitor,
                    error: error.message,
                    timestamp: new Date().toISOString()
                }
                console.error('❌ Erreur réseau détaillée:', errorDetails)
                
                // Essayer de faire une requête de test pour voir l'erreur exacte
                fetch(fullUrl, { method: 'OPTIONS' })
                    .then(res => {
                        console.log('✅ OPTIONS request réussie:', res.status, res.headers)
                    })
                    .catch(err => {
                        console.error('❌ OPTIONS request échouée:', err)
                    })
                
                throw new Error(`Impossible de se connecter à l'API (${apiBase}). Vérifiez votre connexion réseau et la configuration CORS. Détails dans la console.`)
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
