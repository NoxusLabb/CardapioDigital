import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: () => React.JSX.Element;
  adminOnly?: boolean;
}

export function ProtectedRoute({
  path,
  component: Component,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !user ? (
        <Redirect to="/admin/login" />
      ) : adminOnly && !user.isAdmin ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-lg">
            <h1 className="text-2xl font-bold text-primary mb-4">Acesso Restrito</h1>
            <p className="text-text mb-4">
              Esta área é reservada para administradores do sistema.
            </p>
            <Redirect to="/" />
          </div>
        </div>
      ) : (
        <Component />
      )}
    </Route>
  );
}
