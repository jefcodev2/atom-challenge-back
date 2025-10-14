import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { AuthMiddleware } from '../../../core/middlewares/auth.middleware';

const router = Router();
const taskController = new TaskController();

router.use(AuthMiddleware.verifyToken);

router.post('/', taskController.createTask);

router.get('/', taskController.getAllTasks);

router.get('/:id', taskController.getTaskById);

export default router;

