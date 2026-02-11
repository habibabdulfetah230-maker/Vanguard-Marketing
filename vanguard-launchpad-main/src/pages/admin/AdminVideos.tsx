import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, Pencil, Youtube } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAdminVideoProjects,
  createVideoProject,
  updateVideoProject,
  deleteVideoProject,
  type VideoProjectResponse,
  type VideoProjectPayload,
} from "@/lib/api";
import { useAdminAuth } from "@/context/AdminAuthContext";

const videoProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title must be 150 characters or fewer"),
  description: z.string().max(500, "Description must be 500 characters or fewer").optional().or(z.literal("")),
  youtubeUrl: z.string().url("Enter a valid YouTube URL"),
  isPublished: z.boolean().default(true),
});

type VideoProjectFormValues = z.infer<typeof videoProjectSchema>;

const mapProjectToFormValues = (project: VideoProjectResponse): VideoProjectFormValues => ({
  title: project.title,
  description: project.description ?? "",
  youtubeUrl: `https://www.youtube.com/watch?v=${project.youtubeVideoId}`,
  isPublished: project.isPublished ?? true,
});

const extractYouTubeId = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
};

const AdminVideos = () => {
  const { token } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [activeProject, setActiveProject] = useState<VideoProjectResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<VideoProjectResponse | null>(null);

  const { data: videoProjects, isLoading: isLoadingProjects, isError } = useQuery({
    queryKey: ["admin-video-projects"],
    queryFn: () => fetchAdminVideoProjects(token),
    enabled: !!token,
  });

  const form = useForm<VideoProjectFormValues>({
    resolver: zodResolver(videoProjectSchema),
    defaultValues: { title: "", description: "", youtubeUrl: "", isPublished: true },
  });

  const createMutation = useMutation({
    mutationFn: (payload: VideoProjectPayload) => createVideoProject(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-video-projects"] });
      toast({ title: "Video project created" });
      setIsDialogOpen(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<VideoProjectPayload> }) =>
      updateVideoProject(token, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-video-projects"] });
      toast({ title: "Video project updated" });
      setIsDialogOpen(false);
      setActiveProject(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVideoProject(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-video-projects"] });
      queryClient.invalidateQueries({ queryKey: ["published-videos"] });
      toast({ title: "Video project deleted" });
    },
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

  const handleSubmit = form.handleSubmit(async (values) => {
    const youtubeVideoId = extractYouTubeId(values.youtubeUrl);
    if (!youtubeVideoId) {
      toast({ title: "Invalid YouTube URL", variant: "destructive" });
      return;
    }

    const payload: VideoProjectPayload = {
      title: values.title,
      description: values.description?.trim() ? values.description.trim() : undefined,
      youtubeUrl: values.youtubeUrl.trim(),
      isPublished: values.isPublished,
    };

    if (dialogMode === "create") {
      await createMutation.mutateAsync(payload);
    } else if (activeProject) {
      await updateMutation.mutateAsync({ id: activeProject.id, payload });
    }
  });

  const handleTogglePublish = async (project: VideoProjectResponse, nextValue: boolean) => {
    await updateMutation.mutateAsync({
      id: project.id,
      payload: { isPublished: nextValue },
    });
    toast({ title: nextValue ? "Project published" : "Project unpublished" });
  };

  const handleDeleteClick = (project: VideoProjectResponse) => {
    setProjectToDelete(project);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteMutation.mutate(projectToDelete.id);
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Video Projects</h1>
          <p className="text-sm text-slate-400">Manage your YouTube video portfolio</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Video
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Videos</CardTitle>
          <CardDescription>{videoProjects?.length || 0} total projects</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingProjects ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center text-red-400 py-8">Failed to load videos</div>
          ) : !videoProjects?.length ? (
            <div className="text-center text-slate-400 py-8">No videos yet. Add your first video!</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">Description</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videoProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Youtube className="h-4 w-4 text-red-500" />
                          <span className="truncate max-w-[150px] sm:max-w-[200px]">{project.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell max-w-xs truncate text-slate-400">
                        {project.description || "No description"}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={project.isPublished}
                          onCheckedChange={(value) => handleTogglePublish(project, value)}
                        />
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-slate-400">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(project)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === "create" ? "Add Video Project" : "Edit Video Project"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "create" ? "Add a new YouTube video to your portfolio" : "Update video details"}
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
                      <Input placeholder="Video title" {...field} />
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
                name="youtubeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Publish immediately</FormLabel>
                  </FormItem>
                )}
              />
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
            <DialogTitle>Delete Video Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{projectToDelete?.title}"? This action cannot be undone.
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

export default AdminVideos;
