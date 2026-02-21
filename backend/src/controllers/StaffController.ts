import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class StaffController {
    static async list(req: Request, res: Response) {
        try {
            const { tenantId } = req.query;
            if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

            const staff = await prisma.staff.findMany({
                where: { tenant_id: tenantId as string },
                orderBy: { name: 'asc' }
            });
            res.json(staff);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch staff' });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const data = req.body;
            const staff = await prisma.staff.create({
                data: {
                    tenant_id: data.tenant_id,
                    name: data.name,
                    role: data.role,
                    phone: data.phone,
                    email: data.email,
                    avatar_url: data.avatar_url,
                    commission: data.commission || 0
                }
            });
            res.status(201).json(staff);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create staff member' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;
            const staff = await prisma.staff.update({
                where: { id },
                data
            });
            res.json(staff);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update staff member' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await prisma.staff.delete({ where: { id } });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete staff member' });
        }
    }
}
