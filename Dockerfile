FROM node:25-alpine

WORKDIR /app

# Copiar apenas arquivos de dependências primeiro para melhor cache
COPY package.json yarn.lock ./

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
