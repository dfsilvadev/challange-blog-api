#!/bin/bash

# Script para configurar o ambiente de CI/CD localmente
# Execute: chmod +x scripts/setup-ci.sh && ./scripts/setup-ci.sh

set -e

echo "🚀 Configurando ambiente de CI/CD para Challenge Blog API"
echo "=================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
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

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    print_error "Execute este script na raiz do projeto"
    exit 1
fi

print_status "Verificando dependências..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado. Instale o Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    print_error "Node.js 20+ é necessário. Versão atual: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) encontrado"

# Verificar Yarn
if ! command -v yarn &> /dev/null; then
    print_error "Yarn não está instalado. Instale o Yarn"
    exit 1
fi

print_success "Yarn $(yarn --version) encontrado"

# Verificar Docker
if ! command -v docker &> /dev/null; then
    print_warning "Docker não está instalado. Alguns testes podem falhar"
else
    print_success "Docker $(docker --version) encontrado"
fi

# Verificar PostgreSQL
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL client não está instalado. Use Docker para testes"
else
    print_success "PostgreSQL client encontrado"
fi

print_status "Instalando dependências..."
yarn install --frozen-lockfile

print_status "Verificando formatação do código..."
if yarn format --check; then
    print_success "Código está bem formatado"
else
    print_warning "Código precisa ser formatado. Execute: yarn format"
fi

print_status "Executando linting..."
if yarn lint; then
    print_success "Linting passou"
else
    print_warning "Linting falhou. Execute: yarn lint:fix"
fi

print_status "Compilando TypeScript..."
if yarn build; then
    print_success "Compilação TypeScript bem-sucedida"
else
    print_error "Compilação TypeScript falhou"
    exit 1
fi

print_status "Executando testes..."
if yarn test:ci; then
    print_success "Testes passaram"
else
    print_warning "Alguns testes falharam"
fi

print_status "Verificando vulnerabilidades..."
if yarn audit --audit-level moderate; then
    print_success "Nenhuma vulnerabilidade crítica encontrada"
else
    print_warning "Vulnerabilidades encontradas. Execute: yarn audit"
fi

print_status "Verificando Docker..."
if command -v docker &> /dev/null; then
    if docker build -t blog-api-test .; then
        print_success "Docker build bem-sucedido"
        docker rmi blog-api-test > /dev/null 2>&1 || true
    else
        print_error "Docker build falhou"
        exit 1
    fi
fi

echo ""
echo "🎉 Configuração concluída!"
echo "=================================================="
echo ""
echo "📋 Próximos passos:"
echo "1. Configure os secrets no GitHub:"
echo "   - SNYK_TOKEN (opcional)"
echo "   - SONAR_TOKEN (opcional)"
echo "   - CODECOV_TOKEN (opcional)"
echo ""
echo "2. Ative os GitHub Apps:"
echo "   - Dependabot"
echo "   - Stale Bot"
echo "   - SonarCloud"
echo ""
echo "3. Configure o Codecov (opcional):"
echo "   - Acesse https://codecov.io"
echo "   - Conecte seu repositório"
echo ""
echo "4. Teste o pipeline:"
echo "   - Faça um push para a branch main"
echo "   - Verifique a aba Actions no GitHub"
echo ""
echo "📚 Documentação completa: docs/CI-CD.md"
echo ""
print_success "Ambiente de CI/CD configurado com sucesso!" 