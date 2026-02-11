import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, AlertTriangle, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  clearAllVideoProjects,
  clearAllBrandingItems,
  clearAllFullProjects,
  clearAllDesignItems,
  clearAllTestimonials,
  clearAllContactSubmissions,
} from "@/lib/api";
import { useAdminAuth } from "@/context/AdminAuthContext";

const AdminClearAll = () => {
  const { token } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [confirmed, setConfirmed] = useState(false);
  const [step, setStep] = useState<"confirm" | "success">("confirm");

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        clearAllVideoProjects(token),
        clearAllBrandingItems(token),
        clearAllFullProjects(token),
        clearAllDesignItems(token),
        clearAllTestimonials(token),
        clearAllContactSubmissions(token),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setStep("success");
      toast({ title: "All data cleared successfully" });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to clear data";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const handleClearAll = () => {
    if (!confirmed) return;
    clearAllMutation.mutate();
  };

  if (step === "success") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Clear All Data</h1>
          <p className="text-sm text-slate-400">Data cleanup complete</p>
        </div>

        <Card className="border-green-500/20 bg-green-500/10">
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
            <h2 className="text-xl font-semibold text-green-400 mb-2">All Data Cleared!</h2>
            <p className="text-slate-300 mb-6">
              All videos, branding, design, projects, testimonials, and messages have been deleted.
            </p>
            <Button onClick={() => setStep("confirm")} variant="outline">
              Clear More Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Clear All Data</h1>
        <p className="text-sm text-slate-400">Permanently delete all content</p>
      </div>

      <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning: Destructive Action</AlertTitle>
        <AlertDescription>
          This will permanently delete ALL data including videos, branding items, design items, 
          full projects, testimonials, and contact messages. This action cannot be undone.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>What will be deleted:</CardTitle>
          <CardDescription>The following content will be permanently removed</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-400" />
              All video projects
            </li>
            <li className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-400" />
              All branding items
            </li>
            <li className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-400" />
              All design items
            </li>
            <li className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-400" />
              All full projects
            </li>
            <li className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-400" />
              All testimonials
            </li>
            <li className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-400" />
              All contact messages
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Confirmation Required</CardTitle>
          <CardDescription>Please confirm you understand the consequences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked as boolean)}
            />
            <label
              htmlFor="confirm"
              className="text-sm text-slate-300 leading-none cursor-pointer"
            >
              I understand that this will permanently delete all data and cannot be undone.
            </label>
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleClearAll}
            disabled={!confirmed || clearAllMutation.isPending}
          >
            {clearAllMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Clearing all data...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Data Permanently
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminClearAll;
