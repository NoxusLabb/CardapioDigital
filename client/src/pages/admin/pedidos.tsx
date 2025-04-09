import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order, OrderItem } from '@shared/schema';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from '@/utils/formatCurrency';
import { Loader2, ClipboardList, ChevronRight, Phone, MapPin } from 'lucide-react';

interface OrderWithItems extends Order {
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  'recebido': 'bg-blue-500',
  'em_preparo': 'bg-orange-500',
  'a_caminho': 'bg-purple-500',
  'entregue': 'bg-green-500',
};

const statusLabels: Record<string, string> = {
  'recebido': 'Recebido',
  'em_preparo': 'Em Preparo',
  'a_caminho': 'A Caminho',
  'entregue': 'Entregue',
};

export default function PedidosPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const { data: orders, isLoading } = useQuery<OrderWithItems[]>({
    queryKey: ['/api/admin/orders'],
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });
  
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number, status: string }) => {
      const response = await apiRequest('PATCH', `/api/admin/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status atualizado",
        description: "Status do pedido atualizado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleStatusChange = (orderId: number, status: string) => {
    updateStatusMutation.mutate({ orderId, status });
  };

  // Filtra os pedidos pelo status, se houver um filtro selecionado
  const filteredOrders = statusFilter
    ? orders?.filter(order => order.status === statusFilter)
    : orders;
  
  if (isLoading) {
    return (
      <AdminLayout title="Gerenciamento de Pedidos">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gerenciamento de Pedidos">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedidos Recebidos</h1>
        
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter || ''}
            onValueChange={(value) => setStatusFilter(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="recebido">Recebido</SelectItem>
              <SelectItem value="em_preparo">Em Preparo</SelectItem>
              <SelectItem value="a_caminho">A Caminho</SelectItem>
              <SelectItem value="entregue">Entregue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredOrders?.length === 0 ? (
        <div className="text-center p-10 border rounded-lg bg-muted/20">
          <ClipboardList className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium">Nenhum pedido encontrado</h3>
          <p className="text-muted-foreground">
            {statusFilter 
              ? `Não há pedidos com o status "${statusLabels[statusFilter]}".`
              : 'Ainda não há pedidos registrados no sistema.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          <Accordion type="multiple" className="space-y-4">
            {filteredOrders?.map((order) => (
              <AccordionItem 
                key={order.id} 
                value={order.id.toString()}
                className="border rounded-lg overflow-hidden"
              >
                <div className={`${statusColors[order.status]} h-1 w-full`}></div>
                <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(order.totalPrice)}</div>
                      <div className="text-sm text-muted-foreground">{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</div>
                    </div>
                    
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                      disabled={updateStatusMutation.isPending}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recebido">Recebido</SelectItem>
                        <SelectItem value="em_preparo">Em Preparo</SelectItem>
                        <SelectItem value="a_caminho">A Caminho</SelectItem>
                        <SelectItem value="entregue">Entregue</SelectItem>
                      </SelectContent>
                    </Select>
                    <AccordionTrigger className="ml-2 !no-underline"></AccordionTrigger>
                  </div>
                </div>

                <AccordionContent className="px-4 pb-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Dados do Cliente</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            {order.customerPhone}
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <div className="font-medium flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            Endereço de Entrega
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.street}, {order.number}
                            {order.complement ? `, ${order.complement}` : ''}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.neighborhood}, {order.city}/{order.state}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            CEP: {order.zipCode}
                          </div>
                        </div>
                        
                        {order.notes && (
                          <div className="pt-2">
                            <div className="font-medium">Observações</div>
                            <div className="text-sm text-muted-foreground">{order.notes}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Itens do Pedido</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-start py-2 border-b last:border-0">
                              <div className="flex-1">
                                <div className="font-medium">{item.productName}</div>
                                <div className="text-sm text-muted-foreground">
                                  {item.quantity} x {formatCurrency(item.unitPrice)}
                                </div>
                                {item.notes && (
                                  <div className="text-xs italic text-muted-foreground mt-1">
                                    "{item.notes}"
                                  </div>
                                )}
                              </div>
                              <div className="font-medium">
                                {formatCurrency(item.quantity * item.unitPrice)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="font-medium">Total</div>
                        <div className="font-bold text-lg">{formatCurrency(order.totalPrice)}</div>
                      </CardFooter>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </AdminLayout>
  );
}