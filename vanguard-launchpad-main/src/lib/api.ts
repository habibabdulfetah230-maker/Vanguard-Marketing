const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5000/api";

type ApiRequestOptions = RequestInit & {
  token?: string | null;
};

const buildHeaders = (options?: ApiRequestOptions) => {
  const headers = new Headers(options?.headers ?? {});
  if (!headers.has("Content-Type") && options?.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
};

const apiFetch = async <TResponse>(path: string, options?: ApiRequestOptions): Promise<TResponse> => {
  const headers = buildHeaders(options);
  if (options?.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("Content-Type");
  const isJson = contentType?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload as TResponse;
};

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

const loginAdmin = (payload: LoginPayload) =>
  apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

interface VideoProjectResponse {
  id: string;
  title: string;
  description?: string;
  youtubeVideoId: string;
  isPublished?: boolean;
  createdAt: string;
  updatedAt?: string;
}

const fetchAdminVideoProjects = (token: string) =>
  apiFetch<VideoProjectResponse[]>("/admin/videos", {
    method: "GET",
    token,
  });

const fetchPublishedVideoProjects = () =>
  apiFetch<VideoProjectResponse[]>("/videos", {
    method: "GET",
  });

interface VideoProjectPayload {
  title: string;
  description?: string;
  youtubeUrl: string;
  isPublished?: boolean;
}

const createVideoProject = (token: string, payload: VideoProjectPayload) =>
  apiFetch<VideoProjectResponse>("/admin/videos", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });

const updateVideoProject = (token: string, id: string, payload: Partial<VideoProjectPayload>) =>
  apiFetch<VideoProjectResponse>(`/admin/videos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    token,
  });

const deleteVideoProject = (token: string, id: string) =>
  apiFetch<void>(`/admin/videos/${id}`, {
    method: "DELETE",
    token,
  });

interface BrandingItemResponse {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  externalLink: string;
  createdAt: string;
  updatedAt?: string;
}

interface BrandingItemPayload {
  title: string;
  description?: string;
  externalLink: string;
  image: File;
}

const fetchBrandingItems = () => apiFetch<BrandingItemResponse[]>("/branding", { method: "GET" });

const createBrandingItem = (token: string, payload: BrandingItemPayload) => {
  const formData = new FormData();
  formData.append("title", payload.title);
  if (payload.description) {
    formData.append("description", payload.description);
  }
  formData.append("externalLink", payload.externalLink);
  formData.append("image", payload.image);

  return apiFetch<BrandingItemResponse>("/branding", {
    method: "POST",
    body: formData,
    token,
  });
};

const updateBrandingItem = (token: string, id: string, payload: Partial<BrandingItemPayload>) => {
  const formData = new FormData();
  if (payload.title) formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  if (payload.externalLink) formData.append("externalLink", payload.externalLink);
  if (payload.image) formData.append("image", payload.image);

  return apiFetch<BrandingItemResponse>(`/branding/${id}`, {
    method: "PATCH",
    body: formData,
    token,
  });
};

const deleteBrandingItem = (token: string, id: string) =>
  apiFetch<void>(`/branding/${id}`, {
    method: "DELETE",
    token,
  });

interface FullProjectResponse {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  externalLink: string;
  createdAt: string;
  updatedAt?: string;
}

interface FullProjectPayload {
  title: string;
  description?: string;
  externalLink: string;
  image: File;
}

const fetchFullProjects = () => apiFetch<FullProjectResponse[]>("/full-projects", { method: "GET" });

const createFullProject = (token: string, payload: FullProjectPayload) => {
  const formData = new FormData();
  formData.append("title", payload.title);
  if (payload.description) {
    formData.append("description", payload.description);
  }
  formData.append("externalLink", payload.externalLink);
  formData.append("image", payload.image);

  return apiFetch<FullProjectResponse>("/full-projects", {
    method: "POST",
    body: formData,
    token,
  });
};

const updateFullProject = (token: string, id: string, payload: Partial<FullProjectPayload>) => {
  const formData = new FormData();
  if (payload.title) formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  if (payload.externalLink) formData.append("externalLink", payload.externalLink);
  if (payload.image) formData.append("image", payload.image);

  return apiFetch<FullProjectResponse>(`/full-projects/${id}`, {
    method: "PATCH",
    body: formData,
    token,
  });
};

const deleteFullProject = (token: string, id: string) =>
  apiFetch<void>(`/full-projects/${id}`, {
    method: "DELETE",
    token,
  });

interface DesignItemResponse {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  externalLink?: string;
  createdAt: string;
  updatedAt?: string;
}

interface DesignItemPayload {
  title: string;
  description?: string;
  externalLink?: string;
  image: File;
}

const fetchDesignItems = () => apiFetch<DesignItemResponse[]>("/design", { method: "GET" });

const createDesignItem = (token: string, payload: DesignItemPayload) => {
  const formData = new FormData();
  formData.append("title", payload.title);
  if (payload.description) {
    formData.append("description", payload.description);
  }
  if (payload.externalLink) {
    formData.append("externalLink", payload.externalLink);
  }
  formData.append("image", payload.image);

  return apiFetch<DesignItemResponse>("/design", {
    method: "POST",
    body: formData,
    token,
  });
};

const updateDesignItem = (token: string, id: string, payload: Partial<DesignItemPayload>) => {
  const formData = new FormData();
  if (payload.title) formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  if (payload.externalLink) formData.append("externalLink", payload.externalLink);
  if (payload.image) formData.append("image", payload.image);

  return apiFetch<DesignItemResponse>(`/design/${id}`, {
    method: "PATCH",
    body: formData,
    token,
  });
};

const deleteDesignItem = (token: string, id: string) =>
  apiFetch<void>(`/design/${id}`, {
    method: "DELETE",
    token,
  });

interface TestimonialResponse {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  testimonial: string;
  externalLink?: string;
  createdAt: string;
  updatedAt?: string;
}

interface TestimonialPayload {
  name: string;
  role: string;
  testimonial: string;
  externalLink?: string;
  photo: File;
}

const fetchTestimonials = () => apiFetch<TestimonialResponse[]>("/testimonials", { method: "GET" });

const createTestimonial = (token: string, payload: TestimonialPayload) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("role", payload.role);
  formData.append("testimonial", payload.testimonial);
  if (payload.externalLink) {
    formData.append("externalLink", payload.externalLink);
  }
  formData.append("photo", payload.photo);

  return apiFetch<TestimonialResponse>("/testimonials", {
    method: "POST",
    body: formData,
    token,
  });
};

const updateTestimonial = (token: string, id: string, payload: Partial<TestimonialPayload>) => {
  const formData = new FormData();
  if (payload.name) formData.append("name", payload.name);
  if (payload.role) formData.append("role", payload.role);
  if (payload.testimonial) formData.append("testimonial", payload.testimonial);
  if (payload.externalLink) formData.append("externalLink", payload.externalLink);
  if (payload.photo) formData.append("photo", payload.photo);

  return apiFetch<TestimonialResponse>(`/testimonials/${id}`, {
    method: "PATCH",
    body: formData,
    token,
  });
};

const deleteTestimonial = (token: string, id: string) =>
  apiFetch<void>(`/testimonials/${id}`, {
    method: "DELETE",
    token,
  });

const submitContactForm = (payload: { name: string; email: string; phone?: string; company?: string; message: string }) =>
  apiFetch<{ message: string }>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });

const fetchContactSubmissions = (token: string) =>
  apiFetch<Array<{ id: string; name: string; email: string; phone?: string; company?: string; message: string; isRead: boolean; createdAt: string }>>("/contact", {
    method: "GET",
    token,
  });

const markContactAsRead = (token: string, id: string) =>
  apiFetch<{ id: string; isRead: boolean }>(`/contact/${id}/read`, {
    method: "PATCH",
    token,
  });

const deleteContactSubmission = (token: string, id: string) =>
  apiFetch<void>(`/contact/${id}`, {
    method: "DELETE",
    token,
  });

export {
  API_BASE_URL,
  loginAdmin,
  fetchAdminVideoProjects,
  fetchPublishedVideoProjects,
  createVideoProject,
  updateVideoProject,
  deleteVideoProject,
  fetchBrandingItems,
  createBrandingItem,
  updateBrandingItem,
  deleteBrandingItem,
  fetchFullProjects,
  createFullProject,
  updateFullProject,
  deleteFullProject,
  fetchDesignItems,
  createDesignItem,
  updateDesignItem,
  deleteDesignItem,
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  submitContactForm,
  fetchContactSubmissions,
  markContactAsRead,
  deleteContactSubmission,
};
export type {
  VideoProjectResponse,
  VideoProjectPayload,
  LoginResponse,
  BrandingItemResponse,
  BrandingItemPayload,
  FullProjectResponse,
  FullProjectPayload,
  DesignItemResponse,
  DesignItemPayload,
  TestimonialResponse,
  TestimonialPayload,
};
