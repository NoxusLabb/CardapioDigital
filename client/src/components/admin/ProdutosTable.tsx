import React, { useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from '@mui/x-data-grid';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { formatCurrency } from '@/utils/formatCurrency';

interface Produto {
  _id: string;
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

interface ProdutosTableProps {
  produtos: Produto[];
  loading: boolean;
  onEdit: (produto: Produto) => void;
  onDelete: (id: string) => void;
  onView: (produto: Produto) => void;
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

  const columns: GridColDef[] = [
    {
      field: 'imagemUrl',
      headerName: 'Imagem',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          component="img"
          sx={{
            height: 50,
            width: 50,
            borderRadius: '4px',
            objectFit: 'cover',
          }}
          alt={params.row.nome}
          src={params.row.imagemUrl}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = 'https://via.placeholder.com/50x50?text=Erro';
          }}
        />
      ),
    },
    { field: 'nome', headerName: 'Nome', flex: 1, minWidth: 150 },
    { field: 'categoria', headerName: 'Categoria', width: 130 },
    {
      field: 'preco',
      headerName: 'Preço',
      width: 110,
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      field: 'disponivel',
      headerName: 'Disponível',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? 'Sim' : 'Não'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Visualizar">
            <IconButton
              onClick={() => onView(params.row)}
              size="small"
              color="primary"
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton
              onClick={() => onEdit(params.row)}
              size="small"
              color="secondary"
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              onClick={() => handleDeleteClick(params.row._id)}
              size="small"
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ height: 'calc(100vh - 220px)', width: '100%' }}>
        <DataGrid
          rows={produtos}
          getRowId={(row) => row._id}
          columns={columns}
          loading={loading}
          autoPageSize
          density="standard"
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
            },
          }}
        />
      </Box>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}