import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TenantController {
    static async getConfig(req: Request, res: Response) {
        const tenantId = process.env.TENANT_ID || process.env.NEXT_PUBLIC_TENANT_ID || 'test-tenant-123';

        try {
            console.log(`[WhiteLabel] Fetching config for tenant: ${tenantId}`);
            let tenant = await prisma.tenant.findUnique({
                where: { id: tenantId }
            });

            if (!tenant) {
                console.log(`[WhiteLabel] Tenant ${tenantId} not found, bootstrapping...`);
                tenant = await prisma.tenant.create({
                    data: {
                        id: tenantId,
                        name: 'Clinical Trust',
                        document: `DOC-${tenantId}`, // More unique than a static string
                        description: 'Pet Boutique',
                        primary_color: '#7c3aed'
                    }
                });
            }

            res.json(tenant);
        } catch (error: any) {
            console.error('[WhiteLabel] Error fetching tenant config:', error);
            res.status(500).json({ error: 'Erro ao carregar configurações', details: error.message });
        }
    }

    static async updateConfig(req: Request, res: Response) {
        const tenantId = process.env.TENANT_ID || process.env.NEXT_PUBLIC_TENANT_ID || 'test-tenant-123';
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
                    primary_color,
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
