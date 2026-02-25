import { Request, Response, NextFunction } from 'express';

/**
 * Tenant Middleware
 * Extracts tenant identification from:
 *   1. Header: x-tenant-id (priority)
 *   2. Query param: tenantId (fallback)
 *
 * Injects req.tenantId for use in all controllers.
 * Returns 401 if no tenant identification is found.
 */
export function tenantMiddleware(req: Request, res: Response, next: NextFunction): void {
    const tenantId =
        (req.headers['x-tenant-id'] as string) ||
        (req.query.tenantId as string);

    if (!tenantId) {
        res.status(401).json({ error: 'Missing tenant identification. Provide x-tenant-id header or tenantId query param.' });
        return;
    }

    req.tenantId = tenantId;
    next();
}
