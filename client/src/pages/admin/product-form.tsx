import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Category, Product, productSchema, InsertProduct } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
}

export default function ProductForm({ product, categories, onClose }: ProductFormProps) {
  const { toast } = useToast();
  const isEditMode = !!product;
  
  const formSchema = productSchema.extend({
    ingredients: z.string().optional().transform(val => {
      if (!val) return [];
      return val.split(',').map(ingredient => ingredient.trim());
    }),
  });

  type FormValues = z.infer<typeof formSchema>;

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      categoryId: product?.categoryId || categories[0]?.id || 0,
      imageUrl: product?.imageUrl || '',
      available: product?.available ?? true,
      ingredients: product?.ingredients ? product.ingredients.join(', ') : '',
    },
  });

  // Create/Update product mutation
  const mutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      if (isEditMode && product) {
        return apiRequest("PUT", `/api/admin/products/${product.id}`, data)
          .then(res => res.json());
      } else {
        return apiRequest("POST", "/api/admin/products", data)
          .then(res => res.json());
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: isEditMode ? "Produto atualizado" : "Produto adicionado",
        description: isEditMode 
          ? "O produto foi atualizado com sucesso." 
          : "O produto foi adicionado com sucesso.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} produto`,
        description: error.message || `Não foi possível ${isEditMode ? 'atualizar' : 'adicionar'} o produto.`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    const productData = {
      ...data,
      // Make sure price is a number
      price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
      // Convert categorical ID to number if it's a string
      categoryId: typeof data.categoryId === 'string' ? parseInt(data.categoryId) : data.categoryId,
    };
    
    mutation.mutate(productData as InsertProduct);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Produto" : "Adicionar Produto"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do produto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0,00" 
                        step="0.01" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Disponibilidade</FormLabel>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição do produto" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredientes (separados por vírgula)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ingrediente 1, Ingrediente 2, ..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://exemplo.com/imagem.jpg" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-secondary hover:bg-secondary/90"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
