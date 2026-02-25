import axios from 'axios';
import { API } from '@/config';

/**
 * Axios instance centralizado para todas as chamadas à API protegida.
 * O header x-tenant-id é injetado automaticamente via setTenantId().
 */
export const apiClient = axios.create({
    baseURL: API,
});

/**
 * Configura o tenant ID no interceptor global.
 * Chamado assim que o TenantContext carrega a config.
 */
export function setTenantId(tenantId: string) {
    apiClient.defaults.headers.common['x-tenant-id'] = tenantId;
}
