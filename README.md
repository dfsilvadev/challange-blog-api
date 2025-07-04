# 🚀 Challenge Blog API

Uma API RESTful moderna para gerenciamento de blog educacional, construída com Node.js, TypeScript, Express e PostgreSQL.

## 📋 Descrição

Esta API foi desenvolvida para gerenciar um sistema de blog educacional com funcionalidades de usuários, posts e categorias. O projeto utiliza uma arquitetura limpa com separação de responsabilidades e implementa boas práticas de desenvolvimento.

## 🛠️ Tecnologias Utilizadas

### Backend

- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação tipada
- **Express.js** - Framework web para Node.js
- **PostgreSQL** - Banco de dados relacional
- **pg** - Cliente PostgreSQL para Node.js

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
- Docker (opcional)
- pgAdmin 4 (opcional - para gerenciamento visual do banco)

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
```

A aplicação estará disponível em:

- API: http://localhost:3001
- Banco de dados: localhost:5433
- pgAdmin 4: http://localhost:5050 (se configurado)

### Configuração do pgAdmin 4

Para facilitar o gerenciamento visual do banco de dados, você pode configurar o pgAdmin 4:

#### Opção 1: Docker Compose (Recomendado)

Adicione o serviço pgAdmin ao seu `docker-compose.yml`:

```yaml
services:
  # ... outros serviços ...
  
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: blog-pgadmin
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@blog.com
      PGADMIN_DEFAULT_PASSWORD: admin123
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    depends_on:
      - db

volumes:
  # ... outros volumes ...
  pgadmin_data:
```

#### Opção 2: Instalação Local

1. **Baixe e instale o pgAdmin 4**:
   - [Download pgAdmin 4](https://www.pgadmin.org/download/pgadmin-4-windows/)
   - Ou use o gerenciador de pacotes do seu sistema

2. **Configure a conexão**:
   - Abra o pgAdmin 4
   - Clique com botão direito em "Servers" → "Register" → "Server"
   - Na aba "General":
     - **Name**: Blog API Database
   - Na aba "Connection":
     - **Host name/address**: localhost
     - **Port**: 5433
     - **Maintenance database**: postgres
     - **Username**: `<DB_USER>`
     - **Password**: `<DB_PASSWORD>`

#### Configurações de Conexão

| Campo | Valor |
|-------|-------|
| **Host** | localhost |
| **Port** | 5433 |
| **Database** | `<DB_NAME>` |
| **Username** | `<DB_USER>` |
| **Password** | `<DB_PASSWORD>` |

#### Estrutura do Banco no pgAdmin 4

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

#### Operações Comuns no pgAdmin 4

**Visualizar Dados**:
- Expanda `Tables` → Clique com botão direito na tabela → `View/Edit Data` → `All Rows`

**Executar Queries**:
- Clique no ícone de SQL (Query Tool) na barra de ferramentas
- Digite sua query SQL e execute com F5

**Exemplo de Queries Úteis**:
```sql
-- Verificar se as tabelas foram criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar dados de usuários
SELECT * FROM tb_user;

-- Verificar categorias disponíveis
SELECT * FROM tb_category;

-- Verificar posts
SELECT p.title, p.content, u.name as author, c.name as category
FROM tb_post p
JOIN tb_user u ON p.user_id = u.id
JOIN tb_category c ON p.category_id = c.id;
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

- [ ] Implementar autenticação JWT
- [ ] Adicionar validação de dados com express-validator
- [ ] Implementar upload de imagens
- [ ] Adicionar documentação com Swagger

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
