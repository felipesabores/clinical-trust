import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import { LiveController } from '../controllers/LiveController';
import { CameraController } from '../controllers/CameraController';

const router = Router();

// Kanban Routes
router.get('/appointments/kanban', AppointmentController.getKanban);
router.patch('/appointments/:id/status', AppointmentController.updateStatus);

// Public Live Routes
router.get('/live/:token', LiveController.getLiveSession);

// Camera Routes
router.get('/cameras', CameraController.list);

// Health Check
router.get('/health', (req, res) => res.json({ status: 'ok', service: 'Banho e Tosa Backend' }));

export default router;
