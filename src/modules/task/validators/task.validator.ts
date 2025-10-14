import { CreateTaskDto } from '../dto/task.dto';

export class TaskValidator {
  static validateCreateTask(data: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      errors.push('Los datos de la tarea son requeridos');
      return { valid: false, errors };
    }

    const taskData = data as Partial<CreateTaskDto>;

    if (!taskData.title) {
      errors.push('El título es requerido');
    } else if (taskData.title.trim().length === 0) {
      errors.push('El título no puede estar vacío');
    } 

    if (!taskData.description) {
      errors.push('La descripción es requerida');
    } else if (taskData.description.trim().length === 0) {
      errors.push('La descripción no puede estar vacía');
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

