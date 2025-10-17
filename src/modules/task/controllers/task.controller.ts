import { Request, Response } from 'express';
import { FirebaseTaskService } from '../services/firebase-task.service';
import { TaskValidator } from '../validators/task.validator';
import { HttpResponse } from '../../../core/helpers/http-response.helper';

export class TaskController {
  private firebaseTaskService: FirebaseTaskService;

  constructor() {
    this.firebaseTaskService = FirebaseTaskService.getInstance();
  }

  createTask = async (req: Request, res: Response): Promise<Response> => {
    try {
      const authenticatedUser = (req as any).authenticatedUser;
      const validation = TaskValidator.validateCreateTask(req.body);
      
      if (!validation.valid) {
        return HttpResponse.badRequest(res, validation.errors.join(', '));
      }

      const taskData = {
        title: req.body.title,
        description: req.body.description,
        status: "pending",
        is_active: true,
        user_id: authenticatedUser?.uid,
      };

      const createdTask = await this.firebaseTaskService.createTask(taskData);

      return HttpResponse.created(
        res,
        createdTask,
        'Tarea creada exitosamente'
      );
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      
      const errorDetail = error instanceof Error 
        ? `${error.name}: ${error.message}` 
        : String(error);

      return HttpResponse.serverError(
        res,
        'Error al procesar la creación de la tarea',
        errorDetail
      );
    }
  };

  getAllTasks = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId } = req.query;
      const tasks = await this.firebaseTaskService.getAllTasks(userId as string);

      return HttpResponse.success(
        res,
        tasks as unknown as Record<string, unknown>[],
        'Tareas obtenidas exitosamente'
      );
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      
      const errorDetail = error instanceof Error 
        ? `${error.name}: ${error.message}` 
        : String(error);

      return HttpResponse.serverError(
        res,
        'Error al obtener las tareas',
        errorDetail
      );
    }
  };

  getTaskById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      if (!id) {
        return HttpResponse.badRequest(res, 'El ID de la tarea es requerido');
      }

      const task = await this.firebaseTaskService.getTaskById(id);

      if (!task) {
        return HttpResponse.badRequest(res, 'Tarea no encontrada');
      }

      return HttpResponse.success(
        res,
        task as unknown as Record<string, unknown>,
        'Tarea obtenida exitosamente'
      );
    } catch (error) {
      console.error('Error al obtener la tarea:', error);
      
      const errorDetail = error instanceof Error 
        ? `${error.name}: ${error.message}` 
        : String(error);

      return HttpResponse.serverError(
        res,
        'Error al obtener la tarea',
        errorDetail
      );
    }
  };

  updateTask = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      if (!id) {
        return HttpResponse.badRequest(res, 'El ID de la tarea es requerido');
      }

      const validation = TaskValidator.validateUpdateTask(req.body);
      
      if (!validation.valid) {
        return HttpResponse.badRequest(res, validation.errors.join(', '));
      }

      const updatedTask = await this.firebaseTaskService.updateTask(id, req.body);

      if (!updatedTask) {
        return HttpResponse.badRequest(res, 'Tarea no encontrada');
      }

      return HttpResponse.success(
        res,
        updatedTask as unknown as Record<string, unknown>,
        'Tarea actualizada exitosamente'
      );
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      
      const errorDetail = error instanceof Error 
        ? `${error.name}: ${error.message}` 
        : String(error);

      return HttpResponse.serverError(
        res,
        'Error al actualizar la tarea',
        errorDetail
      );
    }
  };

  deleteTask = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      if (!id) {
        return HttpResponse.badRequest(res, 'El ID de la tarea es requerido');
      }

      const deletedTask = await this.firebaseTaskService.deleteTask(id);

      if (!deletedTask) {
        return HttpResponse.badRequest(res, 'Tarea no encontrada');
      }

      return HttpResponse.success(
        res,
        deletedTask as unknown as Record<string, unknown>,
        'Tarea eliminada exitosamente'
      );
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      
      const errorDetail = error instanceof Error 
        ? `${error.name}: ${error.message}` 
        : String(error);

      return HttpResponse.serverError(
        res,
        'Error al eliminar la tarea',
        errorDetail
      );
    }
  };

  completeTask = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;

      if (!id) {
        return HttpResponse.badRequest(res, 'El ID de la tarea es requerido');
      }

      const completedTask = await this.firebaseTaskService.completeTask(id);

      if (!completedTask) {
        return HttpResponse.badRequest(res, 'Tarea no encontrada');
      }

      return HttpResponse.success(
        res,
        completedTask as unknown as Record<string, unknown>,
        'Tarea completada exitosamente'
      );
    } catch (error) {
      console.error('Error al completar la tarea:', error);
      
      const errorDetail = error instanceof Error 
        ? `${error.name}: ${error.message}` 
        : String(error);

      return HttpResponse.serverError(
        res,
        'Error al completar la tarea',
        errorDetail
      );
    }
  };
}

