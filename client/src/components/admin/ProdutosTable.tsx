import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2, Search, ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Interface para os produtos vindos da API (Drizzle)
interface DrizzleProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl: string;
  available: boolean;
  ingredients: string[];
  createdAt: string;
  category?: string;
}

// Interface para o formato antigo de produtos (UI)
interface ProdutoUI {
  _id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagemUrl: string;
  disponivel: boolean;
  ingredientes: string[];
  // Campos adicionais
  estoqueQuantidade?: number;
  estoqueMinimo?: number;
  precoCusto?: number;
  peso?: number;
  destaque?: boolean;
  descontoPercentual?: number;
  tags?: string[];
}

interface ProdutosTableProps {
  produtos: any[]; // Aceitamos qualquer formato de produto
  loading: boolean;
  onEdit: (produto: any) => void;
  onDelete: (id: string) => void;
  onView: (produto: any) => void;
}

export default function ProdutosTable({
  produtos,
  loading,
  onEdit,
  onDelete,
  onView,
}: ProdutosTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState<string | null>(null);
  const [produtosFormatados, setProdutosFormatados] = useState<ProdutoUI[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ProdutoUI | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Formatar produtos para interface UI
  useEffect(() => {
    if (produtos && produtos.length > 0) {
      const formatados = produtos.map(produto => {
        // Verificar o formato do produto baseado nas propriedades
        if ('id' in produto) {
          // É um produto da API Drizzle
          const drizzleProduto = produto as DrizzleProduct;
          return {
            _id: String(drizzleProduto.id),
            nome: drizzleProduto.name,
            descricao: drizzleProduto.description,
            preco: drizzleProduto.price,
            categoria: drizzleProduto.category || String(drizzleProduto.categoryId),
            imagemUrl: drizzleProduto.imageUrl,
            disponivel: drizzleProduto.available,
            ingredientes: drizzleProduto.ingredients || [],
          };
        } else {
          // É um produto já no formato antigo, não precisa converter
          return produto as ProdutoUI;
        }
      });
      setProdutosFormatados(formatados);
    } else {
      setProdutosFormatados([]);
    }
  }, [produtos]);

  const handleDeleteClick = (id: string) => {
    setProdutoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (produtoToDelete) {
      onDelete(produtoToDelete);
      setDeleteDialogOpen(false);
      setProdutoToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setProdutoToDelete(null);
  };

  const handleSort = (key: keyof ProdutoUI) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredProducts = produtosFormatados.filter(produto => 
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];
    
    if (valueA === valueB) return 0;
    
    // Handle string comparison
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      const result = valueA.localeCompare(valueB);
      return sortConfig.direction === 'asc' ? result : -result;
    }
    
    // Handle number comparison
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      const result = valueA < valueB ? -1 : 1;
      return sortConfig.direction === 'asc' ? result : -result;
    }
    
    // Handle boolean comparison
    if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
      const result = valueA === valueB ? 0 : valueA ? -1 : 1;
      return sortConfig.direction === 'asc' ? result : -result;
    }
    
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar produtos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('nome')}>
                <div className="flex items-center space-x-1">
                  <span>Nome</span>
                  {sortConfig.key === 'nome' && (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('categoria')}>
                <div className="flex items-center space-x-1">
                  <span>Categoria</span>
                  {sortConfig.key === 'categoria' && (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('preco')}>
                <div className="flex items-center space-x-1">
                  <span>Preço</span>
                  {sortConfig.key === 'preco' && (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('disponivel')}>
                <div className="flex items-center space-x-1">
                  <span>Disponível</span>
                  {sortConfig.key === 'disponivel' && (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Carregando produtos...
                </TableCell>
              </TableRow>
            ) : sortedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              sortedProducts.map((produto) => (
                <TableRow key={produto._id}>
                  <TableCell>
                    <img
                      src={produto.imagemUrl}
                      alt={produto.nome}
                      className="h-12 w-12 rounded-md object-cover"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = 'https://via.placeholder.com/50x50?text=Erro';
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{produto.nome}</TableCell>
                  <TableCell>{produto.categoria}</TableCell>
                  <TableCell>{formatCurrency(produto.preco)}</TableCell>
                  <TableCell>
                    <Badge variant={produto.disponivel ? "success" : "destructive"}>
                      {produto.disponivel ? 'Sim' : 'Não'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <span className="sr-only">Abrir menu</span>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(produto)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Visualizar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(produto)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(produto._id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}