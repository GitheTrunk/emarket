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
    }

    const options: RequestInit = {
        method,
        headers,
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
    }

    return response.json();

}

export const api = {
    get: (endpoint: string) => apiCall('GET', endpoint),
    post: (endpoint: string, body: any) => apiCall('POST', endpoint, body),
    put: (endpoint: string, body: any) => apiCall('PUT', endpoint, body),
    delete: (endpoint: string) => apiCall('DELETE', endpoint)
}