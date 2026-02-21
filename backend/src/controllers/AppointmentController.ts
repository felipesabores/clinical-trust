import { Request, Response } from 'express';
import { PrismaClient, AppointmentStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { WebhookService } from '../services/WebhookService';

const prisma = new PrismaClient();

export class AppointmentController {

    // GET /api/appointments/kanban
    static async getKanban(req: Request, res: Response) {
        try {
            const tenantId = req.query.tenantId as string;
            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            const appointments = await prisma.appointment.findMany({
                where: { tenant_id: tenantId },
                include: {
                    pet: { include: { customer: true } },
                    camera: true
                },
                orderBy: { scheduled_at: 'asc' }
            });

            // Grouping by status for Kanban
            const kanban: Record<AppointmentStatus, any[]> = {
                SCHEDULED: [],
                RECEPTION: [],
                BATHING: [],
                GROOMING: [],
                DRYING: [],
                READY: []
            };

            appointments.forEach(app => {
                kanban[app.status].push(app);
            });

            res.json(kanban);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch kanban data' });
        }
    }

    // PATCH /api/appointments/:id/status
    static async updateStatus(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { status, camera_id } = req.body;

            const currentAppointment = await prisma.appointment.findUnique({
                where: { id },
                include: { pet: { include: { customer: true } }, tenant: true }
            }) as any;

            if (!currentAppointment) return res.status(404).json({ error: 'Appointment not found' });

            const updateData: any = { status };
            if (camera_id) updateData.camera_id = camera_id;

            // Automation: Generate Magic Link when starting procedures
            if (status === 'BATHING' || status === 'GROOMING') {
                const token = uuidv4();
                updateData.access_token = token;
                updateData.token_expires_at = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

                // Generate full magic link (URL should come from config/env)
                const frontendUrl = process.env.FRONTEND_CLIENT_URL || 'http://localhost:3000';
                const magicLink = `${frontendUrl}/live/${token}`;

                // Trigger Webhook
                await WebhookService.sendLiveLink({
                    petName: currentAppointment.pet.name,
                    customerPhone: currentAppointment.pet.customer.phone,
                    magicLink: magicLink,
                    tenantName: currentAppointment.tenant.name
                });
            }

            // Cleanup: Revoke token when finished
            if (status === 'READY' || status === 'RECEPTION' || status === 'SCHEDULED') {
                updateData.access_token = null;
                updateData.camera_id = null;
                updateData.token_expires_at = null;
            }

            const updated = await prisma.appointment.update({
                where: { id },
                data: updateData,
                include: { pet: true, camera: true }
            });

            res.json(updated);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update appointment' });
        }
    }
}
