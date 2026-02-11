import { useState, useRef, type ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, Pencil, ImagePlus, ExternalLink } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type TestimonialResponse,
  type TestimonialPayload,
} from "@/lib/api";
import { useAdminAuth } from "@/context/AdminAuthContext";

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Name must be 120 characters or fewer"),
  role: z.string().min(1, "Role is required").max(150, "Role must be 150 characters or fewer"),
  testimonial: z.string().min(10, "Testimonial should be at least 10 characters").max(1000, "Testimonial must be 1000 characters or fewer"),
  externalLink: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

const AdminTestimonials = () => {
  const { token } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [activeItem, setActiveItem] = useState<TestimonialResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { name: "", role: "", testimonial: "", externalLink: "" },
  });

  const createMutation = useMutation({
    mutationFn: (payload: TestimonialPayload) => createTestimonial(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast({ title: "Testimonial created" });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TestimonialPayload> }) =>
      updateTestimonial(token, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast({ title: "Testimonial updated" });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTestimonial(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast({ title: "Testimonial deleted" });
    },
  });

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please upload an image", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Photo must be 5MB or smaller", variant: "destructive" });
      return;
    }
    setSelectedPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearPhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openCreateDialog = () => {
    setDialogMode("create");
    setActiveItem(null);
    form.reset({ name: "", role: "", testimonial: "", externalLink: "" });
    clearPhoto();
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: TestimonialResponse) => {
    setDialogMode("edit");
    setActiveItem(item);
    form.reset({
      name: item.name,
      role: item.role,
      testimonial: item.testimonial,
      externalLink: item.externalLink || "",
    });
    clearPhoto();
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setActiveItem(null);
    form.reset();
    clearPhoto();
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (dialogMode === "create" && !selectedPhoto) {
      toast({ title: "Please select a photo", variant: "destructive" });
      return;
    }

    const payload: TestimonialPayload = {
      name: values.name.trim(),
      role: values.role.trim(),
      testimonial: values.testimonial.trim(),
      externalLink: values.externalLink?.trim() || undefined,
      photo: selectedPhoto!,
    };

    if (dialogMode === "create") {
      await createMutation.mutateAsync(payload);
    } else if (activeItem) {
      const updatePayload: Partial<TestimonialPayload> = {
        name: values.name.trim(),
        role: values.role.trim(),
        testimonial: values.testimonial.trim(),
        externalLink: values.externalLink?.trim() || undefined,
      };
      if (selectedPhoto) updatePayload.photo = selectedPhoto;
      await updateMutation.mutateAsync({ id: activeItem.id, payload: updatePayload });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-sm text-slate-400">Manage client testimonials</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !items?.length ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-400">
            No testimonials yet. Add your first testimonial!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="p-4 flex items-center gap-4 border-b border-white/10">
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>{item.role}</CardDescription>
                </div>
              </div>
              <CardContent className="pt-4">
                <p className="text-sm text-slate-300 line-clamp-4 mb-4">
                  "{item.testimonial}"
                </p>
                {item.externalLink && (
                  <a
                    href={item.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary flex items-center gap-1 hover:underline mb-4"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Profile
                  </a>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(item.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === "create" ? "Add Testimonial" : "Edit Testimonial"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "create" ? "Create a new client testimonial" : "Update testimonial details"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role / Company</FormLabel>
                    <FormControl>
                      <Input placeholder="CEO at Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="testimonial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Testimonial</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What they said about working with you..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="externalLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>{dialogMode === "edit" && !selectedPhoto ? "Change Photo (optional)" : "Photo"}</FormLabel>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="mr-2 h-4 w-4" />
                    {previewUrl ? "Change Photo" : "Select Photo"}
                  </Button>
                  {previewUrl && (
                    <Button type="button" variant="ghost" size="sm" onClick={clearPhoto}>
                      Clear
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                {previewUrl && (
                  <div className="mt-2 w-20 h-20 rounded-full overflow-hidden bg-slate-900">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                {dialogMode === "edit" && activeItem && !previewUrl && (
                  <p className="text-xs text-slate-400">Current photo will be kept if no new photo is selected</p>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {dialogMode === "create" ? "Create" : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTestimonials;
