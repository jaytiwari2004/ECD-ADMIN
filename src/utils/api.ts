export const API_BASE_URL = 'http://localhost:5000/api/v1'; // Assuming v1 based on typical setup or just /api. I will check standard path later. Let's use standard relative or configure it. Wait, the routes in `app.ts` usually mount at `/api/v1`. Let me check `restaurant.controller.ts` where it says `RESTUARANT: POST /api/v1/restaurants/login`. So it's `/api/v1`.

export const getAuthToken = () => {
    return localStorage.getItem('token') || '';
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
        'Authorization': `Bearer ${getAuthToken()}`,
    };

    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
};

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const data = await apiFetch('/upload', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type, let browser set it with boundary
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    });

    return data.url;
};
