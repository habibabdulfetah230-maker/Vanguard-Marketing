import { apiFetch } from "./api";

export interface MediaSettings {
  enable_media: boolean;
  updated_at: string;
}

export interface MediaItem {
  _id: string;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  media_type: 'image' | 'video';
  assigned_pages: string[];
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const fetchMediaSettings = async (): Promise<MediaSettings> => {
  return apiFetch<MediaSettings>("/media/settings");
};

export const updateMediaSettings = async (enable_media: boolean): Promise<MediaSettings> => {
  return apiFetch<MediaSettings>("/media/settings", {
    method: "PUT",
    body: JSON.stringify({ enable_media }),
  });
};

export const fetchMediaItems = async (): Promise<MediaItem[]> => {
  return apiFetch<MediaItem[]>("/media/items");
};

export const uploadMedia = async (file: File, assigned_pages: string[]): Promise<MediaItem> => {
  const formData = new FormData();
  formData.append("file", file);
  assigned_pages.forEach(page => formData.append("assigned_pages", page));

  return apiFetch<MediaItem>("/media/upload", {
    method: "POST",
    body: formData,
  });
};

export const updateMediaItem = async (id: string, assigned_pages: string[], is_enabled: boolean): Promise<MediaItem> => {
  return apiFetch<MediaItem>(`/media/items/${id}`, {
    method: "PUT",
    body: JSON.stringify({ assigned_pages, is_enabled }),
  });
};

export const deleteMediaItem = async (id: string): Promise<{ message: string }> => {
  return apiFetch<{ message: string }>(`/media/items/${id}`, {
    method: "DELETE",
  });
};
