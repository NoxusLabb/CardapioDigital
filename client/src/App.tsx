import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './lib/theme';
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ContaPage from "@/pages/conta-page";
import Dashboard from "@/pages/admin/dashboard";
import ProdutosAdmin from "@/pages/admin/produtos";
import PedidosAdmin from "@/pages/admin/pedidos";
import AdminLogin from "@/pages/admin/login";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { CartProvider } from "./context/CartContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/conta" component={ContaPage} />
      <Route path="/admin/login" component={AdminLogin} />
      <ProtectedRoute path="/admin/dashboard" component={Dashboard} adminOnly={true} />
      <ProtectedRoute path="/admin/produtos" component={ProdutosAdmin} adminOnly={true} />
      <ProtectedRoute path="/admin/pedidos" component={PedidosAdmin} adminOnly={true} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Optamos por ignorar os avisos de propriedades do ThemeProvider
  // pois são apenas warnings gerados pelo ambiente Replit

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CartProvider>
            <Router />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
