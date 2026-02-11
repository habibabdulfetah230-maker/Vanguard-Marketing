type ApiRequestOptions = RequestInit & {
  token?: string | null;
};

const apiFetch = async <T>(endpoint: string, options?: ApiRequestOptions): Promise<T> => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5000/api');
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  if (options?.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Admin management types
export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAdminPayload {
  email: string;
  name: string;
  password: string;
  role?: 'admin' | 'superadmin';
}

export interface UpdateAdminPayload {
  email?: string;
  name?: string;
  role?: 'admin' | 'superadmin';
  isActive?: boolean;
}

// Admin management API functions
export const fetchAdmins = () => apiFetch<AdminUser[]>("/admin/users");

export const fetchAdminById = (id: string) => apiFetch<AdminUser>(`/admin/users/${id}`);

export const createAdmin = (token: string, payload: CreateAdminPayload) =>
  apiFetch<AdminUser>("/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });

export const updateAdmin = (token: string, id: string, payload: UpdateAdminPayload) =>
  apiFetch<AdminUser>(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    token,
  });

export const toggleAdminStatus = (token: string, id: string) =>
  apiFetch<AdminUser>(`/admin/users/${id}/toggle`, {
    method: "PATCH",
    token,
  });

export const deleteAdmin = (token: string, id: string) =>
  apiFetch<AdminUser>(`/admin/users/${id}`, {
    method: "DELETE",
    token,
  });

export const changeAdminPassword = (token: string, id: string, newPassword: string) =>
  apiFetch<AdminUser>(`/admin/users/${id}/password`, {
    method: "PATCH",
    body: JSON.stringify({ newPassword }),
    token,
  });
