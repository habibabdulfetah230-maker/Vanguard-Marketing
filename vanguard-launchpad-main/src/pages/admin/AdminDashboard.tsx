import { useMemo, useState, useRef, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut, Plus, Trash2, Pencil, Youtube, ImagePlus, ExternalLink, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAdminVideoProjects,
  createVideoProject,
  updateVideoProject,
  deleteVideoProject,
  type VideoProjectResponse,
  type VideoProjectPayload,
  fetchBrandingItems,
  createBrandingItem,
  updateBrandingItem,
  deleteBrandingItem,
  type BrandingItemResponse,
  type BrandingItemPayload,
  fetchFullProjects,
  createFullProject,
  updateFullProject,
  deleteFullProject,
  type FullProjectResponse,
  type FullProjectPayload,
  fetchDesignItems,
  createDesignItem,
  updateDesignItem,
  deleteDesignItem,
  type DesignItemResponse,
  type DesignItemPayload,
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type TestimonialResponse,
  type TestimonialPayload,
  fetchContactSubmissions,
  markContactAsRead,
  deleteContactSubmission,
} from "@/lib/api";
import { useAdminAuth } from "@/context/AdminAuthContext";

const videoProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title must be 150 characters or fewer"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),
  youtubeUrl: z.string().url("Enter a valid YouTube URL"),
  isPublished: z.boolean().default(true),
});

type VideoProjectFormValues = z.infer<typeof videoProjectSchema>;

type DialogMode = "create" | "edit";

const adminNavItems = ["All", "Video", "Branding", "Design", "Full Projects", "Testimonials", "Messages"] as const;
type AdminSection = (typeof adminNavItems)[number];

const brandingSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title must be 150 characters or fewer"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),
  externalLink: z.string().url("Enter a valid URL"),
});

type BrandingFormValues = z.infer<typeof brandingSchema>;

const fullProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title must be 150 characters or fewer"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),
  externalLink: z.string().url("Enter a valid URL"),
});

type FullProjectFormValues = z.infer<typeof fullProjectSchema>;

const designSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title must be 150 characters or fewer"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),
  externalLink: z
    .string({ invalid_type_error: "External link must be text" })
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
});

type DesignFormValues = z.infer<typeof designSchema>;

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Name must be 120 characters or fewer"),
  role: z.string().min(1, "Role is required").max(150, "Role must be 150 characters or fewer"),
  testimonial: z
    .string()
    .min(10, "Testimonial should be at least 10 characters")
    .max(1000, "Testimonial must be 1000 characters or fewer"),
  externalLink: z
    .string({ invalid_type_error: "External link must be text" })
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

const mapProjectToFormValues = (project: VideoProjectResponse): VideoProjectFormValues => ({
  title: project.title,
  description: project.description ?? "",
  youtubeUrl: `https://www.youtube.com/watch?v=${project.youtubeVideoId}`,
  isPublished: Boolean(project.isPublished),
});

const AdminDashboard = () => {
  const { token, admin, logout, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dialogMode, setDialogMode] = useState<DialogMode>("create");
  const [activeProject, setActiveProject] = useState<VideoProjectResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("All");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading dashboard...
      </div>
    );
  }

  if (!token) {
    return null;
  }

  const form = useForm<VideoProjectFormValues>({
    resolver: zodResolver(videoProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      youtubeUrl: "",
      isPublished: true,
    },
  });

  const brandingForm = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      title: "",
      description: "",
      externalLink: "",
    },
  });

  const brandingFileInputRef = useRef<HTMLInputElement | null>(null);
  const [brandingImage, setBrandingImage] = useState<File | null>(null);
  const [brandingPreview, setBrandingPreview] = useState<string | null>(null);

  const fullProjectForm = useForm<FullProjectFormValues>({
    resolver: zodResolver(fullProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      externalLink: "",
    },
  });

  const fullProjectFileInputRef = useRef<HTMLInputElement | null>(null);
  const [fullProjectImage, setFullProjectImage] = useState<File | null>(null);
  const [fullProjectPreview, setFullProjectPreview] = useState<string | null>(null);

  const designForm = useForm<DesignFormValues>({
    resolver: zodResolver(designSchema),
    defaultValues: {
      title: "",
      description: "",
      externalLink: "",
    },
  });

  const designFileInputRef = useRef<HTMLInputElement | null>(null);
  const [designImage, setDesignImage] = useState<File | null>(null);
  const [designPreview, setDesignPreview] = useState<string | null>(null);

  const testimonialForm = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      role: "",
      testimonial: "",
      externalLink: "",
    },
  });

  const testimonialFileInputRef = useRef<HTMLInputElement | null>(null);
  const [testimonialPhoto, setTestimonialPhoto] = useState<File | null>(null);
  const [testimonialPreview, setTestimonialPreview] = useState<string | null>(null);

  const handleFullProjectImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({ title: "Unsupported file", description: "Please upload an image.", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Images must be 5MB or smaller.", variant: "destructive" });
      return;
    }

    if (fullProjectPreview) {
      URL.revokeObjectURL(fullProjectPreview);
    }

    setFullProjectImage(file);
    setFullProjectPreview(URL.createObjectURL(file));
  };

  const clearFullProjectImage = () => {
    if (fullProjectPreview) {
      URL.revokeObjectURL(fullProjectPreview);
    }
    setFullProjectPreview(null);
    setFullProjectImage(null);
    if (fullProjectFileInputRef.current) {
      fullProjectFileInputRef.current.value = "";
    }
  };

  const resetFullProjectForm = () => {
    fullProjectForm.reset({ title: "", description: "", externalLink: "" });
    clearFullProjectImage();
  };

  const handleFullProjectSubmit = fullProjectForm.handleSubmit(async (values) => {
    if (!fullProjectImage) {
      toast({ title: "Image required", description: "Please upload a project image.", variant: "destructive" });
      return;
    }

    try {
      const payload: FullProjectPayload = {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        externalLink: values.externalLink.trim(),
        image: fullProjectImage,
      };

      await fullProjectMutation.mutateAsync(payload);
      toast({ title: "Full project created", description: "Your project is now shining in the portfolio." });
      resetFullProjectForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create project";
      toast({ title: "Request failed", description: message, variant: "destructive" });
    }
  });

  const handleDesignImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({ title: "Unsupported file", description: "Please upload an image.", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Images must be 5MB or smaller.", variant: "destructive" });
      return;
    }

    if (designPreview) {
      URL.revokeObjectURL(designPreview);
    }

    setDesignImage(file);
    setDesignPreview(URL.createObjectURL(file));
  };

  const clearDesignImage = () => {
    if (designPreview) {
      URL.revokeObjectURL(designPreview);
    }
    setDesignPreview(null);
    setDesignImage(null);
    if (designFileInputRef.current) {
      designFileInputRef.current.value = "";
    }
  };

  const resetDesignForm = () => {
    designForm.reset({ title: "", description: "", externalLink: "" });
    clearDesignImage();
  };

  const handleDesignSubmit = designForm.handleSubmit(async (values) => {
    if (!designImage) {
      toast({ title: "Image required", description: "Please upload a design image.", variant: "destructive" });
      return;
    }

    try {
      const payload: DesignItemPayload = {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        externalLink: values.externalLink?.trim() || undefined,
        image: designImage,
      };

      await designMutation.mutateAsync(payload);
      toast({ title: "Design item created", description: "Design work added to the portfolio." });
      resetDesignForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create design item";
      toast({ title: "Request failed", description: message, variant: "destructive" });
    }
  });

  const handleTestimonialPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({ title: "Unsupported file", description: "Please upload a photo.", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Photos must be 5MB or smaller.", variant: "destructive" });
      return;
    }

    if (testimonialPreview) {
      URL.revokeObjectURL(testimonialPreview);
    }

    setTestimonialPhoto(file);
    setTestimonialPreview(URL.createObjectURL(file));
  };

  const clearTestimonialPhoto = () => {
    if (testimonialPreview) {
      URL.revokeObjectURL(testimonialPreview);
    }
    setTestimonialPreview(null);
    setTestimonialPhoto(null);
    if (testimonialFileInputRef.current) {
      testimonialFileInputRef.current.value = "";
    }
  };

  const resetTestimonialForm = () => {
    testimonialForm.reset({ name: "", role: "", testimonial: "", externalLink: "" });
    clearTestimonialPhoto();
  };

  const handleTestimonialSubmit = testimonialForm.handleSubmit(async (values) => {
    if (!testimonialPhoto) {
      toast({ title: "Photo required", description: "Please upload a client photo.", variant: "destructive" });
      return;
    }

    try {
      const payload: TestimonialPayload = {
        name: values.name.trim(),
        role: values.role.trim(),
        testimonial: values.testimonial.trim(),
        externalLink: values.externalLink?.trim() || undefined,
        photo: testimonialPhoto,
      };

      await testimonialMutation.mutateAsync(payload);
      toast({ title: "Testimonial added", description: "Your client story is now live." });
      resetTestimonialForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create testimonial";
      toast({ title: "Request failed", description: message, variant: "destructive" });
    }
  });

  const { data: videoProjects, isLoading: isLoadingProjects, isError } = useQuery({
    queryKey: ["admin-video-projects"],
    queryFn: () => fetchAdminVideoProjects(token),
    enabled: Boolean(token),
    staleTime: 30_000,
  });

  const {
    data: brandingItems,
    isLoading: isLoadingBranding,
    isError: isBrandingError,
  } = useQuery({
    queryKey: ["branding-items"],
    queryFn: fetchBrandingItems,
    staleTime: 30_000,
  });

  const {
    data: fullProjects,
    isLoading: isLoadingFullProjects,
    isError: isFullProjectError,
  } = useQuery({
    queryKey: ["full-projects"],
    queryFn: fetchFullProjects,
    staleTime: 30_000,
  });

  const {
    data: designItems,
    isLoading: isLoadingDesign,
    isError: isDesignError,
  } = useQuery({
    queryKey: ["design-items"],
    queryFn: fetchDesignItems,
    staleTime: 30_000,
  });

  const {
    data: testimonials,
    isLoading: isLoadingTestimonials,
    isError: isTestimonialsError,
  } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
    staleTime: 30_000,
  });

  const {
    data: contactSubmissions,
    isLoading: isLoadingMessages,
    isError: isMessagesError,
  } = useQuery({
    queryKey: ["contact-submissions"],
    queryFn: () => fetchContactSubmissions(token),
    enabled: Boolean(token),
    staleTime: 30_000,
  });

  useEffect(() => {
    return () => {
      if (brandingPreview) {
        URL.revokeObjectURL(brandingPreview);
      }
    };
  }, [brandingPreview]);

  useEffect(() => {
    return () => {
      if (fullProjectPreview) {
        URL.revokeObjectURL(fullProjectPreview);
      }
    };
  }, [fullProjectPreview]);

  useEffect(() => {
    return () => {
      if (designPreview) {
        URL.revokeObjectURL(designPreview);
      }
    };
  }, [designPreview]);

  useEffect(() => {
    return () => {
      if (testimonialPreview) {
        URL.revokeObjectURL(testimonialPreview);
      }
    };
  }, [testimonialPreview]);

  const createMutation = useMutation({
    mutationFn: (payload: VideoProjectPayload) => createVideoProject(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-video-projects"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<VideoProjectPayload> }) =>
      updateVideoProject(token, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-video-projects"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVideoProject(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-video-projects"] });
    },
  });

  const brandingMutation = useMutation({
    mutationFn: (payload: BrandingItemPayload) => {
      if (!token) {
        throw new Error("Not authenticated");
      }

      return createBrandingItem(token, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branding-items"] });
    },
  });

  const fullProjectMutation = useMutation({
    mutationFn: (payload: FullProjectPayload) => {
      if (!token) {
        throw new Error("Not authenticated");
      }

      return createFullProject(token, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["full-projects"] });
    },
  });

  const designMutation = useMutation({
    mutationFn: (payload: DesignItemPayload) => {
      if (!token) {
        throw new Error("Not authenticated");
      }

      return createDesignItem(token, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["design-items"] });
    },
  });

  const testimonialMutation = useMutation({
    mutationFn: (payload: TestimonialPayload) => {
      if (!token) {
        throw new Error("Not authenticated");
      }

      return createTestimonial(token, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => markContactAsRead(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (id: string) => deleteContactSubmission(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
    },
  });

  // Update/Delete mutations for all content types
  const updateBrandingMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<BrandingItemPayload> }) =>
      updateBrandingItem(token, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branding-items"] });
    },
  });

  const deleteBrandingMutation = useMutation({
    mutationFn: (id: string) => deleteBrandingItem(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branding-items"] });
    },
  });

  const updateFullProjectMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<FullProjectPayload> }) =>
      updateFullProject(token, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["full-projects"] });
    },
  });

  const deleteFullProjectMutation = useMutation({
    mutationFn: (id: string) => deleteFullProject(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["full-projects"] });
    },
  });

  const updateDesignMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<DesignItemPayload> }) =>
      updateDesignItem(token, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["design-items"] });
    },
  });

  const deleteDesignMutation = useMutation({
    mutationFn: (id: string) => deleteDesignItem(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["design-items"] });
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TestimonialPayload> }) =>
      updateTestimonial(token, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: (id: string) => deleteTestimonial(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  const handleBrandingImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({ title: "Unsupported file", description: "Please upload an image.", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Images must be 5MB or smaller.", variant: "destructive" });
      return;
    }

    if (brandingPreview) {
      URL.revokeObjectURL(brandingPreview);
    }

    setBrandingImage(file);
    setBrandingPreview(URL.createObjectURL(file));
  };

  const clearBrandingImage = () => {
    if (brandingPreview) {
      URL.revokeObjectURL(brandingPreview);
    }
    setBrandingPreview(null);
    setBrandingImage(null);
    if (brandingFileInputRef.current) {
      brandingFileInputRef.current.value = "";
    }
  };

  const resetBrandingForm = () => {
    brandingForm.reset({ title: "", description: "", externalLink: "" });
    clearBrandingImage();
  };

  const handleBrandingSubmit = brandingForm.handleSubmit(async (values) => {
    if (!brandingImage) {
      toast({ title: "Image required", description: "Please upload a branding image.", variant: "destructive" });
      return;
    }

    try {
      const payload: BrandingItemPayload = {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        externalLink: values.externalLink.trim(),
        image: brandingImage,
      };

      await brandingMutation.mutateAsync(payload);
      toast({ title: "Branding item created", description: "Your branding showcase is now live." });
      resetBrandingForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create branding item";
      toast({ title: "Request failed", description: message, variant: "destructive" });
    }
  });

  const openCreateDialog = () => {
    setDialogMode("create");
    setActiveProject(null);
    form.reset({ title: "", description: "", youtubeUrl: "", isPublished: true });
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: VideoProjectResponse) => {
    setDialogMode("edit");
    setActiveProject(project);
    form.reset(mapProjectToFormValues(project));
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setActiveProject(null);
    form.reset({ title: "", description: "", youtubeUrl: "", isPublished: true });
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const payload: VideoProjectPayload = {
        title: values.title,
        description: values.description?.trim() ? values.description.trim() : undefined,
        youtubeUrl: values.youtubeUrl.trim(),
        isPublished: values.isPublished,
      };

      if (dialogMode === "create") {
        await createMutation.mutateAsync(payload);
        toast({ title: "Video project created", description: "Your project is now available in the dashboard." });
      } else if (activeProject) {
        await updateMutation.mutateAsync({ id: activeProject.id, payload });
        toast({ title: "Video project updated", description: "Changes saved successfully." });
      }

      closeDialog();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save project";
      toast({ title: "Request failed", description: message, variant: "destructive" });
    }
  });

  const handleDelete = async (project: VideoProjectResponse) => {
    try {
      await deleteMutation.mutateAsync(project.id);
      toast({ title: "Video project deleted" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete project";
      toast({ title: "Delete failed", description: message, variant: "destructive" });
    }
  };

  const handleTogglePublish = async (project: VideoProjectResponse, nextValue: boolean) => {
    try {
      await updateMutation.mutateAsync({
        id: project.id,
        payload: { isPublished: nextValue },
      });
      toast({
        title: nextValue ? "Project published" : "Project unpublished",
        description: `${project.title} is now ${nextValue ? "visible" : "hidden"} on the public site.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update publish state";
      toast({ title: "Update failed", description: message, variant: "destructive" });
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;
  const isBrandingSubmitting = brandingMutation.isPending;
  const isFullProjectSubmitting = fullProjectMutation.isPending;
  const isDesignSubmitting = designMutation.isPending;
  const isTestimonialSubmitting = testimonialMutation.isPending;

  const showVideoManagement = activeSection === "All" || activeSection === "Video";
  const showBrandingManagement = activeSection === "All" || activeSection === "Branding";
  const showDesignManagement = activeSection === "All" || activeSection === "Design";
  const showFullProjectManagement = activeSection === "All" || activeSection === "Full Projects";
  const showTestimonialsManagement = activeSection === "All" || activeSection === "Testimonials";
  const showMessagesManagement = activeSection === "All" || activeSection === "Messages";

  const publishedCount = useMemo(
    () => videoProjects?.filter((project) => project.isPublished).length ?? 0,
    [videoProjects],
  );

  const renderTable = () => {
    if (isLoadingProjects) {
      return (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading projects...
        </div>
      );
    }

    if (isError) {
      return <div className="text-sm text-red-400">Unable to load projects. Please refresh.</div>;
    }

    if (!videoProjects?.length) {
      return <div className="text-sm text-muted-foreground">No video projects yet. Create your first upload.</div>;
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videoProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-primary" />
                  {project.title}
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {project.description || <span className="italic text-muted-foreground/60">No description</span>}
              </TableCell>
              <TableCell>
                <Switch
                  checked={Boolean(project.isPublished)}
                  onCheckedChange={(value) => handleTogglePublish(project, value)}
                  aria-label={project.isPublished ? "Unpublish project" : "Publish project"}
                />
              </TableCell>
              <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(project)}
                  aria-label="Edit project"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(project)}
                  aria-label="Delete project"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderFullProjectItems = () => {
    if (isLoadingFullProjects) {
      return (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading full projects...
        </div>
      );
    }

    if (isFullProjectError) {
      return <div className="text-sm text-red-400">Unable to load full projects. Please refresh.</div>;
    }

    if (!fullProjects?.length) {
      return (
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-6 text-sm text-primary">
          No full projects yet. Add one to highlight end-to-end campaigns.
        </div>
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {fullProjects.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-primary/10 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
            <div className="space-y-4 p-6">
              <div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                {item.description && <p className="mt-2 text-sm text-slate-300">{item.description}</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 justify-between border-white/20 text-slate-100 hover:bg-white/10"
                  asChild
                >
                  <a href={item.externalLink} target="_blank" rel="noopener noreferrer">
                    View project
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteFullProjectMutation.mutate(item.id)}
                  disabled={deleteFullProjectMutation.isPending}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Published {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderBrandingItems = () => {
    if (isLoadingBranding) {
      return (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading branding campaigns...
        </div>
      );
    }

    if (isBrandingError) {
      return <div className="text-sm text-red-400">Unable to load branding posts. Please refresh.</div>;
    }

    if (!brandingItems?.length) {
      return (
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-6 text-sm text-primary">
          No branding showcases yet. Publish your first item to light up this section.
        </div>
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {brandingItems.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-primary/10 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
            <div className="space-y-4 p-6">
              <div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                {item.description && <p className="mt-2 text-sm text-slate-300">{item.description}</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 justify-between border-white/20 text-slate-100 hover:bg-white/10"
                  asChild
                >
                  <a href={item.externalLink} target="_blank" rel="noopener noreferrer">
                    Visit project
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteBrandingMutation.mutate(item.id)}
                  disabled={deleteBrandingMutation.isPending}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Published {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDesignItems = () => {
    if (isLoadingDesign) {
      return (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading design items...
        </div>
      );
    }

    if (isDesignError) {
      return <div className="text-sm text-red-400">Unable to load design work. Please refresh.</div>;
    }

    if (!designItems?.length) {
      return (
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-6 text-sm text-primary">
          No design highlights yet. Upload your first design work to inspire visitors.
        </div>
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {designItems.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-primary/10 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
            <div className="space-y-4 p-6">
              <div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                {item.description && <p className="mt-2 text-sm text-slate-300">{item.description}</p>}
              </div>
              {item.externalLink && (
                <Button
                  variant="outline"
                  className="w-full justify-between border-white/20 text-slate-100 hover:bg-white/10"
                  asChild
                >
                  <a href={item.externalLink} target="_blank" rel="noopener noreferrer">
                    View design
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Published {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteDesignMutation.mutate(item.id)}
                  disabled={deleteDesignMutation.isPending}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTestimonials = () => {
    if (isLoadingTestimonials) {
      return (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading testimonials...
        </div>
      );
    }

    if (isTestimonialsError) {
      return <div className="text-sm text-red-400">Unable to load testimonials. Please refresh.</div>;
    }

    if (!testimonials?.length) {
      return (
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-6 text-sm text-primary">
          No testimonials yet. Share a client story to build trust on the portfolio page.
        </div>
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-primary/10"
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-full border border-white/10">
                <img src={item.photoUrl} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div>
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-xs uppercase tracking-wide text-slate-400">{item.role}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-200">"{item.testimonial}"</p>
            <div className="mt-4 flex items-center justify-between">
              {item.externalLink && (
                <Button
                  variant="outline"
                  className="justify-between border-white/20 text-slate-100 hover:bg-white/10"
                  asChild
                >
                  <a href={item.externalLink} target="_blank" rel="noopener noreferrer">
                    View profile
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTestimonialMutation.mutate(item.id)}
                disabled={deleteTestimonialMutation.isPending}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMessages = () => {
    if (isLoadingMessages) {
      return (
        <div className="flex h-40 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading messages...
        </div>
      );
    }

    if (isMessagesError) {
      return <div className="text-sm text-red-400">Unable to load messages. Please refresh.</div>;
    }

    if (!contactSubmissions?.length) {
      return (
        <div className="rounded-xl border border-primary/20 bg-primary/10 p-6 text-sm text-primary">
          No messages yet. When visitors submit the contact form, their messages will appear here.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {contactSubmissions.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-2xl border p-6 shadow-lg ${
              msg.isRead 
                ? "border-white/10 bg-white/5 shadow-primary/10" 
                : "border-primary/30 bg-primary/10 shadow-primary/20"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-white">{msg.name}</h3>
                  {!msg.isRead && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 mb-1">{msg.email}</p>
                {msg.phone && <p className="text-sm text-slate-400 mb-1">{msg.phone}</p>}
                {msg.company && <p className="text-sm text-slate-400 mb-3">{msg.company}</p>}
                <p className="text-sm text-slate-200 mt-3 whitespace-pre-wrap">{msg.message}</p>
                <p className="text-xs text-slate-500 mt-3">
                  Received: {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                {!msg.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsReadMutation.mutate(msg.id)}
                    disabled={markAsReadMutation.isPending}
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMessageMutation.mutate(msg.id)}
                  disabled={deleteMessageMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 lg:flex-row">
        <aside className="sticky top-6 flex h-fit w-full flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-primary/10 lg:w-64">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Vanguard Admin</p>
            <h2 className="mt-2 text-2xl font-semibold">Control Center</h2>
          </div>
          <nav className="flex flex-col gap-2">
            {adminNavItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveSection(item)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                  activeSection === item
                    ? "border-primary/80 bg-primary/20 text-primary-foreground shadow-lg shadow-primary/30"
                    : "border-white/10 bg-transparent text-slate-300 hover:border-primary/40 hover:bg-primary/10"
                }`}
              >
                <span>{item}</span>
                {activeSection === item && <span className="text-xs uppercase tracking-wide">Active</span>}
              </button>
            ))}
          </nav>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 to-primary/5 p-4 text-xs text-slate-200">
            Toggle a category to focus your workflow. Items refresh automatically after every upload.
          </div>
        </aside>

        <div className="flex w-full flex-col gap-8">
          <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Vanguard Admin</p>
              <h1 className="mt-2 text-3xl font-bold">Video Portfolio Control Center</h1>
              <p className="text-sm text-slate-300">
                Manage the stories showcased on the public marketing site. Publish new work, edit details, and keep the
                portfolio fresh.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-slate-200">{admin?.name ?? "Administrator"}</p>
                <p className="text-xs text-slate-400">{admin?.email}</p>
              </div>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </Button>
            </div>
          </header>

          {showVideoManagement && (
            <>
              <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                <Card className="bg-white/10 backdrop-blur border-white/10 text-white">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Video Projects</CardTitle>
                    <Button onClick={openCreateDialog} className="gap-2">
                      <Plus className="h-4 w-4" /> New project
                    </Button>
                  </CardHeader>
                  <CardContent>{renderTable()}</CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 text-slate-100">
                  <CardHeader>
                    <CardTitle>Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-sm text-slate-300">Total projects</p>
                      <p className="text-3xl font-semibold">{videoProjects?.length ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">Published</p>
                      <p className="text-3xl font-semibold">{publishedCount}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 to-primary/5 p-4 text-sm text-slate-200">
                      Embed videos via:
                      <code className="mt-2 block rounded bg-black/40 px-3 py-2 text-xs text-primary">
                        {"https://www.youtube.com/embed/{youtubeVideoId}"}
                      </code>
                      <p className="mt-2 text-xs text-slate-300">
                        The marketing site consumes the public API and renders using the stored `youtubeVideoId`.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  if (!open) {
                    closeDialog();
                  }
                }}
              >
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{dialogMode === "create" ? "Add video project" : "Edit video project"}</DialogTitle>
                    <DialogDescription>
                      Provide the YouTube URL and details. Videos marked as published will appear on the public site.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Behind the scenes" {...field} disabled={isMutating} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={4}
                                placeholder="Optional context for the video"
                                {...field}
                                disabled={isMutating}
                              />
                            </FormControl>
                            <FormDescription>This text appears below the embed on the marketing site.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="youtubeUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>YouTube URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.youtube.com/watch?v=..." {...field} disabled={isMutating} />
                            </FormControl>
                            <FormDescription>Links from youtube.com or youtu.be are accepted.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isPublished"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Publish immediately</FormLabel>
                              <FormDescription>Disable to keep this project hidden from the public portfolio.</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isMutating} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button type="button" variant="ghost" onClick={closeDialog} disabled={isMutating}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isMutating}>
                          {isMutating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                            </>
                          ) : dialogMode === "create" ? (
                            "Create"
                          ) : (
                            "Save changes"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </>
          )}

          {showBrandingManagement && (
            <div className="grid gap-6 xl:grid-cols-[1.1fr,1.4fr]">
              <Card className="border-white/10 bg-white/10 text-slate-100">
                <CardHeader>
                  <CardTitle>Branding Showcase</CardTitle>
                  <CardDescription>
                    Upload new branding highlights to feature in the public portfolio. Images are served instantly once
                    saved.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...brandingForm}>
                    <form onSubmit={handleBrandingSubmit} className="space-y-6">
                      <FormField
                        control={brandingForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Brand identity refresh" {...field} disabled={isBrandingSubmitting} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={brandingForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={4}
                                placeholder="Optional summary of the branding work"
                                {...field}
                                disabled={isBrandingSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={brandingForm.control}
                        name="externalLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>External link</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://dribbble.com/your-project"
                                {...field}
                                disabled={isBrandingSubmitting}
                              />
                            </FormControl>
                            <FormDescription>This link opens in a new tab for visitors.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-3">
                        <Label>Project image</Label>
                        <div className="flex flex-col gap-4 sm:flex-row">
                          <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/5 sm:w-40">
                            {brandingPreview ? (
                              <img src={brandingPreview} alt="Branding preview" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-sm text-slate-300">
                                <ImagePlus className="h-8 w-8 text-primary" />
                                Upload preview
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col gap-3">
                            <input
                              ref={brandingFileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleBrandingImageChange}
                            />
                            <div className="flex flex-wrap gap-3">
                              <Button
                                type="button"
                                onClick={() => brandingFileInputRef.current?.click()}
                                disabled={isBrandingSubmitting}
                                className="w-full sm:w-auto"
                              >
                                Upload image
                              </Button>
                              {brandingImage && (
                                <Button type="button" variant="ghost" onClick={clearBrandingImage} disabled={isBrandingSubmitting}>
                                  Remove
                                </Button>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">PNG or JPG up to 5MB. This image appears in the public branding gallery.</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={resetBrandingForm} disabled={isBrandingSubmitting}>
                          Reset
                        </Button>
                        <Button type="submit" disabled={isBrandingSubmitting}>
                          {isBrandingSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing
                            </>
                          ) : (
                            "Publish branding item"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 text-slate-100">
                <CardHeader>
                  <CardTitle>Recent branding posts</CardTitle>
                  <CardDescription>Track the work your audience sees on the branding tab.</CardDescription>
                </CardHeader>
                <CardContent>{renderBrandingItems()}</CardContent>
              </Card>
            </div>
          )}

          {showFullProjectManagement && (
            <div className="grid gap-6 xl:grid-cols-[1.1fr,1.4fr]">
              <Card className="border-white/10 bg-white/10 text-slate-100">
                <CardHeader>
                  <CardTitle>Full Projects</CardTitle>
                  <CardDescription>
                    Showcase your end-to-end campaign work with visuals and outbound links to full case studies.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...fullProjectForm}>
                    <form onSubmit={handleFullProjectSubmit} className="space-y-6">
                      <FormField
                        control={fullProjectForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Integrated launch campaign"
                                {...field}
                                disabled={isFullProjectSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={fullProjectForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={4}
                                placeholder="Optional overview of the full project"
                                {...field}
                                disabled={isFullProjectSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={fullProjectForm.control}
                        name="externalLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>External link</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://youragency.com/case-study"
                                {...field}
                                disabled={isFullProjectSubmitting}
                              />
                            </FormControl>
                            <FormDescription>This opens in a new tab for viewers exploring the project story.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-3">
                        <Label>Project image</Label>
                        <div className="flex flex-col gap-4 sm:flex-row">
                          <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/5 sm:w-40">
                            {fullProjectPreview ? (
                              <img src={fullProjectPreview} alt="Full project preview" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-sm text-slate-300">
                                <ImagePlus className="h-8 w-8 text-primary" />
                                Upload preview
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col gap-3">
                            <input
                              ref={fullProjectFileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFullProjectImageChange}
                            />
                            <div className="flex flex-wrap gap-3">
                              <Button
                                type="button"
                                onClick={() => fullProjectFileInputRef.current?.click()}
                                disabled={isFullProjectSubmitting}
                                className="w-full sm:w-auto"
                              >
                                Upload image
                              </Button>
                              {fullProjectImage && (
                                <Button type="button" variant="ghost" onClick={clearFullProjectImage} disabled={isFullProjectSubmitting}>
                                  Remove
                                </Button>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">PNG or JPG up to 5MB. Featured on the Full Projects tab.</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={resetFullProjectForm} disabled={isFullProjectSubmitting}>
                          Reset
                        </Button>
                        <Button type="submit" disabled={isFullProjectSubmitting}>
                          {isFullProjectSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing
                            </>
                          ) : (
                            "Publish full project"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 text-slate-100">
                <CardHeader>
                  <CardTitle>Recent full projects</CardTitle>
                  <CardDescription>These appear in the public Full Projects showcase.</CardDescription>
                </CardHeader>
                <CardContent>{renderFullProjectItems()}</CardContent>
              </Card>
            </div>
          )}

          {showDesignManagement && (
            <div className="grid gap-6 xl:grid-cols-[1.1fr,1.4fr]">
              <Card className="border-white/10 bg-white/10 text-slate-100">
                <CardHeader>
                  <CardTitle>Design Highlights</CardTitle>
                  <CardDescription>Upload visual design work to feature in the portfolio gallery.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...designForm}>
                    <form onSubmit={handleDesignSubmit} className="space-y-6">
                      <FormField
                        control={designForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Visual identity suite" {...field} disabled={isDesignSubmitting} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={designForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={4}
                                placeholder="Optional context about the design deliverables"
                                {...field}
                                disabled={isDesignSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={designForm.control}
                        name="externalLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>External link</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://behance.net/your-project"
                                {...field}
                                disabled={isDesignSubmitting}
                              />
                            </FormControl>
                            <FormDescription>Optional link for a deep dive, opens in a new tab.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-3">
                        <Label>Design image</Label>
                        <div className="flex flex-col gap-4 sm:flex-row">
                          <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/5 sm:w-40">
                            {designPreview ? (
                              <img src={designPreview} alt="Design preview" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-sm text-slate-300">
                                <ImagePlus className="h-8 w-8 text-primary" />
                                Upload preview
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col gap-3">
                            <input
                              ref={designFileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleDesignImageChange}
                            />
                            <div className="flex flex-wrap gap-3">
                              <Button
                                type="button"
                                onClick={() => designFileInputRef.current?.click()}
                                disabled={isDesignSubmitting}
                                className="w-full sm:w-auto"
                              >
                                Upload image
                              </Button>
                              {designImage && (
                                <Button type="button" variant="ghost" onClick={clearDesignImage} disabled={isDesignSubmitting}>
                                  Remove
                                </Button>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">PNG or JPG up to 5MB. This image appears in the design gallery.</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={resetDesignForm} disabled={isDesignSubmitting}>
                          Reset
                        </Button>
                        <Button type="submit" disabled={isDesignSubmitting}>
                          {isDesignSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing
                            </>
                          ) : (
                            "Publish design item"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 text-slate-100">
                <CardHeader>
                  <CardTitle>Recent design items</CardTitle>
                  <CardDescription>Highlights displayed on the public Design section.</CardDescription>
                </CardHeader>
                <CardContent>{renderDesignItems()}</CardContent>
              </Card>
            </div>
          )}

          {showTestimonialsManagement && (
            <div className="grid gap-6 xl:grid-cols-[1.1fr,1.4fr]">
              <Card className="border-white/10 bg-white/10 text-slate-100">
                <CardHeader>
                  <CardTitle>Client Testimonials</CardTitle>
                  <CardDescription>Capture client feedback to feature in the public portfolio.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...testimonialForm}>
                    <form onSubmit={handleTestimonialSubmit} className="space-y-6">
                      <FormField
                        control={testimonialForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jordan Rivers" {...field} disabled={isTestimonialSubmitting} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={testimonialForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role / Company</FormLabel>
                            <FormControl>
                              <Input placeholder="CMO, Brightline" {...field} disabled={isTestimonialSubmitting} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={testimonialForm.control}
                        name="testimonial"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Testimonial</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={5}
                                placeholder="Share what the client loved about the collaboration"
                                {...field}
                                disabled={isTestimonialSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={testimonialForm.control}
                        name="externalLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>External link</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://linkedin.com/in/client"
                                {...field}
                                disabled={isTestimonialSubmitting}
                              />
                            </FormControl>
                            <FormDescription>Optional profile link, opens in a new tab.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-3">
                        <Label>Client photo</Label>
                        <div className="flex flex-col gap-4 sm:flex-row">
                          <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-dashed border-white/20 bg-white/5 sm:w-40">
                            {testimonialPreview ? (
                              <img src={testimonialPreview} alt="Client preview" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-sm text-slate-300">
                                <ImagePlus className="h-8 w-8 text-primary" />
                                Upload preview
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col gap-3">
                            <input
                              ref={testimonialFileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleTestimonialPhotoChange}
                            />
                            <div className="flex flex-wrap gap-3">
                              <Button
                                type="button"
                                onClick={() => testimonialFileInputRef.current?.click()}
                                disabled={isTestimonialSubmitting}
                                className="w-full sm:w-auto"
                              >
                                Upload photo
                              </Button>
                              {testimonialPhoto && (
                                <Button type="button" variant="ghost" onClick={clearTestimonialPhoto} disabled={isTestimonialSubmitting}>
                                  Remove
                                </Button>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">PNG or JPG up to 5MB. Faces render in the testimonial cards.</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={resetTestimonialForm} disabled={isTestimonialSubmitting}>
                          Reset
                        </Button>
                        <Button type="submit" disabled={isTestimonialSubmitting}>
                          {isTestimonialSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing
                            </>
                          ) : (
                            "Publish testimonial"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 text-slate-100">
                <CardHeader>
                  <CardTitle>Recent testimonials</CardTitle>
                  <CardDescription>Public-facing client stories on the portfolio page.</CardDescription>
                </CardHeader>
                <CardContent>{renderTestimonials()}</CardContent>
              </Card>
            </div>
          )}

          {showMessagesManagement && (
            <div className="grid gap-6">
              <Card className="border-white/10 bg-white/5 text-slate-100">
                <CardHeader>
                  <CardTitle>Contact Messages</CardTitle>
                  <CardDescription>
                    Messages from visitors who submitted the contact form on your website.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-slate-300">
                      {contactSubmissions?.length ?? 0} total messages | {contactSubmissions?.filter((m) => !m.isRead).length ?? 0} unread
                    </p>
                  </div>
                  {renderMessages()}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
