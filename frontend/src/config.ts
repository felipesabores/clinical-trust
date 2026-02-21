const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API = process.env.NEXT_PUBLIC_API_URL ||
    (isLocalhost ? 'http://localhost:3001' : 'https://core.carvalhodev.com.br');

export const config = {
    apiBaseUrl: API,
    tenantHeader: 'x-tenant-id',
};
