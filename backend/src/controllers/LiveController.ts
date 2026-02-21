import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LiveController {

    // GET /api/live/:token
    static async getLiveSession(req: Request, res: Response) {
        try {
            const token = req.params.token as string;

            const appointment = await prisma.appointment.findUnique({
                where: { access_token: token },
                include: {
                    pet: { select: { name: true, breed: true, notes: true } },
                    camera: true,
                    tenant: { select: { name: true, logo_url: true, primary_color: true } }
                }
            }) as any;

            // Validation: Token exists and not expired
            if (!appointment || (appointment.token_expires_at && appointment.token_expires_at < new Date())) {
                return res.status(403).json({ error: 'Procedimento finalizado ou link inválido' });
            }

            // Security: Mask RTSP URL. We return a conversion URL (HLS/WebRTC provided by MediaMTX)
            // Example: http://mediamtx:8888/stream_id/index.m3u8
            const mediaServerUrl = process.env.MEDIA_SERVER_BASE_URL || 'http://localhost:8888';
            const streamUrl = `${mediaServerUrl}/${appointment.camera?.id}/index.m3u8`;

            res.json({
                pet: appointment.pet,
                status: appointment.status,
                streamUrl,
                tenant: appointment.tenant
            });

        } catch (error) {
            res.status(500).json({ error: 'Erro ao validar sessão ao vivo' });
        }
    }
}
