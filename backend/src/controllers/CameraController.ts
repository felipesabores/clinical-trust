import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CameraController {
    static async list(req: Request, res: Response) {
        try {
            const { tenantId } = req.query;
            const cameras = await prisma.camera.findMany({
                where: {
                    tenant_id: tenantId ? String(tenantId) : undefined,
                    is_active: true
                }
            });
            res.json(cameras);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch cameras' });
        }
    }
}
