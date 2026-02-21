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

            // Bootstrap if dev/test
            if (!tenant && tenantId === 'test-tenant-123') {
                tenant = await prisma.tenant.create({
                    data: {
                        id: 'test-tenant-123',
                        name: 'Clinical Trust',
                        document: '00.000.000/0001-00',
                        description: 'Pet Boutique',
                        primary_color: '#7c3aed'
                    }
                });
            }

            if (!tenant) {
                return res.status(404).json({ error: 'Tenant not found' });
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
            const tenant = await prisma.tenant.update({
                where: { id: tenantId },
                data: {
                    name,
                    logo_url,
                    description,
                    primary_color,
                    whatsapp
                }
            });

            res.json(tenant);
        } catch (error) {
            console.error('Error updating tenant config:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
