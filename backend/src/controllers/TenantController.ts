import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TenantController {
    static async getConfig(req: Request, res: Response) {
        const tenantId = process.env.TENANT_ID || 'test-tenant-123';

        try {
            let tenant = await prisma.tenant.findUnique({
                where: { id: tenantId }
            });

            // Bootstrap if dev/test or first time in prod
            if (!tenant) {
                console.log(`[WhiteLabel] Tenant ${tenantId} not found, creating default...`);
                tenant = await prisma.tenant.create({
                    data: {
                        id: tenantId,
                        name: 'Clinical Trust',
                        document: '00.000.000/0001-00', // Default initial doc
                        description: 'Pet Boutique',
                        primary_color: '#7c3aed'
                    }
                });
            }

            res.json(tenant);
        } catch (error) {
            console.error('Error fetching tenant config:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateConfig(req: Request, res: Response) {
        const tenantId = process.env.TENANT_ID || 'test-tenant-123';
        const { name, logo_url, description, primary_color, whatsapp } = req.body;

        try {
            // Use upsert to be safe, though update should work if record exists
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
                    document: '00.000.000/0001-00',
                    logo_url,
                    description,
                    primary_color,
                    whatsapp
                }
            });

            console.log(`[WhiteLabel] Configuration updated for tenant ${tenantId}`);
            res.json(tenant);
        } catch (error: any) {
            console.error('Error updating tenant config:', error.message);
            res.status(500).json({
                error: 'Erro interno ao salvar configurações',
                details: error.message
            });
        }
    }
}
