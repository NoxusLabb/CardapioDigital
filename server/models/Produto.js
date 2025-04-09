import mongoose from 'mongoose';

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true
  },
  descricao: {
    type: String,
    required: [true, 'Descrição do produto é obrigatória'],
    trim: true
  },
  preco: {
    type: Number,
    required: [true, 'Preço do produto é obrigatório'],
    min: [0, 'Preço não pode ser negativo']
  },
  categoria: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    trim: true
  },
  imagemUrl: {
    type: String,
    required: [true, 'URL da imagem é obrigatória']
  },
  disponivel: {
    type: Boolean,
    default: true
  },
  ingredientes: {
    type: [String],
    default: []
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Produto = mongoose.model('Produto', produtoSchema);

export default Produto;