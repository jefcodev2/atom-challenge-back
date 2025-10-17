import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from '../dto/task.dto';
import { TaskMapper } from '../mappers/task.mapper';

export class FirebaseTaskService {
  private static instance: FirebaseTaskService;
  private db: Firestore;
  private collectionName = 'tasks';

  private constructor() {
    // Obtener instancia de Firestore
    this.db = getFirestore();
  }

  public static getInstance(): FirebaseTaskService {
    if (!FirebaseTaskService.instance) {
      FirebaseTaskService.instance = new FirebaseTaskService();
    }
    return FirebaseTaskService.instance;
  }

  async createTask(taskData: CreateTaskDto): Promise<TaskResponseDto> {
    try {
      const now = new Date().toISOString();
      
      const taskRef = this.db.collection(this.collectionName).doc();
      
      const taskToSave = {
        title: taskData.title.trim(),
        description: taskData.description.trim(),
        status: taskData.status.toLowerCase(),
        is_active: taskData.is_active,
        user_id: taskData.user_id,
        created_at: now,
        updated_at: now,
      };

      await taskRef.set(taskToSave);

      return {
        id: taskRef.id,
        ...taskToSave,
      };
    } catch (error) {
      this.handleFirestoreError(error);
      throw error;
    }
  }

  async getTaskById(taskId: string): Promise<TaskResponseDto | null> {
    try {
      const taskDoc = await this.db.collection(this.collectionName).doc(taskId).get();
      
      if (!taskDoc.exists) {
        return null;
      }

      const taskData = taskDoc.data();
      return TaskMapper.toDto(taskDoc.id, taskData!);
    } catch (error) {
      this.handleFirestoreError(error);
      throw error;
    }
  }

  async getAllTasks(userId?: string): Promise<TaskResponseDto[]> {
    try {
      let query = this.db.collection(this.collectionName);
      
      // Si se proporciona userId, filtramos por ese usuario
      if (userId) {
        const tasksSnapshot = await query.where('user_id', '==', userId).get();
        
        const tasks: TaskResponseDto[] = [];
        tasksSnapshot.forEach((doc) => {
          tasks.push(TaskMapper.toDto(doc.id, doc.data()));
        });
        
        return tasks;
      }
      
      // Si no hay userId, devolvemos todas las tareas
      const tasksSnapshot = await query.get();
      
      const tasks: TaskResponseDto[] = [];
      tasksSnapshot.forEach((doc) => {
        tasks.push(TaskMapper.toDto(doc.id, doc.data()));
      });

      return tasks;
    } catch (error) {
      this.handleFirestoreError(error);
      throw error;
    }
  }

  async updateTask(taskId: string, taskData: UpdateTaskDto): Promise<TaskResponseDto | null> {
    try {
      const taskRef = this.db.collection(this.collectionName).doc(taskId);
      const taskDoc = await taskRef.get();

      if (!taskDoc.exists) {
        return null;
      }

      const dataToUpdate: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (taskData.title !== undefined) {
        dataToUpdate.title = taskData.title.trim();
      }

      if (taskData.description !== undefined) {
        dataToUpdate.description = taskData.description.trim();
      }

      await taskRef.update(dataToUpdate);

      const updatedTaskDoc = await taskRef.get();
      return TaskMapper.toDto(updatedTaskDoc.id, updatedTaskDoc.data()!);
    } catch (error) {
      this.handleFirestoreError(error);
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<TaskResponseDto | null> {
    try {
      const taskRef = this.db.collection(this.collectionName).doc(taskId);
      const taskDoc = await taskRef.get();

      if (!taskDoc.exists) {
        return null;
      }

      await taskRef.update({
        is_active: false,
        updated_at: new Date().toISOString(),
      });

      const updatedTaskDoc = await taskRef.get();
      return TaskMapper.toDto(updatedTaskDoc.id, updatedTaskDoc.data()!);
    } catch (error) {
      this.handleFirestoreError(error);
      throw error;
    }
  }

  async completeTask(taskId: string): Promise<TaskResponseDto | null> {
    try {
      const taskRef = this.db.collection(this.collectionName).doc(taskId);
      const taskDoc = await taskRef.get();

      if (!taskDoc.exists) {
        return null;
      }

      await taskRef.update({
        status: 'completed',
        updated_at: new Date().toISOString(),
      });

      const updatedTaskDoc = await taskRef.get();
      return TaskMapper.toDto(updatedTaskDoc.id, updatedTaskDoc.data()!);
    } catch (error) {
      this.handleFirestoreError(error);
      throw error;
    }
  }

  private handleFirestoreError(error: unknown): never {
    const firestoreError = error as { code?: string; message?: string };
    
    const errorMessages: Record<string, string> = {
      'permission-denied': 'Permiso denegado para acceder a la base de datos',
      'not-found': 'El documento no fue encontrado',
      'already-exists': 'El documento ya existe',
      'failed-precondition': 'Precondición fallida',
      'aborted': 'La operación fue abortada',
      'unavailable': 'El servicio no está disponible',
      'unauthenticated': 'No autenticado',
    };

    const message =
      errorMessages[firestoreError.code || ''] ||
      firestoreError.message ||
      'Error al procesar la solicitud en Firestore';

    throw new Error(message);
  }
}

