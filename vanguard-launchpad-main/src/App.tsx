import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MediaProvider } from "@/context/MediaContext";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminBranding from "./pages/admin/AdminBranding";
import AdminDesign from "./pages/admin/AdminDesign";
import AdminFullProjects from "./pages/admin/AdminFullProjects";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminClearAll from "./pages/admin/AdminClearAll";
import AdminSystemSettings from "./pages/admin/AdminSystemSettings";
import AdminStats from "./pages/admin/AdminStats";
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedRoute from "./routes/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MediaProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/videos" element={<AdminVideos />} />
              <Route path="/admin/branding" element={<AdminBranding />} />
              <Route path="/admin/design" element={<AdminDesign />} />
              <Route path="/admin/full-projects" element={<AdminFullProjects />} />
              <Route path="/admin/testimonials" element={<AdminTestimonials />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/clear-all" element={<AdminClearAll />} />
              <Route path="/admin/settings" element={<AdminSystemSettings />} />
              <Route path="/admin/stats" element={<AdminStats />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </MediaProvider>
  </QueryClientProvider>
);

export default App;
