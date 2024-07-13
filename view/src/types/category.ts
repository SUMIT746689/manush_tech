
export interface Category {
  id: number;
  name: string;
  // created_at: string;
  // updated_at: string;
}
export interface CreateCategory {
  name: string;
}

export interface UpdateCategory {
  name?: string;
}