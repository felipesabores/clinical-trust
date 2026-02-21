export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const config = {
    apiBaseUrl: API,
    tenantHeader: 'x-tenant-id',
};
