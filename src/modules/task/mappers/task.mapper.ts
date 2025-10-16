import { TaskResponseDto } from '../dto/task.dto';

export class TaskMapper {
  static toDto(id: string, data: FirebaseFirestore.DocumentData): TaskResponseDto {
    return {
      id,
      title: data.title,
      description: data.description,
      status: data.status,
      is_active: data.is_active,
      user_id: data.user_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }
}

