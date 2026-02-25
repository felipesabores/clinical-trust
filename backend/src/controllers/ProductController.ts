import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductController {
    static async list(req: Request, res: Response) {
        try {
            const products = await prisma.product.findMany({
                where: { tenant_id: req.tenantId },
                orderBy: { name: 'asc' }
            });
            res.json(products);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao buscar produtos' });
        }
    }

    static async create(req: Request, res: Response) {
        const { tenant_id, name, category, stock, min_stock, unit, price, sku } = req.body;
        try {
            const product = await prisma.product.create({
                data: {
                    tenant_id: req.tenantId,
                    name,
                    category,
                    stock: Number(stock),
                    min_stock: Number(min_stock),
                    unit,
                    price: Number(price),
                    sku,
                }
            });
            res.json(product);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao criar produto' });
        }
    }

    static async update(req: Request, res: Response) {
        const { id } = req.params;
        const data = req.body;
        try {
            const product = await prisma.product.update({
                where: { id: id as string },
                data: {
                    ...data,
                    stock: data.stock !== undefined ? Number(data.stock) : undefined,
                    min_stock: data.min_stock !== undefined ? Number(data.min_stock) : undefined,
                    price: data.price !== undefined ? Number(data.price) : undefined,
                }
            });
            res.json(product);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao atualizar produto' });
        }
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await prisma.product.delete({ where: { id: id as string } });
            res.json({ success: true });
        } catch (e) {
            res.status(500).json({ error: 'Erro ao excluir produto' });
        }
    }
}
