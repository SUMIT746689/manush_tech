
export interface Brand {
  id: number;
  title: string;
  // created_at: string;
  // updated_at: string;
}
export interface CreateBrand {
  title: string;
}

export interface UpdateBrand {
  title?: string;
}