import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
    const tenant = await prisma.tenant.upsert({
        where: { document: '12345678000199' },
        update: {},
        create: {
            id: 'test-tenant-123',
            name: 'Banho e Tosa - Unidade Principal',
            document: '12345678000199',
        },
    });

    const camera = await prisma.camera.create({
        data: {
            id: 'cam-1',
            tenant_id: tenant.id,
            name: 'Banheira Principal',
            rtsp_url: 'rtsp://admin:1234@192.168.1.50:554/live',
        }
    });

    const customer = await prisma.customer.create({
        data: {
            tenant_id: tenant.id,
            name: 'João Silva',
            phone: '5511999999999',
        }
    });

    const pet = await prisma.pet.create({
        data: {
            customer_id: customer.id,
            name: 'Rex',
            breed: 'Golden Retriever',
        }
    });

    await prisma.appointment.create({
        data: {
            tenant_id: tenant.id,
            pet_id: pet.id,
            status: 'SCHEDULED',
            scheduled_at: new Date(),
        }
    });

    console.log('Seed completed!');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
