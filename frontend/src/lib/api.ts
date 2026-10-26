const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  if (!API_URL) {
    console.error('NEXT_PUBLIC_API_URL is not defined');
  } else if (API_URL.startsWith('http://')) {
    console.error('API_URL must use HTTPS in production');
  }
}

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const baseUrl = API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '');
  
  if (!baseUrl) {
    throw new Error('API URL not configured');
  }
  
  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!res.ok) {
    throw new Error('API request failed');
  }
  
  return res.json();
}

export { API_URL as default };
export { API_URL };
