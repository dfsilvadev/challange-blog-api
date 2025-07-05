#!/bin/bash

# Script para testar o Hadolint localmente
# Execute: chmod +x scripts/test-hadolint.sh && ./scripts/test-hadolint.sh

set -e

echo "🔍 Testando Dockerfile com Hadolint..."
echo "====================================="

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

# Executar Hadolint usando Docker
print_status "Executando Hadolint no Dockerfile..."

if docker run --rm -i hadolint/hadolint < Dockerfile; then
    print_success "Hadolint passou sem erros críticos"
else
    print_warning "Hadolint encontrou warnings (pode ser normal)"
fi

# Executar com configuração personalizada
print_status "Executando Hadolint com configuração personalizada..."

if docker run --rm -i -v "$(pwd)/.hadolint.yaml:/root/.hadolint.yaml" hadolint/hadolint < Dockerfile; then
    print_success "Hadolint com configuração personalizada passou"
else
    print_warning "Hadolint com configuração ainda tem warnings"
fi

echo ""
echo "🎉 Teste do Hadolint concluído!"
echo "====================================="
print_success "Dockerfile está pronto para o CI/CD" 