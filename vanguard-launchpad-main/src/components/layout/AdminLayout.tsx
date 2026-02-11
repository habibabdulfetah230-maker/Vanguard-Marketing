import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  LayoutDashboard,
  Video,
  Palette,
  Layers,
  Briefcase,
  MessageSquare,
  Users,
  Menu,
  LogOut,
  Trash2,
  Settings,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Video Projects", path: "/admin/videos", icon: Video },
  { name: "Branding", path: "/admin/branding", icon: Palette },
  { name: "Design", path: "/admin/design", icon: Layers },
  { name: "Full Projects", path: "/admin/full-projects", icon: Briefcase },
  { name: "Testimonials", path: "/admin/testimonials", icon: Users },
  { name: "Messages", path: "/admin/messages", icon: MessageSquare },
  { name: "Statistics", path: "/admin/stats", icon: BarChart3 },
  { name: "System Settings", path: "/admin/settings", icon: Settings },
];

const AdminLayout = () => {
  const { logout, admin } = useAdminAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const NavContent = () => (
    <div className="flex h-full flex-col gap-6">
      <div className="px-4 py-6">
        <p className="text-xs uppercase tracking-[0.2em] text-primary/80">Vanguard</p>
        <h2 className="mt-1 text-xl font-semibold">Admin Panel</h2>
        {admin && (
          <p className="mt-2 text-xs text-slate-400 truncate">{admin.email}</p>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/20 text-primary shadow-sm"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start text-xs"
          onClick={() => navigate("/admin/clear-all")}
        >
          <Trash2 className="mr-2 h-3 w-3" />
          Clear All Data
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-xs text-slate-400 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-3 w-3" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary/80">Vanguard</p>
          <h1 className="text-lg font-semibold">Admin</h1>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-slate-900 border-white/10 p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 min-h-screen border-r border-white/10 bg-slate-900/50 sticky top-0">
          <NavContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
