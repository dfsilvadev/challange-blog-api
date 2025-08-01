# 🚀 Challenge Blog API

API RESTful para gerenciamento de posts, usuários e categorias de um blog.

[📄 Documentação Técnica (Design Doc)](docs/DESIGN.md)

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Como Executar](#como-executar)
- [Configuração de Ambiente](#configuração-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Rotas da API](#rotas-da-api)
- [Exemplos de Payloads](#exemplos-de-payloads)
- [Exemplos de Uso (curl)](#exemplos-de-uso-curl)
- [Fluxo de uso recomendado](#fluxo-de-uso-recomendado)
- [Testes](#testes)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Funcionalidades

- Cadastro e autenticação de usuários (JWT)
- CRUD de posts (criação, listagem, atualização, deleção)
- CRUD de categorias
- Filtros por usuário, categoria, paginação e ordenação
- Validação de dados com middlewares
- Testes automatizados
- Docker para ambiente isolado

---

## Tecnologias Utilizadas

- **Node.js** + **Express.js**
- **TypeScript**
- **PostgreSQL**
- **JWT** para autenticação
- **Jest** para testes
- **ESLint** + **Prettier** para qualidade de código
- **Docker** e **Docker Compose**

---

## Arquitetura do Projeto

```
src/
  app/
    controllers/
    middlewares/
    repositories/
    routes/
    models/
  database/
  utils/
__tests__/
  controller/
  repository/
  router/
  middleware/
  utils/
```

---

## Como Executar

### Com Docker

```bash
docker compose up --build
```
Acesse a API em [http://localhost:3000](http://localhost:3000)

### Localmente

1. Suba um banco PostgreSQL localmente.
2. Ajuste o `DATABASE_URL` no `.env` para apontar para seu banco.
3. Rode:
   ```bash
   yarn install
   yarn dev
   ```

---

## Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```
DATABASE_URL=postgresql://user:password@blog-db:5432/blog
JWT_SECRET=sua_chave_secreta
PORT=3000
```

---

## Scripts Disponíveis

- `yarn dev` — Inicia o servidor em modo desenvolvimento
- `yarn build` — Compila o projeto
- `yarn start` — Inicia o servidor em produção
- `yarn test` — Roda todos os testes

---

## Rotas da API

### Autenticação

| Método | Endpoint      | Descrição                    | Autenticação | Payload                         |
|--------|---------------|------------------------------|--------------|----------------------------------|
| POST   | /auth/login   | Login e obtenção de token    | Não          | `{ "username", "password" }`     |

### Usuários

| Método | Endpoint      | Descrição                    | Autenticação | Payload                         |
|--------|---------------|------------------------------|--------------|----------------------------------|
| POST   | /users        | Criar usuário                | Não          | `{ "name", "email", "password", ... }` |
| GET    | /users/:id    | Buscar usuário por ID        | Sim          |                                  |

### Posts

| Método | Endpoint      | Descrição                    | Autenticação | Payload/Query                   |
|--------|---------------|------------------------------|--------------|----------------------------------|
| GET    | /posts        | Listar posts ativos          | Não          | `?page&limit&orderBy`           |
| GET    | /posts/:id    | Buscar post por ID           | Não          |                                  |
| POST   | /posts        | Criar novo post              | Sim          | `{ "title", "content", "is_active", "user_id", "category_id" }` |
| PATCH  | /posts/:id    | Atualizar post               | Sim          | `{ "title?", "content?", "is_active?", "category_id?" }` |
| DELETE | /posts/:id    | Remover post                 | Sim          |                                  |

### Categorias

| Método | Endpoint      | Descrição                    | Autenticação | Payload                         |
|--------|---------------|------------------------------|--------------|----------------------------------|
| GET    | /categories   | Listar categorias            | Não          |                                  |
| POST   | /categories   | Criar categoria              | Sim (admin)  | `{ "name" }`                     |

---

## Exemplos de Payloads

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

## Exemplos de Uso (curl)

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

## Fluxo de uso recomendado

1. **Crie um usuário** (se necessário)
2. **Faça login** para obter o token JWT
3. **Use o token** para acessar rotas protegidas (criar, atualizar, deletar posts)
4. **Liste, busque, atualize e remova posts conforme necessário**

---

## Testes

- Testes unitários e de integração com Jest.
- Para rodar todos os testes:
  ```bash
  yarn test
  ```

---

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## Licença

MIT
