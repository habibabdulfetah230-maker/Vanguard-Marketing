import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, Image, Video, Trash2, Edit, Eye, EyeOff, Users, Plus, Trash, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMediaSettings, updateMediaSettings, fetchMediaItems, uploadMedia, updateMediaItem, deleteMediaItem, type MediaSettings, type MediaItem } from "@/lib/mediaApi";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { fetchAdmins, createAdmin, updateAdmin, toggleAdminStatus, deleteAdmin, changeAdminPassword, type AdminUser, type CreateAdminPayload, type UpdateAdminPayload } from "@/lib/adminApi";

const AdminSystemSettings = () => {
  const { token } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["media-settings"],
    queryFn: fetchMediaSettings,
  });

  const { data: mediaItems, isLoading: mediaLoading } = useQuery({
    queryKey: ["media-items"],
    queryFn: fetchMediaItems,
  });

  const { data: admins, isLoading: adminsLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: fetchAdmins,
  });

  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'superadmin'>('admin');
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  const settingsMutation = useMutation({
    mutationFn: updateMediaSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-settings"] });
      toast({ title: "Media settings updated" });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, pages }: { file: File; pages: string[] }) => 
      uploadMedia(file, pages),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-items"] });
      toast({ title: "Media uploaded successfully" });
      setUploadFile(null);
      setSelectedPages([]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, pages, enabled }: { id: string; pages: string[]; enabled: boolean }) =>
      updateMediaItem(id, pages, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-items"] });
      toast({ title: "Media item updated" });
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: (payload: CreateAdminPayload) => createAdmin(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast({ title: "Admin created successfully" });
      setNewAdminEmail('');
      setNewAdminName('');
      setNewAdminPassword('');
      setNewAdminRole('admin');
      setShowAddAdmin(false);
    },
    onError: (error: any) => {
      toast({ title: "Failed to create admin", description: error.message, variant: "destructive" });
    },
  });

  const toggleAdminMutation = useMutation({
    mutationFn: (id: string) => toggleAdminStatus(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast({ title: "Admin status updated" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update admin status", description: error.message, variant: "destructive" });
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: (id: string) => deleteAdmin(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast({ title: "Admin deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete admin", description: error.message, variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => toggleAdminStatus(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast({ title: "Admin status updated" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update admin status", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMediaItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-items"] });
      toast({ title: "Media item deleted" });
    },
  });

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminName || !newAdminPassword) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    createAdminMutation.mutate({
      email: newAdminEmail,
      name: newAdminName,
      password: newAdminPassword,
      role: newAdminRole,
    });
  };

  const handleFileUpload = () => {
    if (!uploadFile) return;
    uploadMutation.mutate({ file: uploadFile, pages: selectedPages });
  };

  const handleToggleMedia = () => {
    settingsMutation.mutate(!settings?.enable_media);
  };

  const filteredMediaItems = mediaItems?.filter(item => 
    selectedPages.length === 0 || item.assigned_pages.some(page => selectedPages.includes(page))
  );

  if (settingsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="text-sm text-slate-400">Manage media visibility and upload content</p>
      </div>

      {/* Global Media Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Global Media Settings</CardTitle>
          <CardDescription>
            Control media visibility across the entire website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable Media</h3>
              <p className="text-sm text-slate-400">
                Turn all images and videos on or off site-wide
              </p>
            </div>
            <Switch
              checked={settings?.enable_media ?? true}
              onCheckedChange={handleToggleMedia}
              disabled={settingsMutation.isPending}
            />
          </div>
        </CardContent>
      </Card>

      {/* Media Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
          <CardDescription>
            Add new images and videos to your media library
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select File</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-800 file:text-slate-100 hover:file:bg-slate-700"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Assign to Pages</label>
            <div className="flex gap-4">
              {['home', 'services', 'portfolio'].map(page => (
                <label key={page} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(page)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPages([...selectedPages, page]);
                      } else {
                        setSelectedPages(selectedPages.filter(p => p !== page));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="capitalize">{page}</span>
                </label>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleFileUpload}
            disabled={!uploadFile || uploadMutation.isPending}
            className="w-full"
          >
            {uploadMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
          </Button>
        </div>

        {showAddAdmin && (
          <div className="border rounded-lg p-4 space-y-4 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="admin-email" className="text-sm font-medium">Email</label>
                <input
                  id="admin-email"
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="admin@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="admin-name" className="text-sm font-medium">Name</label>
                <input
                  id="admin-name"
                  type="text"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Admin Name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="admin-password" className="text-sm font-medium">Password</label>
                <input
                  id="admin-password"
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="admin-role" className="text-sm font-medium">Role</label>
                <select
                  id="admin-role"
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as 'admin' | 'superadmin')}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleCreateAdmin}
                disabled={createAdminMutation.isPending}
              >
                {createAdminMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create Admin
              </Button>
            </div>
          </div>
        )}

        {/* Admin List */}
        <div className="space-y-4">
          {adminsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {admins?.map((admin) => (
                <div key={admin._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Users className="h-8 w-8 text-slate-400" />
                    <div>
                      <p className="font-medium">{admin.name}</p>
                      <p className="text-sm text-slate-400">{admin.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={admin.isActive ? 'default' : 'secondary'}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleMutation.mutate(admin._id)}
                      disabled={toggleMutation.isPending}
                    >
                      {admin.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(admin._id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {admins?.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  No admins found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Media Library */}
        <Card>
          <CardHeader>
            <CardTitle>Media Library</CardTitle>
            <CardDescription>Manage your media files and assign them to specific pages</CardDescription>
          </CardHeader>
          <CardContent>
            {mediaLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMediaItems?.map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {item.media_type === 'image' ? (
                        <Image className="h-8 w-8 text-slate-400" />
                      ) : (
                        <Video className="h-8 w-8 text-slate-400" />
                      )}
                      <div>
                        <p className="font-medium">{item.original_name}</p>
                        <p className="text-sm text-slate-400">
                          {item.assigned_pages.length > 0 ? (
                            <span>Assigned to: {item.assigned_pages.join(', ')}</span>
                          ) : (
                            <span>Not assigned</span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={item.is_enabled ? 'default' : 'secondary'}>
                        {item.is_enabled ? (
                          <><Eye className="h-3 w-3 mr-1" />Enabled</>
                        ) : (
                          <><EyeOff className="h-3 w-3 mr-1" />Disabled</>
                        )}
                      </Badge>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateMutation.mutate({
                          id: item._id,
                          pages: item.assigned_pages,
                          enabled: !item.is_enabled
                        })}
                        disabled={updateMutation.isPending}
                      >
                        {item.is_enabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(item._id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              
                {filteredMediaItems?.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    No media items found
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSystemSettings;
