/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN IF NOT EXISTS "end_time" TIMESTAMP(3);
ALTER TABLE "Appointment" ADD COLUMN IF NOT EXISTS "staff_id" TEXT;

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "description" TEXT DEFAULT 'Pet Boutique';
ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "logo_url" TEXT;
ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "primary_color" TEXT DEFAULT '#7c3aed';
ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "whatsapp" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Staff" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "avatar_url" TEXT,
    "commission" DOUBLE PRECISION DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Transaction" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "stock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "min_stock" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "sku" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Product_tenant_id_idx" ON "Product"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Tenant_slug_key" ON "Tenant"("slug");

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Appointment_staff_id_fkey') THEN
        ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Staff_tenant_id_fkey') THEN
        ALTER TABLE "Staff" ADD CONSTRAINT "Staff_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Transaction_tenant_id_fkey') THEN
        ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Product_tenant_id_fkey') THEN
        ALTER TABLE "Product" ADD CONSTRAINT "Product_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
