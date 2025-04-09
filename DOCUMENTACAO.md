# Cardápio Digital - Documentação

## Introdução

Este sistema de cardápio digital foi desenvolvido para restaurantes, oferecendo uma interface pública para visualização de produtos e uma interface administrativa para gerenciamento do cardápio.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

1. **Frontend (cliente)** - Desenvolvido com React, TypeScript, Material UI e Tailwind CSS
2. **Backend (servidor)** - Desenvolvido com Express.js e PostgreSQL

## Acessando o Sistema

### Interface Pública (Cliente)

A interface pública está disponível na rota principal do aplicativo:

```
http://localhost:3000/
```

Nesta interface, os clientes podem:
- Visualizar produtos por categoria
- Ver detalhes dos produtos disponíveis
- Adicionar produtos ao carrinho
- Gerenciar o carrinho (adicionar, remover e alterar quantidades)

### Interface Administrativa (Dashboard)

Para acessar o painel administrativo, utilize a seguinte URL:

```
http://localhost:3000/admin/login
```

Credenciais de acesso:
- Email: admin@exemplo.com
- Senha: senha123

Após o login bem-sucedido, você será redirecionado para:

```
http://localhost:3000/admin/dashboard
```

No dashboard administrativo, você pode:
- Visualizar estatísticas gerais sobre o cardápio
- Gerenciar produtos (adicionar, editar, excluir)
- Ver detalhes dos produtos

## API Backend

O backend fornece uma API RESTful para gerenciar os produtos e categorias.

### Base URL

```
http://localhost:3000/api
```

### Endpoints Disponíveis

#### Autenticação

```
POST /api/usuarios/login        - Login de usuário
POST /api/usuarios              - Registro de novo usuário (somente admin)
GET  /api/usuarios/perfil       - Obter perfil do usuário autenticado
```

#### Produtos

```
GET    /api/produtos            - Listar todos os produtos
GET    /api/produtos/:id        - Obter detalhes de um produto específico
POST   /api/produtos            - Criar novo produto (requer autenticação admin)
PUT    /api/produtos/:id        - Atualizar produto existente (requer autenticação admin)
DELETE /api/produtos/:id        - Excluir produto (requer autenticação admin)
```

#### Categorias

```
GET    /api/categories          - Listar todas as categorias
GET    /api/categories/:slug    - Obter detalhes de uma categoria específica
```

### Autenticação API

Para rotas protegidas, é necessário incluir o token JWT no cabeçalho HTTP:

```
Authorization: Bearer <token>
```

O token é obtido ao fazer login e é automaticamente incluído em todas as requisições subsequentes.

## Solução de Problemas

### Chamadas API Repetidas

Se estiver enfrentando problemas com chamadas repetidas à API:

1. Verifique os dependências nos `useEffect` - certifique-se de incluir apenas as dependências necessárias
2. Utilize o React DevTools para inspecionar os componentes e verificar quando estão remontando
3. Use `useMemo` ou `useCallback` para memoizar funções e valores quando apropriado

### Página "Not Found"

Se estiver vendo a página "Not Found" ao tentar acessar o dashboard:

1. Verifique se está autenticado corretamente - a rota `/admin/dashboard` é protegida
2. Verifique o console do navegador para erros
3. Tente acessar `/admin/login` primeiro e efetuar o login
4. Verifique se o usuário possui a flag `isAdmin: true`

### Erros de CORS

Se enfrentar erros de CORS ao fazer requisições para a API:

1. Verifique se está acessando o frontend na mesma origem do backend
2. O servidor já está configurado para permitir requisições da mesma origem

## Bibliotecas Principais

- **Material UI** - Componentes visuais
- **Axios** - Cliente HTTP para requisições API
- **React Hook Form** - Gerenciamento de formulários
- **TanStack Query** - Gerenciamento de estado de servidor e caching
- **Tailwind CSS** - Utilitários de estilo

## Contato e Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contato com o desenvolvedor.