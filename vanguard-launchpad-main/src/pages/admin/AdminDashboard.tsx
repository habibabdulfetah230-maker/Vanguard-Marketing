import { useQuery } from "@tanstack/react-query";
import { Loader2, Video, Palette, Layers, Briefcase, Users, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchAdminVideoProjects,
  fetchBrandingItems,
  fetchDesignItems,
  fetchFullProjects,
  fetchTestimonials,
  fetchContactSubmissions,
} from "@/lib/api";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { token } = useAdminAuth();

  const { data: videos } = useQuery({
    queryKey: ["admin-video-projects"],
    queryFn: () => fetchAdminVideoProjects(token),
    enabled: !!token,
  });

  const { data: branding } = useQuery({
    queryKey: ["branding-items"],
    queryFn: fetchBrandingItems,
  });

  const { data: design } = useQuery({
    queryKey: ["design-items"],
    queryFn: fetchDesignItems,
  });

  const { data: fullProjects } = useQuery({
    queryKey: ["full-projects"],
    queryFn: fetchFullProjects,
  });

  const { data: testimonials } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });

  const { data: messages } = useQuery({
    queryKey: ["contact-submissions", token],
    queryFn: () => fetchContactSubmissions(token),
    enabled: !!token,
  });

  const stats = [
    { name: "Video Projects", count: videos?.length || 0, icon: Video, path: "/admin/videos", color: "text-red-400" },
    { name: "Branding Items", count: branding?.length || 0, icon: Palette, path: "/admin/branding", color: "text-pink-400" },
    { name: "Design Items", count: design?.length || 0, icon: Layers, path: "/admin/design", color: "text-purple-400" },
    { name: "Full Projects", count: fullProjects?.length || 0, icon: Briefcase, path: "/admin/full-projects", color: "text-blue-400" },
    { name: "Testimonials", count: testimonials?.length || 0, icon: Users, path: "/admin/testimonials", color: "text-green-400" },
    { name: "Messages", count: messages?.length || 0, icon: MessageSquare, path: "/admin/messages", color: "text-yellow-400" },
  ];

  const isLoading = !videos || !branding || !design || !fullProjects || !testimonials || !messages;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-400">Overview of your content</p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.name} to={stat.path}>
                <Card className="hover:bg-white/5 transition-colors cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.count}</div>
                    <p className="text-xs text-slate-400">
                      {stat.count === 1 ? "item" : "items"} total
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-400">
          <p>• Click on any stat card above to manage that section</p>
          <p>• Use the sidebar to navigate between different content types</p>
          <p>• Toggle switches to publish/unpublish content instantly</p>
          <p>• All changes are saved automatically</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
