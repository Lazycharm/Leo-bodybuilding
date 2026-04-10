import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

function FullScreenLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-primary text-xl font-black text-primary-foreground flex items-center justify-center">
          L
        </div>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, isLoadingAuth, user } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    const redirectTo = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/auth?redirectTo=${redirectTo}`} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    const fallbackRoute = user?.role === "admin" ? "/admin" : "/dashboard";
    return <Navigate to={fallbackRoute} replace />;
  }

  return children;
}
