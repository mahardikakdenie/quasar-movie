export interface MediaParams {
  media: File;
}

export interface MediaResponse {
  message: string;
  data: {
    data: string; // Karena data 'data' adalah string JSON, perlu di-parse
    updated_at: string;
    created_at: string;
    id: number;
  };
}
