import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';
import { LiveController } from '../controllers/LiveController';
import { CameraController } from '../controllers/CameraController';
import { CustomerController } from '../controllers/CustomerController';
import { TenantController } from '../controllers/TenantController';
import { StaffController } from '../controllers/StaffController';
import { TransactionController } from '../controllers/TransactionController';
import { ProductController } from '../controllers/ProductController';
import { UploadController } from '../controllers/UploadController';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Config / White Label
router.get('/config', TenantController.getConfig);
router.patch('/config', TenantController.updateConfig);

// Appointment / Kanban Routes
router.get('/appointments/kanban', AppointmentController.getKanban);
router.patch('/appointments/:id/status', AppointmentController.updateStatus);
router.post('/appointments', AppointmentController.create);
router.get('/appointments', AppointmentController.getList);
router.patch('/appointments/:id', AppointmentController.update);
router.delete('/appointments/:id', AppointmentController.delete);
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

// Staff / Team Routes
router.get('/staff', StaffController.list);
router.post('/staff', StaffController.create);
router.patch('/staff/:id', StaffController.update);
router.delete('/staff/:id', StaffController.delete);

// Financial / Transaction Routes
router.get('/transactions', TransactionController.list);
router.get('/transactions/stats', TransactionController.getStats);
router.post('/transactions', TransactionController.create);
router.delete('/transactions/:id', TransactionController.delete);

// Products
router.get('/products', ProductController.list);
router.post('/products', ProductController.create);
router.patch('/products/:id', ProductController.update);
router.delete('/products/:id', ProductController.delete);

// Public Live Routes
router.get('/live/:token', LiveController.getLiveSession);

// Camera Routes
router.get('/cameras', CameraController.list);
router.post('/cameras', CameraController.create);
router.patch('/cameras/:id', CameraController.update);
router.delete('/cameras/:id', CameraController.delete);

// Uploads
router.post('/upload/avatar', upload.single('file'), UploadController.uploadAvatar);

// Health Check
router.get('/health', (req, res) => res.json({ status: 'ok', service: 'Banho e Tosa Backend' }));

export default router;
