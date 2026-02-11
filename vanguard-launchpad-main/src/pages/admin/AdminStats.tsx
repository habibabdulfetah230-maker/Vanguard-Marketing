import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchStats, updateStats, type StatsResponse } from "@/lib/api";
import { useAdminAuth } from "@/context/AdminAuthContext";

const AdminStats = () => {
  const { token } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });

  const [formData, setFormData] = useState({
    clients_scaled: "",
    client_retention: "",
    leads_generated: "",
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) => updateStats(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.refetchQueries({ queryKey: ["stats"] });
      toast({ title: "Stats updated successfully" });
    },
  });

  useEffect(() => {
    if (stats) {
      setFormData({
        clients_scaled: stats.clients_scaled,
        client_retention: stats.client_retention,
        leads_generated: stats.leads_generated,
      });
    }
  }, [stats]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: any = {};
    if (formData.clients_scaled.trim()) payload.clients_scaled = formData.clients_scaled.trim();
    if (formData.client_retention.trim()) payload.client_retention = formData.client_retention.trim();
    if (formData.leads_generated.trim()) payload.leads_generated = formData.leads_generated.trim();
    
    updateMutation.mutate(payload);
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Statistics Management</h1>
        <p className="text-sm text-slate-400">Update the numbers displayed on the home page</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Home Page Stats</CardTitle>
          <CardDescription>
            These numbers are displayed in the hero section of your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clients_scaled">Clients Scaled</Label>
                <Input
                  id="clients_scaled"
                  value={formData.clients_scaled}
                  onChange={handleInputChange("clients_scaled")}
                  placeholder="e.g., 150+"
                  disabled={updateMutation.isPending}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client_retention">Client Retention</Label>
                <Input
                  id="client_retention"
                  value={formData.client_retention}
                  onChange={handleInputChange("client_retention")}
                  placeholder="e.g., 98%"
                  disabled={updateMutation.isPending}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="leads_generated">Leads Generated</Label>
                <Input
                  id="leads_generated"
                  value={formData.leads_generated}
                  onChange={handleInputChange("leads_generated")}
                  placeholder="e.g., 5M+"
                  disabled={updateMutation.isPending}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={updateMutation.isPending}
                className="w-full md:w-auto"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Update Stats
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            How these stats will appear on the home page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-lg">
            <div className="text-center space-y-1">
              <p className="text-3xl font-bold text-foreground">
                {formData.clients_scaled || "150+"}
              </p>
              <p className="text-sm text-slate-400">Clients Scaled</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-3xl font-bold text-foreground">
                {formData.client_retention || "98%"}
              </p>
              <p className="text-sm text-slate-400">Client Retention</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-3xl font-bold text-foreground">
                {formData.leads_generated || "5M+"}
              </p>
              <p className="text-sm text-slate-400">Leads Generated</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
