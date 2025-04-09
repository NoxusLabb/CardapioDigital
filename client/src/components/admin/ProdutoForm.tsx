import React, { useState, useEffect } from 'react';
import { X, DollarSign, Percent, Weight, Hash } from 'lucide-react';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/ui/file-upload";

interface Produto {
  _id?: string;
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagemUrl: string;
  disponivel: boolean;
  ingredientes: string[];
  // Novos campos
  estoqueQuantidade: number;
  estoqueMinimo: number;
  precoCusto: number;
  peso: number;
  destaque: boolean;
  descontoPercentual: number;
  tags: string[];
}

interface ProdutoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (produto: Produto) => void;
  produto?: Produto | null;
  categorias: string[];
}

const defaultProduto: Produto = {
  nome: '',
  descricao: '',
  preco: 0,
  categoria: '',
  imagemUrl: '',
  disponivel: true,
  ingredientes: [],
  // Valores padrão para os novos campos
  estoqueQuantidade: 0,
  estoqueMinimo: 5,
  precoCusto: 0,
  peso: 0,
  destaque: false,
  descontoPercentual: 0,
  tags: [],
};

export default function ProdutoForm({
  open,
  onClose,
  onSubmit,
  produto,
  categorias = [],
}: ProdutoFormProps) {
  const [formData, setFormData] = useState<Produto>(defaultProduto);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [novoIngrediente, setNovoIngrediente] = useState('');
  const [novaTag, setNovaTag] = useState('');

  useEffect(() => {
    if (produto) {
      setFormData(produto);
    } else {
      setFormData(defaultProduto);
    }
  }, [produto]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Limpar erro do campo alterado
    if (erros[name]) {
      setErros({
        ...erros,
        [name]: '',
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      categoria: value,
    });
    
    // Limpar erro do campo categoria
    if (erros.categoria) {
      setErros({
        ...erros,
        categoria: '',
      });
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    setFormData({
      ...formData,
      [name]: isNaN(numValue) ? 0 : numValue,
    });
    
    // Limpar erro do campo se existir
    if (erros[name]) {
      setErros({
        ...erros,
        [name]: '',
      });
    }
  };

  const handleImageChange = (base64: string) => {
    setFormData({
      ...formData,
      imagemUrl: base64,
    });
    
    if (erros.imagemUrl) {
      setErros({
        ...erros,
        imagemUrl: '',
      });
    }
  };

  const handleIngredienteChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && novoIngrediente.trim() !== '') {
      e.preventDefault();
      
      if (!formData.ingredientes.includes(novoIngrediente.trim())) {
        setFormData({
          ...formData,
          ingredientes: [...formData.ingredientes, novoIngrediente.trim()],
        });
      }
      
      setNovoIngrediente('');
    }
  };

  const handleIngredienteDelete = (ingredienteToDelete: string) => {
    setFormData({
      ...formData,
      ingredientes: formData.ingredientes.filter(
        (ingrediente) => ingrediente !== ingredienteToDelete
      ),
    });
  };
  
  const handleTagChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && novaTag.trim() !== '') {
      e.preventDefault();
      
      if (!formData.tags.includes(novaTag.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, novaTag.trim()],
        });
      }
      
      setNovaTag('');
    }
  };
  
  const handleTagDelete = (tagToDelete: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(
        (tag) => tag !== tagToDelete
      ),
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.descricao.trim()) {
      errors.descricao = 'Descrição é obrigatória';
    }
    
    if (formData.preco <= 0) {
      errors.preco = 'Preço deve ser maior que zero';
    }
    
    if (!formData.categoria) {
      errors.categoria = 'Categoria é obrigatória';
    }
    
    if (!formData.imagemUrl) {
      errors.imagemUrl = 'Imagem é obrigatória';
    }
    
    setErros(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Converter para o formato esperado pela API
      const produtoToSubmit = {
        ...formData,
        name: formData.nome,
        description: formData.descricao,
        price: formData.preco,
        categoryId: categorias.indexOf(formData.categoria) + 1,
        imageUrl: formData.imagemUrl,
        available: formData.disponivel,
        ingredients: formData.ingredientes,
      };
      
      onSubmit(produtoToSubmit);
    }
  };

  // Preparar os itens de categoria com ID numérico
  const categoriasItems = categorias.map((cat, index) => ({
    id: index + 1,
    name: cat
  }));

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogHeader>
        <DialogTitle>
          {produto && (produto._id || produto.id) ? 'Editar Produto' : 'Novo Produto'}
        </DialogTitle>
        <DialogDescription>
          Preencha os dados do produto abaixo. Os campos com * são obrigatórios.
        </DialogDescription>
      </DialogHeader>
      
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={erros.nome ? "border-destructive" : ""}
                required
              />
              {erros.nome && (
                <p className="text-sm text-destructive">{erros.nome}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select
                value={formData.categoria}
                onValueChange={handleSelectChange}
                required
              >
                <SelectTrigger id="categoria" className={erros.categoria ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasItems.length > 0 ? (
                    categoriasItems.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="semCategoria">Sem categorias disponíveis</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {erros.categoria && (
                <p className="text-sm text-destructive">{erros.categoria}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={4}
              className={erros.descricao ? "border-destructive" : ""}
              required
            />
            {erros.descricao && (
              <p className="text-sm text-destructive">{erros.descricao}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco">Preço *</Label>
              <div className="relative">
                <DollarSign className="h-4 w-4 absolute left-2 top-3 text-muted-foreground" />
                <Input
                  id="preco"
                  name="preco"
                  type="number"
                  value={formData.preco}
                  onChange={handleNumberChange}
                  step="0.01"
                  min="0"
                  className={`pl-8 ${erros.preco ? "border-destructive" : ""}`}
                  required
                />
              </div>
              {erros.preco && (
                <p className="text-sm text-destructive">{erros.preco}</p>
              )}
            </div>
            
            <div className="space-y-4 flex flex-col justify-center py-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="disponivel"
                  checked={formData.disponivel}
                  onCheckedChange={(checked) => handleSwitchChange('disponivel', checked)}
                />
                <Label htmlFor="disponivel">Disponível</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="destaque"
                  checked={formData.destaque}
                  onCheckedChange={(checked) => handleSwitchChange('destaque', checked)}
                />
                <Label htmlFor="destaque">Produto em Destaque</Label>
              </div>
            </div>
          </div>

          <FileUpload
            label="Imagem do Produto *"
            value={formData.imagemUrl}
            onChange={handleImageChange}
            error={erros.imagemUrl}
          />

          <div className="space-y-2">
            <Label>Ingredientes</Label>
            <Input
              placeholder="Adicionar ingrediente (pressione Enter)"
              value={novoIngrediente}
              onChange={(e) => setNovoIngrediente(e.target.value)}
              onKeyDown={handleIngredienteChange}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.ingredientes && formData.ingredientes.map((ingrediente) => (
                <Badge 
                  key={ingrediente} 
                  variant="outline"
                  className="px-3 py-1"
                >
                  {ingrediente}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => handleIngredienteDelete(ingrediente)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precoCusto">Preço de Custo</Label>
              <div className="relative">
                <DollarSign className="h-4 w-4 absolute left-2 top-3 text-muted-foreground" />
                <Input
                  id="precoCusto"
                  name="precoCusto"
                  type="number"
                  value={formData.precoCusto}
                  onChange={handleNumberChange}
                  step="0.01"
                  min="0"
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descontoPercentual">Desconto</Label>
              <div className="relative">
                <Percent className="h-4 w-4 absolute left-2 top-3 text-muted-foreground" />
                <Input
                  id="descontoPercentual"
                  name="descontoPercentual"
                  type="number"
                  value={formData.descontoPercentual}
                  onChange={handleNumberChange}
                  step="1"
                  min="0"
                  max="100"
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estoqueQuantidade">Quantidade em Estoque</Label>
              <div className="relative">
                <Hash className="h-4 w-4 absolute left-2 top-3 text-muted-foreground" />
                <Input
                  id="estoqueQuantidade"
                  name="estoqueQuantidade"
                  type="number"
                  value={formData.estoqueQuantidade}
                  onChange={handleNumberChange}
                  step="1"
                  min="0"
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
              <div className="relative">
                <Hash className="h-4 w-4 absolute left-2 top-3 text-muted-foreground" />
                <Input
                  id="estoqueMinimo"
                  name="estoqueMinimo"
                  type="number"
                  value={formData.estoqueMinimo}
                  onChange={handleNumberChange}
                  step="1"
                  min="0"
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="peso">Peso (g)</Label>
            <div className="relative">
              <Weight className="h-4 w-4 absolute left-2 top-3 text-muted-foreground" />
              <Input
                id="peso"
                name="peso"
                type="number"
                value={formData.peso}
                onChange={handleNumberChange}
                step="1"
                min="0"
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <Input
              placeholder="Adicionar tag (pressione Enter)"
              value={novaTag}
              onChange={(e) => setNovaTag(e.target.value)}
              onKeyDown={handleTagChange}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags && formData.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="px-3 py-1"
                >
                  {tag}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => handleTagDelete(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </form>
      </DialogContent>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          {produto && (produto._id || produto.id) ? 'Atualizar' : 'Criar'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}