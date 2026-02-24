-- Ensure DONE status exists in AppointmentStatus enum (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON e.enumtypid = t.oid
        WHERE t.typname = 'AppointmentStatus'
          AND e.enumlabel = 'DONE'
    ) THEN
        ALTER TYPE "AppointmentStatus" ADD VALUE 'DONE';
    END IF;
END
$$;
