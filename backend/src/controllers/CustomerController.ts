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
            const { tenant_id, name, phone, avatar_url, pets } = req.body;

            if (!tenant_id || !name) {
                return res.status(400).json({ error: 'Tenant ID and Name are required' });
            }

            const customer = await prisma.customer.create({
                data: {
                    tenant_id,
                    name,
                    phone,
                    avatar_url,
                    pets: {
                        create: Array.isArray(pets) ? pets.map((p: any) => ({
                            name: p.name,
                            breed: p.breed,
                            weight: p.weight,
                            notes: p.notes,
                            type: p.type || 'DOG'
                        })) : []
                    }
                },
                include: { pets: true }
            });
            res.status(201).json(customer);
        } catch (error) {
            console.error('Customer creation error:', error);
            res.status(500).json({ error: 'Failed to create customer' });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { name, phone, avatar_url } = req.body;
            const customer = await prisma.customer.update({
                where: { id },
                data: { name, phone, avatar_url }
            });
            res.json(customer);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update customer' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = req.params.id as string;

            await prisma.$transaction(async (tx) => {
                // Delete all appointments associated with pets owned by this customer
                await tx.appointment.deleteMany({
                    where: {
                        pet: {
                            customer_id: id
                        }
                    }
                });

                // Delete all pets owned by this customer
                await tx.pet.deleteMany({
                    where: {
                        customer_id: id
                    }
                });

                // Finally, delete the customer
                await tx.customer.delete({
                    where: { id }
                });
            });

            res.json({ message: 'Customer deleted successfully along with all associated pets and appointments' });
        } catch (error) {
            console.error('Failed to delete customer cascade:', error);
            res.status(500).json({ error: 'Erro ao excluir o cliente. Tente novamente mais tarde.' });
        }
    }

    static async addPet(req: Request, res: Response) {
        try {
            const customer_id = req.params.customer_id as string;
            const { name, breed, type, avatar_url, notes } = req.body;

            const customer = await prisma.customer.findUnique({ where: { id: customer_id } });
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }

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
            console.error('Failed to add pet:', error);
            res.status(500).json({ error: 'Failed to add pet' });
        }
    }

    static async updatePet(req: Request, res: Response) {
        try {
            const petId = req.params.petId as string;
            const { name, breed, type, avatar_url, notes } = req.body;
            const pet = await prisma.pet.update({
                where: { id: petId },
                data: { name, breed, type, avatar_url, notes }
            });
            res.json(pet);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update pet' });
        }
    }

    static async deletePet(req: Request, res: Response) {
        try {
            const petId = req.params.petId as string;

            await prisma.$transaction(async (tx) => {
                // Delete all appointments associated with this pet
                await tx.appointment.deleteMany({
                    where: { pet_id: petId }
                });

                // Delete the pet
                await tx.pet.delete({
                    where: { id: petId }
                });
            });

            res.json({ message: 'Pet e seus agendamentos excluídos com sucesso' });
        } catch (error) {
            console.error('Failed to delete pet cascade:', error);
            res.status(500).json({ error: 'Erro ao excluir o pet. Tente novamente mais tarde.' });
        }
    }
}
