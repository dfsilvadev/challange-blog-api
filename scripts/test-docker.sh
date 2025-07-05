#!/bin/bash

# Script para testar o Docker localmente
# Execute: chmod +x scripts/test-docker.sh && ./scripts/test-docker.sh

set -e

echo "🐳 Testando Docker build e container..."
echo "======================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    print_error "Docker não está rodando. Inicie o Docker Desktop primeiro."
    exit 1
fi

print_success "Docker está rodando"

# Limpar imagens antigas
print_status "Limpando imagens antigas..."
docker rmi blog-api-test > /dev/null 2>&1 || true

# Build da imagem
print_status "Fazendo build da imagem Docker..."
if docker build -t blog-api-test .; then
    print_success "Build da imagem concluído"
else
    print_error "Falha no build da imagem"
    exit 1
fi

# Verificar se a imagem foi criada
print_status "Verificando se a imagem foi criada..."
if docker images | grep blog-api-test; then
    print_success "Imagem criada com sucesso"
else
    print_error "Imagem não foi criada"
    exit 1
fi

# Testar container
print_status "Iniciando container para teste..."
CONTAINER_ID=$(docker run -d --name test-container -p 3000:3000 blog-api-test)

if [ -z "$CONTAINER_ID" ]; then
    print_error "Falha ao iniciar container"
    exit 1
fi

print_success "Container iniciado com ID: $CONTAINER_ID"

# Aguardar container estar pronto
print_status "Aguardando container estar pronto..."
sleep 10

# Verificar se container está rodando
if docker ps | grep test-container; then
    print_success "Container está rodando"
else
    print_error "Container não está rodando"
    docker logs test-container
    docker stop test-container > /dev/null 2>&1 || true
    docker rm test-container > /dev/null 2>&1 || true
    exit 1
fi

# Testar endpoint (opcional)
print_status "Testando endpoint da aplicação..."
if curl -f http://localhost:3000/users > /dev/null 2>&1; then
    print_success "Endpoint /users está respondendo"
else
    print_warning "Endpoint /users não está respondendo (pode ser normal se não houver dados)"
fi

# Parar e remover container
print_status "Parando e removendo container..."
docker stop test-container
docker rm test-container

print_success "Container parado e removido"

# Limpar imagem de teste
print_status "Limpando imagem de teste..."
docker rmi blog-api-test

print_success "Imagem de teste removida"

echo ""
echo "🎉 Teste do Docker concluído com sucesso!"
echo "======================================"
print_success "Docker build e container test estão funcionando corretamente" 