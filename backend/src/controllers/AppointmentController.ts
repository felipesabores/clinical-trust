import { Request, Response } from 'express';
import { PrismaClient, AppointmentStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { WebhookService } from '../services/WebhookService';

const prisma = new PrismaClient();

export class AppointmentController {

    // SEARCH Customers
    static async searchCustomers(req: Request, res: Response) {
        try {
            const { q, tenantId } = req.query;
            const customers = await prisma.customer.findMany({
                where: {
                    tenant_id: tenantId as string,
                    OR: [
                        { name: { contains: q as string, mode: 'insensitive' } },
                        { phone: { contains: q as string } }
                    ]
                },
                take: 10
            });
            res.json(customers);
        } catch (error) {
            res.status(500).json({ error: 'Search failed' });
        }
    }

    // SEARCH Pets
    static async searchPets(req: Request, res: Response) {
        try {
            const { q, customerId } = req.query;
            const pets = await prisma.pet.findMany({
                where: {
                    customer_id: customerId as string,
                    name: { contains: q as string, mode: 'insensitive' }
                },
                take: 10
            });
            res.json(pets);
        } catch (error) {
            res.status(500).json({ error: 'Search failed' });
        }
    }

    // CREATE Appointment (Quick)
    static async create(req: Request, res: Response) {
        try {
            const {
                tenant_id,
                customer_id,
                customer_name,
                customer_phone,
                pet_id,
                pet_name,
                pet_breed,
                scheduled_at,
                staff_id,
                duration_minutes
            } = req.body;

            console.log('Criando agendamento para tenant:', tenant_id);

            // SEGURANÇA: Garantir que o Tenant existe
            let tenantExists = await prisma.tenant.findUnique({ where: { id: tenant_id } });
            if (!tenantExists) {
                console.log('Criando tenant em tempo de execução:', tenant_id);
                try {
                    tenantExists = await prisma.tenant.create({
                        data: {
                            id: tenant_id,
                            name: 'Pet Shop / Estética Pet',
                            document: 'TEMP-' + uuidv4().substring(0, 8), // Garantir unicidade
                        }
                    });
                } catch (e) {
                    // Se falhar a criação (ex: race condition), tenta buscar novamente
                    tenantExists = await prisma.tenant.findUnique({ where: { id: tenant_id } });
                }
            }

            if (!tenantExists) throw new Error('Tenant could not be found or created');

            let finalCustomerId = customer_id;
            let finalPetId = pet_id;

            // 1. & 2. Create Customer and Pet if pet doesn't exist
            if (!finalPetId) {
                if (!finalCustomerId) {
                    const customer = await prisma.customer.create({
                        data: {
                            tenant_id,
                            name: customer_name,
                            phone: customer_phone
                        }
                    });
                    finalCustomerId = customer.id;
                }

                const pet = await prisma.pet.create({
                    data: {
                        customer_id: finalCustomerId,
                        name: pet_name,
                        breed: pet_breed
                    }
                });
                finalPetId = pet.id;
            }

            // 3. Create Appointment
            const dateToSchedule = scheduled_at ? new Date(scheduled_at) : new Date();
            let endTimeToSchedule: Date | null = null;
            if (duration_minutes) {
                endTimeToSchedule = new Date(dateToSchedule.getTime() + duration_minutes * 60000);
            }

            const appointment = await prisma.appointment.create({
                data: {
                    tenant_id,
                    pet_id: finalPetId,
                    status: 'SCHEDULED' as AppointmentStatus,
                    scheduled_at: dateToSchedule,
                    staff_id: staff_id || null,
                    end_time: endTimeToSchedule
                },
                include: {
                    pet: { include: { customer: true } },
                    staff: true
                }
            });

            console.log('Agendamento criado com sucesso:', appointment.id);
            res.status(201).json(appointment);
        } catch (error: any) {
            console.error('ERRO DETALHADO NO BACKEND:', error);
            res.status(500).json({
                error: 'Failed to create appointment',
                details: error.message
            });
        }
    }

    // GET /api/appointments/kanban
    static async getKanban(req: Request, res: Response) {
        try {
            const tenantId = req.query.tenantId as string;
            const dateStr = req.query.date as string;

            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            const queryDate = dateStr ? new Date(dateStr) : new Date();
            const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

            const appointments = await prisma.appointment.findMany({
                where: {
                    tenant_id: tenantId,
                    scheduled_at: {
                        gte: startOfDay,
                        lte: endOfDay
                    },
                    end_time: null
                },
                include: {
                    pet: { include: { customer: true } },
                    camera: true,
                    staff: true
                },
                orderBy: { scheduled_at: 'asc' }
            });

            // Grouping by status for Kanban
            const kanban: Record<string, any[]> = {
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

            const allowedStatuses = ['SCHEDULED','RECEPTION','BATHING','GROOMING','DRYING','READY','DONE'];
            if (!status || !allowedStatuses.includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }

            const currentAppointment = await prisma.appointment.findUnique({
                where: { id },
                include: { pet: { include: { customer: true } }, tenant: true }
            }) as any;

            if (!currentAppointment) return res.status(404).json({ error: 'Appointment not found' });

            const updateData: any = { status };

            // Automation: Generate Magic Link when starting procedures
            if (status === 'BATHING' || status === 'GROOMING') {
                try {
                    const token = uuidv4();
                    updateData.access_token = token;
                    updateData.token_expires_at = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
                    updateData.camera_id = camera_id || null;

                    const frontendUrl = process.env.FRONTEND_CLIENT_URL || 'http://localhost:3000';
                    const magicLink = `${frontendUrl}/live/${token}`;

                    // Validar dados antes de enviar webhook
                    if (currentAppointment?.pet?.customer?.phone && currentAppointment?.pet?.name && currentAppointment?.tenant?.name) {
                        await WebhookService.sendLiveLink({
                            petName: currentAppointment.pet.name,
                            customerPhone: currentAppointment.pet.customer.phone,
                            magicLink: magicLink,
                            tenantName: currentAppointment.tenant.name
                        });
                    } else {
                        console.warn('[AppointmentController] Dados incompletos para webhook:', {
                            hasPet: !!currentAppointment?.pet,
                            hasCustomer: !!currentAppointment?.pet?.customer,
                            hasPhone: !!currentAppointment?.pet?.customer?.phone,
                            hasTenant: !!currentAppointment?.tenant,
                            hasTenantName: !!currentAppointment?.tenant?.name
                        });
                    }
                } catch (webhookError) {
                    console.error('[AppointmentController] Erro ao processar webhook:', webhookError);
                    // Não interromper o fluxo principal se o webhook falhar
                }
            }

            // Cleanup / finalização
            if (status === 'DONE') {
                updateData.status = 'READY';
                updateData.end_time = new Date();
                updateData.access_token = null;
                updateData.camera_id = null;
                updateData.token_expires_at = null;
            } else if (status !== 'BATHING' && status !== 'GROOMING') {
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
            console.error('Failed to update status:', error);
            res.status(500).json({ error: 'Failed to update appointment status' });
        }
    }

    // GET /api/appointments
    static async getList(req: Request, res: Response) {
        try {
            const { tenantId, date } = req.query;
            if (!tenantId) return res.status(400).json({ error: 'Tenant ID is required' });

            let whereClause: any = { tenant_id: tenantId as string };

            // If a specific date is requested, filter by that day
            if (date) {
                const queryDate = new Date(date as string);
                const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
                const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

                whereClause.scheduled_at = {
                    gte: startOfDay,
                    lte: endOfDay
                };
            }

            const appointments = await prisma.appointment.findMany({
                where: whereClause,
                include: {
                    pet: { include: { customer: true } },
                    staff: true,
                    camera: true
                },
                orderBy: { scheduled_at: 'asc' }
            });

            res.json(appointments);
        } catch (error) {
            console.error('Failed to fetch agenda data:', error);
            res.status(500).json({ error: 'Failed to fetch appointments' });
        }
    }

    // PATCH /api/appointments/:id
    static async update(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const updateData = req.body;

            // Protect against overwriting important fields blindly if needed
            delete updateData.tenant_id;
            delete updateData.id;

            // Converter campos de data
            if (updateData.scheduled_at) {
                updateData.scheduled_at = new Date(updateData.scheduled_at);
            }
            if (updateData.end_time) {
                updateData.end_time = new Date(updateData.end_time);
            }

            // Transformar IDs de relacionamento para o formato Prisma
            const prismaData: any = { ...updateData };

            // Converter duration_minutes para end_time se fornecido
            if (updateData.duration_minutes && updateData.scheduled_at) {
                const startTime = new Date(updateData.scheduled_at);
                const endTime = new Date(startTime.getTime() + (updateData.duration_minutes * 60 * 1000));
                prismaData.end_time = endTime;
                delete prismaData.duration_minutes;
            }
            
            // Se pet_id foi fornecido, transformar para relação
            if (updateData.pet_id) {
                prismaData.pet = {
                    connect: { id: updateData.pet_id }
                };
                delete prismaData.pet_id;
            }
            
            // Se staff_id foi fornecido, transformar para relação
            if (updateData.staff_id) {
                prismaData.staff = {
                    connect: { id: updateData.staff_id }
                };
                delete prismaData.staff_id;
            }

            const updated = await prisma.appointment.update({
                where: { id },
                data: prismaData,
                include: { pet: { include: { customer: true } }, staff: true }
            });

            res.json(updated);
        } catch (error) {
            console.error('Failed to update appointment:', error);
            res.status(500).json({ error: 'Failed to update appointment' });
        }
    }

    // DELETE /api/appointments/:id
    static async delete(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            await prisma.appointment.delete({ where: { id } });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete appointment' });
        }
    }

    // GET /api/appointments/history - Buscar histórico de atendimentos concluídos
    static async getHistory(req: Request, res: Response) {
        try {
            const { tenantId, limit = 50 } = req.query;
            
            const appointments = await prisma.appointment.findMany({
                where: {
                    tenant_id: tenantId as string,
                    end_time: { not: null }
                },
                include: {
                    pet: { include: { customer: true } },
                    camera: true,
                    staff: true
                },
                orderBy: { end_time: 'desc' },
                take: parseInt(limit as string)
            });

            res.json(appointments);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch appointment history' });
        }
    }
}
