FROM node:20-alpine

WORKDIR /app

# Instalar yarn globalmente e curl para health check com versões fixadas
RUN npm install -g yarn@1.22.22 && apk add --no-cache curl

# Copiar arquivos de dependências
COPY package.json yarn.lock ./

# Instalar dependências e limpar cache
RUN yarn install --frozen-lockfile && yarn cache clean

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
