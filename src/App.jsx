import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { queryClientInstance } from "@/lib/query-client";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PageNotFound from "./lib/PageNotFound";

// Layouts
import PublicLayout from "./components/public/PublicLayout";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import AdminLayout from "./components/admin/AdminLayout";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import HealthPrograms from "./pages/HealthPrograms";
import Trainers from "./pages/Trainers";
import Plans from "./pages/Plans";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";

// Member pages
import MemberDashboard from "./pages/member/MemberDashboard";
import MemberProfile from "./pages/member/MemberProfile";
import MemberMembership from "./pages/member/MemberMembership";
import MemberSchedule from "./pages/member/MemberSchedule";
import MemberAnnouncements from "./pages/member/MemberAnnouncements";
import MemberSupport from "./pages/member/MemberSupport";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminTrainers from "./pages/admin/AdminTrainers";
import AdminPrograms from "./pages/admin/AdminPrograms";
import AdminHealthPrograms from "./pages/admin/AdminHealthPrograms";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminSchedules from "./pages/admin/AdminSchedules";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminHomepageMedia from "./pages/admin/AdminHomepageMedia";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";

const FullScreenLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center font-black text-primary-foreground text-xl">L</div>
      <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
    </div>
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();
  const location = useLocation();
  const isProtectedRoute = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin");

  if (isProtectedRoute && (isLoadingPublicSettings || isLoadingAuth)) {
    return <FullScreenLoader />;
  }

  if (authError?.type === "user_not_registered") {
    return <UserNotRegisteredError />;
  }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/health-programs" element={<HealthPrograms />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/auth" element={<Auth />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={["member", "trainer", "admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<MemberDashboard />} />
        <Route path="/dashboard/profile" element={<MemberProfile />} />
        <Route path="/dashboard/membership" element={<MemberMembership />} />
        <Route path="/dashboard/schedule" element={<MemberSchedule />} />
        <Route path="/dashboard/announcements" element={<MemberAnnouncements />} />
        <Route path="/dashboard/support" element={<MemberSupport />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/members" element={<AdminMembers />} />
        <Route path="/admin/trainers" element={<AdminTrainers />} />
        <Route path="/admin/programs" element={<AdminPrograms />} />
        <Route path="/admin/health-programs" element={<AdminHealthPrograms />} />
        <Route path="/admin/plans" element={<AdminPlans />} />
        <Route path="/admin/schedules" element={<AdminSchedules />} />
        <Route path="/admin/gallery" element={<AdminGallery />} />
        <Route path="/admin/homepage-media" element={<AdminHomepageMedia />} />
        <Route path="/admin/testimonials" element={<AdminTestimonials />} />
        <Route path="/admin/inquiries" element={<AdminInquiries />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;