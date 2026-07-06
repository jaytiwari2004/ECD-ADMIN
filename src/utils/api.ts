// export const API_BASE_URL = 'https://ecd-bk-dep.onrender.com/api/v1'; // Local backend
export const API_BASE_URL = 'http://localhost:5000/api/v1'; // Local backend

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
        if (response.status === 401 || data.message === 'Token expired') {
            localStorage.removeItem('token');
            localStorage.removeItem('adminUser');
            window.location.href = '/login';
        }
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
