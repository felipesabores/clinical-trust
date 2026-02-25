import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TenantController {
    static async getConfig(req: Request, res: Response) {
        // On protected routes, tenantId comes from middleware.
        // On the public /config bootstrap route, fall back to env var or first tenant in DB.
        const tenantId = req.tenantId
            || process.env.TENANT_ID
            || process.env.NEXT_PUBLIC_TENANT_ID;

        try {
            let tenant = null;

            if (tenantId) {
                console.log(`[WhiteLabel] Fetching config for tenant: ${tenantId}`);
                tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
            }

            // Public bootstrap: return the first tenant if no specific one found
            if (!tenant) {
                console.log(`[WhiteLabel] No tenantId, fetching first available tenant...`);
                tenant = await prisma.tenant.findFirst({ orderBy: { created_at: 'asc' } });
            }

            if (!tenant) {
                return res.status(404).json({ error: 'No tenant configured' });
            }

            res.json(tenant);
        } catch (error: any) {
            console.error('[WhiteLabel] Error fetching tenant config:', error);
            res.status(500).json({ error: 'Erro ao carregar configurações', details: error.message });
        }
    }

    static async updateConfig(req: Request, res: Response) {
        const tenantId = req.tenantId;
        const { name, logo_url, description, primary_color, whatsapp } = req.body;

        try {
            console.log(`[WhiteLabel] Updating config for ${tenantId}:`, { name, primary_color });

            const tenant = await prisma.tenant.upsert({
                where: { id: tenantId },
                update: {
                    name,
                    logo_url,
                    description,
                    primary_color,
                    whatsapp
                },
                create: {
                    id: tenantId,
                    name: name || 'Clinical Trust',
                    document: `DOC-${tenantId}`,
                    logo_url,
                    description,
                    primary_color: primary_color || '#3b82f6',
                    whatsapp
                }
            });

            res.json(tenant);
        } catch (error: any) {
            console.error('[WhiteLabel] Error updating tenant:', error);
            res.status(500).json({
                error: 'Falha ao salvar configurações no bando de dados',
                details: error.message,
                code: error.code // Prisma error code
            });
        }
    }
}
