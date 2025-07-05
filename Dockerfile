FROM node:20-alpine

WORKDIR /app

# Instalar yarn globalmente e curl para health check
RUN npm install -g yarn && apk add --no-cache curl

# Copiar arquivos de dependências
COPY package.json yarn.lock ./

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação
RUN yarn build

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/users || exit 1

# Comando para iniciar a aplicação
CMD ["yarn", "start"]
