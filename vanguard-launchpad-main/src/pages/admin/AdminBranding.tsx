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
  fetchBrandingItems,
  createBrandingItem,
  updateBrandingItem,
  deleteBrandingItem,
  type BrandingItemResponse,
  type BrandingItemPayload,
} from "@/lib/api";
import { useAdminAuth } from "@/context/AdminAuthContext";

const brandingSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title must be 150 characters or fewer"),
  description: z.string().max(500, "Description must be 500 characters or fewer").optional().or(z.literal("")),
  externalLink: z.string().url("Enter a valid URL"),
});

type BrandingFormValues = z.infer<typeof brandingSchema>;

const AdminBranding = () => {
  const { token } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [activeItem, setActiveItem] = useState<BrandingItemResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<BrandingItemResponse | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ["branding-items"],
    queryFn: fetchBrandingItems,
  });

  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema),
    defaultValues: { title: "", description: "", externalLink: "" },
  });

  const createMutation = useMutation({
    mutationFn: (payload: BrandingItemPayload) => createBrandingItem(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branding-items"] });
      toast({ title: "Branding item created" });
      handleCloseDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<BrandingItemPayload> }) =>
      updateBrandingItem(token, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branding-items"] });
      toast({ title: "Branding item updated" });
      handleCloseDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBrandingItem(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branding-items"] });
      toast({ title: "Branding item deleted" });
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

  const openEditDialog = (item: BrandingItemResponse) => {
    setDialogMode("edit");
    setActiveItem(item);
    form.reset({
      title: item.title,
      description: item.description || "",
      externalLink: item.externalLink,
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

  const handleDeleteClick = (item: BrandingItemResponse) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (dialogMode === "create" && !selectedImage) {
      toast({ title: "Please select an image", variant: "destructive" });
      return;
    }

    const payload: BrandingItemPayload = {
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      externalLink: values.externalLink.trim(),
      image: selectedImage!,
    };

    if (dialogMode === "create") {
      await createMutation.mutateAsync(payload);
    } else if (activeItem) {
      const updatePayload: Partial<BrandingItemPayload> = {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        externalLink: values.externalLink.trim(),
      };
      if (selectedImage) updatePayload.image = selectedImage;
      await updateMutation.mutateAsync({ id: activeItem.id, payload: updatePayload });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Branding</h1>
          <p className="text-sm text-slate-400">Manage your branding portfolio items</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Branding
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !items?.length ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-400">
            No branding items yet. Add your first item!
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
                <a
                  href={item.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary flex items-center gap-1 hover:underline mb-4"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Link
                </a>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(item)}
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
            <DialogTitle>{dialogMode === "create" ? "Add Branding Item" : "Edit Branding Item"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "create" ? "Create a new branding item" : "Update branding details"}
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
                      <Input placeholder="Branding title" {...field} />
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
                    <FormLabel>External Link</FormLabel>
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

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Branding Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBranding;
