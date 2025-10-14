import { getFirestore, Firestore, FieldValue } from 'firebase-admin/firestore';
import { CreateTaskDto, TaskResponseDto } from '../dto/task.dto';

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
      return {
        id: taskDoc.id,
        title: taskData!.title,
        description: taskData!.description,
        status: taskData!.status,
        is_active: taskData!.is_active,
        created_at: taskData!.created_at,
        updated_at: taskData!.updated_at,
      };
    } catch (error) {
      this.handleFirestoreError(error);
      throw error;
    }
  }

  async getAllTasks(): Promise<TaskResponseDto[]> {
    try {
      const tasksSnapshot = await this.db.collection(this.collectionName).get();
      
      const tasks: TaskResponseDto[] = [];
      tasksSnapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          status: data.status,
          is_active: data.is_active,
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
      });

      return tasks;
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

