import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TransactionController {
    static async list(req: Request, res: Response) {
        try {
            const { tenantId, type, category } = req.query;
            if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

            const where: any = { tenant_id: tenantId as string };
            if (type) where.type = type;
            if (category) where.category = category;

            const transactions = await prisma.transaction.findMany({
                where,
                orderBy: { date: 'desc' }
            });
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch transactions' });
        }
    }

    static async getStats(req: Request, res: Response) {
        try {
            const { tenantId } = req.query;
            if (!tenantId) return res.status(400).json({ error: 'Tenant ID required' });

            const transactions = await prisma.transaction.findMany({
                where: { tenant_id: tenantId as string }
            });

            const income = transactions
                .filter(t => t.type === 'INCOME')
                .reduce((acc: number, t: any) => acc + t.amount, 0);

            const expenses = transactions
                .filter(t => t.type === 'EXPENSE')
                .reduce((acc: number, t: any) => acc + t.amount, 0);

            res.json({
                total_income: income,
                total_expenses: expenses,
                balance: income - expenses
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch financial stats' });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const data = req.body;
            const transaction = await prisma.transaction.create({
                data: {
                    tenant_id: data.tenant_id,
                    type: data.type,
                    category: data.category,
                    description: data.description,
                    amount: data.amount,
                    date: data.date ? new Date(data.date) : new Date()
                }
            });
            res.status(201).json(transaction);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create transaction' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await prisma.transaction.delete({ where: { id: id as string } });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete transaction' });
        }
    }
}
