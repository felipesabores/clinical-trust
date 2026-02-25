import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CameraController {
    static async list(req: Request, res: Response) {
        try {
            const cameras = await prisma.camera.findMany({
                where: {
                    tenant_id: req.tenantId
                },
                orderBy: { name: 'asc' }
            });
            res.json(cameras);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch cameras' });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { name, rtsp_url } = req.body;
            if (!name || !rtsp_url) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const camera = await prisma.camera.create({
                data: { tenant_id: req.tenantId, name, rtsp_url }
            });
            res.status(201).json(camera);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create camera' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, rtsp_url, is_active } = req.body;
            const camera = await prisma.camera.update({
                where: { id: String(id) },
                data: { name, rtsp_url, is_active }
            });
            res.json(camera);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update camera' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await prisma.camera.delete({ where: { id: String(id) } });
            res.json({ message: 'Camera deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete camera' });
        }
    }
}
