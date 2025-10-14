export interface CreateTaskDto {
  title: string;
  description: string;
  status: string;
  is_active: boolean;
}

export interface TaskResponseDto {
  id: string;
  title: string;
  description: string;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

