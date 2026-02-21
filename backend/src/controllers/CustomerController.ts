import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomerController {
    static async list(req: Request, res: Response) {
        try {
            const tenantId = req.query.tenantId as string;
            const q = req.query.q as string;
            if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

            const customers = await prisma.customer.findMany({
                where: {
                    tenant_id: tenantId,
                    OR: q ? [
                        { name: { contains: q, mode: 'insensitive' } },
                        { phone: { contains: q } }
                    ] : undefined
                },
                include: {
                    pets: true,
                    _count: {
                        select: { pets: true }
                    }
                },
                orderBy: { name: 'asc' }
            });
            res.json(customers);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch customers' });
        }
    }

    static async getDetail(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const customer = await prisma.customer.findUnique({
                where: { id },
                include: {
                    pets: {
                        include: {
                            appointments: {
                                take: 1,
                                orderBy: { scheduled_at: 'desc' }
                            }
                        }
                    }
                }
            });
            if (!customer) return res.status(404).json({ error: 'Customer not found' });
            res.json(customer);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch customer details' });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { tenant_id, name, phone, avatar_url } = req.body;
            const customer = await prisma.customer.create({
                data: {
                    tenant_id,
                    name,
                    phone,
                    avatar_url
                }
            });
            res.status(201).json(customer);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create customer' });
        }
    }

    static async addPet(req: Request, res: Response) {
        try {
            const customer_id = req.params.customer_id as string;
            const { name, breed, type, avatar_url, notes } = req.body;
            const pet = await prisma.pet.create({
                data: {
                    customer_id,
                    name,
                    type: type || 'DOG',
                    breed,
                    avatar_url,
                    notes
                }
            });
            res.status(201).json(pet);
        } catch (error) {
            res.status(500).json({ error: 'Failed to add pet' });
        }
    }
}
