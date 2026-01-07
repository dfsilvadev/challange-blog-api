# 🚀 Challenge Blog API

API RESTful para gerenciamento de posts, usuários e categorias de um blog.

[📄 Documentação Técnica (Design Doc)](docs/DESIGN.md)

## Features

- CRUD de posts, usuários e categorias
- Autenticação JWT
- Validação de dados com middlewares
- Paginação e filtros
- Testes unitários e de integração
- Docker e Docker Compose para ambiente isolado

Esta API foi desenvolvida para gerenciar um sistema de blog educacional com funcionalidades de usuários, posts e categorias. O projeto utiliza uma arquitetura limpa com separação de responsabilidades e implementa boas práticas de desenvolvimento.

## 🛠️ Tecnologias Utilizadas

### Backend

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação tipada
- **Express.js** - Framework web para Node.js
- **PostgreSQL** - Banco de dados relacional
- **pg** - Cliente PostgreSQL para Node.js
- **JWT** - Auntenticação via JWT

### Desenvolvimento e Qualidade

- **Jest** - Framework de testes
- **ESLint** - Linter para JavaScript/TypeScript
- **Prettier** - Formatador de código
- **Husky** - Git hooks
- **lint-staged** - Linting de arquivos staged
- **Docker** - Containerização

## 🏗️ Arquitetura do Projeto

```
src/
├── app/
│   ├── controllers/     # Controladores da aplicação
│   ├── middlewares/     # Middlewares customizados
│   ├── repositories/    # Camada de acesso a dados
│   ├── routes/          # Definição de rotas
│   └── utils/           # Utilitários da aplicação
├── database/
│   ├── db.ts           # Configuração da conexão com banco
│   └── models/
│       └── schema.sql  # Schema do banco de dados
├── utils/
│   └── config/
│       └── config.ts   # Configurações da aplicação
└── main.ts             # Ponto de entrada da aplicação
```

## 📊 Estrutura do Banco de Dados

O projeto utiliza PostgreSQL com as seguintes tabelas principais:

- **tb_user** - Usuários do sistema
- **tb_post** - Posts do blog
- **tb_category** - Categorias dos posts
- **tb_role** - Papéis dos usuários (admin, teacher, student)

### Categorias Disponíveis

- Portuguese
- Mathematics
- History
- Geography
- Science
- Art
- Physical Education

## 🚀 Como Executar

### Pré-requisitos

- Node.js 16+
- PostgreSQL
- Docker

### Instalação Local

1. **Clone o repositório**

```bash
git clone https://github.com/dfsilvadev/challange-blog-api.git
cd challange-blog-api
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgres://<DB_USER>:<DB_PASSWORD>@db:5432/<DB_NAME>

# POSTGRES
POSTGRES_USER='<DB_USER>'
POSTGRES_PASSWORD='<DB_PASSWORD>'
POSTGRES_DB='<DB_NAME>'

# JWT
JWT_SECRET='<Key>'

# EXPRESS
PORT=3001
NODE_ENV=development
```

4. **Execute a aplicação**

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

### Execução com Docker

1. **Execute com Docker Compose**

```bash
# Primeira execução ou após mudanças
docker compose up --build

# Execuções subsequentes
docker compose up -d

# Teste de fluxo da execução do Docker
docker build --progress=plain .
```

A aplicação estará disponível em:

- API: http://localhost:3001

Como acessar a API a partir do Expo (React Native):

- Android emulator (AVD): use `http://10.0.2.2:3001`
- iOS simulator: use `http://localhost:3001`
- Dispositivo físico (mesma rede): use `http://<IP_DO_SEU_PC>:3001` (ex.: `http://192.168.0.42:3001`)

Observação: certifique-se de que o firewall do Windows permite conexões na porta `3001` e que o container Docker está em execução.

#### Estrutura do Banco

Após conectar, você verá:

```
blog_db/
├── Schemas/
│   └── public/
│       ├── Tables/
│       │   ├── tb_user
│       │   ├── tb_post
│       │   ├── tb_category
│       │   └── tb_role
│       ├── Types/
│       │   ├── tb_role_enum
│       │   └── tb_category_enum
│       └── Functions/
│           └── set_updated_at()
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Executa em modo desenvolvimento
npm run build        # Compila o TypeScript
npm start           # Executa em produção

# Qualidade de Código
npm run lint        # Executa o ESLint
npm run lint:fix    # Corrige problemas do ESLint
npm run format      # Formata o código com Prettier

# Testes
npm test            # Executa os testes
npm run test:watch  # Executa testes em modo watch
npm run test:coverage # Executa testes com cobertura
```

## 🔌 Endpoints da API

### Usuários

- `GET /users` - Lista todos os usuários
- `POST /users` - Cria um novo usuário

### Exemplo de Uso

```bash
# Listar usuários
curl http://localhost:3001/users

# Criar usuário
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "age": 25}'
```

## 🧪 Testes

O projeto utiliza Jest para testes automatizados:

```bash
# Executar todos os testes
npm test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo watch
npm run test:watch
```

## 🔧 Configuração de Desenvolvimento

### ESLint

O projeto utiliza ESLint com configurações customizadas para TypeScript e boas práticas.

### Prettier

Formatação automática de código configurada para manter consistência.

### Git Hooks

- **Husky** - Configura hooks do Git
- **lint-staged** - Executa linting apenas em arquivos modificados

## 📦 Estrutura de Dependências

### Dependências Principais

- `express` - Framework web
- `cors` - Middleware para CORS
- `dotenv` - Gerenciamento de variáveis de ambiente
- `pg` - Cliente PostgreSQL
- `express-validator` - Validação de dados

### Dependências de Desenvolvimento

- `typescript` - Compilador TypeScript
- `jest` - Framework de testes
- `eslint` - Linter
- `prettier` - Formatador
- `husky` - Git hooks

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Daniel Silva**

- Email: dfsilva.dxp@gmail.com
- GitHub: [@dfsilvadev](https://github.com/dfsilvadev)

## 🔮 Próximos Passos

- [x] Implementar autenticação JWT
- [ ] Adicionar validação de dados com express-validator
- [ ] Implementar upload de imagens
- [ ] Adicionar documentação com Swagger

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!

## 📚 Funcionalidades

- Cadastro e autenticação de usuários (JWT)
- CRUD de posts (criação, listagem, atualização, deleção)
- CRUD de categorias
- Filtros por usuário, categoria, paginação e ordenação
- Validação de dados com middlewares
- Testes automatizados
- Docker para ambiente isolado

---

## 🔑 Autenticação

A API utiliza autenticação JWT.
Para acessar rotas protegidas, obtenha um token via `/auth/login` e envie no header:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## 📖 Rotas Principais

| Método | Endpoint    | Descrição                     | Autenticação | Payload/Query                                         |
| ------ | ----------- | ----------------------------- | ------------ | ----------------------------------------------------- |
| POST   | /auth/login | Login e obtenção de token JWT | Não          | `{ username, password }`                              |
| GET    | /posts      | Listar posts ativos           | Não          | `?page&limit&orderBy`                                 |
| GET    | /posts/:id  | Buscar post por ID            | Não          |                                                       |
| POST   | /posts      | Criar novo post               | Sim          | `{ title, content, is_active, user_id, category_id }` |
| PATCH  | /posts/:id  | Atualizar post                | Sim          | `{ title?, content?, is_active?, category_id? }`      |
| DELETE | /posts/:id  | Remover post                  | Sim          |                                                       |
| GET    | /users/:id  | Buscar usuário por ID         | Sim          |                                                       |
| POST   | /users      | Criar usuário                 | Não          | `{ name, email, password, ... }`                      |
| ...    | ...         | ...                           | ...          | ...                                                   |

---

## 📝 Exemplos de Payloads

### Login

```json
POST /auth/login
{
  "username": "dfsilva@email.com",
  "password": "SENHA_AQUI"
}
```

### Criar Post

```json
POST /posts
{
  "title": "Novo Post",
  "content": "Conteúdo do post",
  "is_active": true,
  "user_id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "category_id": "c0a8012e-7f4f-4f33-b3b2-9a47f845a6aa"
}
```

### Atualizar Post

```json
PATCH /posts/:id
{
  "title": "Título atualizado",
  "is_active": false
}
```

---

## 🧑‍💻 Exemplos de Uso (curl)

### Login e uso do token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"dfsilva@email.com","password":"SENHA_AQUI"}'
```

### Listar posts

```bash
curl http://localhost:3000/posts
```

### Criar post (autenticado)

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"title":"Novo Post","content":"Conteúdo","is_active":true,"user_id":"...","category_id":"..."}'
```

### Atualizar post

```bash
curl -X PATCH http://localhost:3000/posts/POST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"title":"Novo título"}'
```

### Deletar post

```bash
curl -X DELETE http://localhost:3000/posts/POST_ID \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🔄 Fluxo de uso recomendado

1. **Crie um usuário** (se necessário)
2. **Faça login** para obter o token JWT
3. **Use o token** para acessar rotas protegidas (criar, atualizar, deletar posts)
4. **Liste, busque, atualize e remova posts conforme necessário**

---
