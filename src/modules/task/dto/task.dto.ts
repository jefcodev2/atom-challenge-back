export interface CreateTaskDto {
  title: string;
  description: string;
  status: string;
  is_active: boolean;
  user_id?: string;
}

export interface TaskResponseDto {
  id: string;
  title: string;
  description: string;
  status: string;
  is_active: boolean;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

