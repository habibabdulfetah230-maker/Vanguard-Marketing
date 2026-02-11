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
  fetchDesignItems,
  createDesignItem,
  updateDesignItem,
  deleteDesignItem,
  type DesignItemResponse,
  type DesignItemPayload,
} from "@/lib/api";
import { useAdminAuth } from "@/context/AdminAuthContext";

const designSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title must be 150 characters or fewer"),
  description: z.string().max(500, "Description must be 500 characters or fewer").optional().or(z.literal("")),
  externalLink: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

type DesignFormValues = z.infer<typeof designSchema>;

const AdminDesign = () => {
  const { token } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [activeItem, setActiveItem] = useState<DesignItemResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ["design-items"],
    queryFn: fetchDesignItems,
  });

  const form = useForm<DesignFormValues>({
    resolver: zodResolver(designSchema),
    defaultValues: { title: "", description: "", externalLink: "" },
  });

  const createMutation = useMutation({
    mutationFn: (payload: DesignItemPayload) => createDesignItem(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["design-items"] });
      toast({ title: "Design item created" });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<DesignItemPayload> }) =>
      updateDesignItem(token, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["design-items"] });
      toast({ title: "Design item updated" });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDesignItem(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["design-items"] });
      toast({ title: "Design item deleted" });
    },
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please upload an image", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image must be 5MB or smaller", variant: "destructive" });
      return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openCreateDialog = () => {
    setDialogMode("create");
    setActiveItem(null);
    form.reset({ title: "", description: "", externalLink: "" });
    clearImage();
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: DesignItemResponse) => {
    setDialogMode("edit");
    setActiveItem(item);
    form.reset({
      title: item.title,
      description: item.description || "",
      externalLink: item.externalLink || "",
    });
    clearImage();
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setActiveItem(null);
    form.reset();
    clearImage();
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (dialogMode === "create" && !selectedImage) {
      toast({ title: "Please select an image", variant: "destructive" });
      return;
    }

    const payload: DesignItemPayload = {
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      externalLink: values.externalLink?.trim() || undefined,
      image: selectedImage!,
    };

    if (dialogMode === "create") {
      await createMutation.mutateAsync(payload);
    } else if (activeItem) {
      const updatePayload: Partial<DesignItemPayload> = {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        externalLink: values.externalLink?.trim() || undefined,
      };
      if (selectedImage) updatePayload.image = selectedImage;
      await updateMutation.mutateAsync({ id: activeItem.id, payload: updatePayload });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Design</h1>
          <p className="text-sm text-slate-400">Manage your design portfolio items</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Design
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !items?.length ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-400">
            No design items yet. Add your first item!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video relative bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {item.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {item.externalLink && (
                  <a
                    href={item.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary flex items-center gap-1 hover:underline mb-4"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Link
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
            <DialogTitle>{dialogMode === "create" ? "Add Design Item" : "Edit Design Item"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "create" ? "Create a new design item" : "Update design details"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Design title" {...field} />
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
                      <Textarea placeholder="Brief description" {...field} />
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
                <FormLabel>{dialogMode === "edit" && !selectedImage ? "Change Image (optional)" : "Image"}</FormLabel>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="mr-2 h-4 w-4" />
                    {previewUrl ? "Change Image" : "Select Image"}
                  </Button>
                  {previewUrl && (
                    <Button type="button" variant="ghost" size="sm" onClick={clearImage}>
                      Clear
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {previewUrl && (
                  <div className="mt-2 aspect-video w-full max-w-[200px] rounded-lg overflow-hidden bg-slate-900">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                {dialogMode === "edit" && activeItem && !previewUrl && (
                  <p className="text-xs text-slate-400">Current image will be kept if no new image is selected</p>
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

export default AdminDesign;
