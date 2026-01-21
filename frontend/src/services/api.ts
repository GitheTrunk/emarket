import { supabase } from '../lib/supabase'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper to get JWT token from Supabase
const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
}

const apiCall = async (method: string, endpoint: string, body?: any) => {
    const token = await getAuthToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        console.warn('[API] No token available for', method, endpoint)
    }

    const options: RequestInit = {
        method,
        headers,
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    const url = `${API_BASE_URL}${endpoint}`
    const apiDebug = (import.meta.env.VITE_API_DEBUG || 'false').toString().toLowerCase() === 'true'
    if (apiDebug) console.log(`[API] ${method} ${url}`)
    
    const response = await fetch(url, options);

    if (!response.ok) {
        let errorMessage = `API request failed with status ${response.status}`
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage
        } catch (e) {
            // Response is not JSON
        }
        if (apiDebug) console.error(`[API] ${method} ${endpoint}:`, errorMessage)
        throw new Error(errorMessage);
    }

    return response.json();

}

export const api = {
    get: (endpoint: string) => apiCall('GET', endpoint),
    post: (endpoint: string, body: any) => apiCall('POST', endpoint, body),
    put: (endpoint: string, body: any) => apiCall('PUT', endpoint, body),
    delete: (endpoint: string) => apiCall('DELETE', endpoint)
}