import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, LogOut, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ContaPage() {
  const { user, isLoading, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Se não estiver autenticado, redirecionar para a página de login
  if (!isLoading && !user) {
    return <Redirect to="/auth" />;
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Minha Conta</h1>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.username}&background=random`} />
                <AvatarFallback><UserIcon className="h-8 w-8" /></AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{user?.username}</CardTitle>
                <CardDescription>
                  ID: {user?.id}
                  {user?.isAdmin && (
                    <Badge className="ml-2 bg-primary" variant="default">Administrador</Badge>
                  )}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Informações da Conta</h3>
                  <div className="grid gap-2">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">Tipo de Conta</span>
                      <span>{user?.isAdmin ? 'Administrador' : 'Cliente'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">Status</span>
                      <span className="text-green-600">Ativo</span>
                    </div>
                  </div>
                </div>

                {user?.isAdmin && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Acesso</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="mb-2">Como administrador, você tem acesso ao painel administrativo para gerenciar produtos e categorias.</p>
                      <Button 
                        variant="secondary" 
                        className="mt-2"
                        onClick={() => window.location.href = '/admin/dashboard'}
                      >
                        Acessar Painel Administrativo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saindo...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair da Conta
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}