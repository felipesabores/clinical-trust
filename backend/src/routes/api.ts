import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import { LiveController } from '../controllers/LiveController';
import { CameraController } from '../controllers/CameraController';
import { CustomerController } from '../controllers/CustomerController';

const router = Router();

// Appointment / Kanban Routes
router.get('/appointments/kanban', AppointmentController.getKanban);
router.patch('/appointments/:id/status', AppointmentController.updateStatus);
router.post('/appointments', AppointmentController.create);
router.get('/customers/search', AppointmentController.searchCustomers);
router.get('/pets/search', AppointmentController.searchPets);

// Full Customer Management
router.get('/customers', CustomerController.list);
router.get('/customers/:id', CustomerController.getDetail);
router.post('/customers', CustomerController.create);
router.patch('/customers/:id', CustomerController.update);
router.delete('/customers/:id', CustomerController.delete);
router.post('/customers/:customer_id/pets', CustomerController.addPet);
router.patch('/pets/:petId', CustomerController.updatePet);
router.delete('/pets/:petId', CustomerController.deletePet);

// Public Live Routes
router.get('/live/:token', LiveController.getLiveSession);

// Camera Routes
router.get('/cameras', CameraController.list);

// Health Check
router.get('/health', (req, res) => res.json({ status: 'ok', service: 'Banho e Tosa Backend' }));

export default router;
