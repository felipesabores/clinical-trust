// Express Request type augmentation — adds tenantId to req object
import 'express';

declare global {
    namespace Express {
        interface Request {
            tenantId: string;
        }
    }
}
