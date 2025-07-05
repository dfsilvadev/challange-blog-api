# CI/CD Pipeline - Challenge Blog API

Este documento descreve a integração CI/CD implementada para o projeto Challenge Blog API.

## 🚀 Visão Geral

O pipeline CI/CD foi configurado para executar automaticamente em:
- **Push** para as branches `main` e `develop`
- **Pull Requests** para as branches `main` e `develop`

## 📋 Jobs do Pipeline

### 1. Code Quality
**Arquivo:** `.github/workflows/ci.yml` e `.github/workflows/cache.yml`

**Objetivo:** Verificar a qualidade do código

**Executa:**
- ✅ Verificação de formatação com Prettier
- ✅ Linting com ESLint
- ✅ Compilação TypeScript
- ✅ Cache de dependências e build artifacts

### 2. Test Suite
**Objetivo:** Executar testes automatizados

**Executa:**
- ✅ Setup do PostgreSQL para testes
- ✅ Execução de testes com Jest
- ✅ Geração de relatórios de cobertura
- ✅ Upload de cobertura para Codecov
- ✅ Cache de relatórios de cobertura

### 3. Docker Validation
**Objetivo:** Validar e testar containers Docker

**Executa:**
- ✅ Validação do Dockerfile com Hadolint
- ✅ Build da imagem Docker
- ✅ Teste da imagem Docker
- ✅ Cache de layers Docker

### 4. Security Scan
**Objetivo:** Verificar vulnerabilidades de segurança

**Executa:**
- ✅ Auditoria de dependências com `yarn audit`
- ✅ Scan de vulnerabilidades com Snyk
- ✅ Cache de dependências

### 5. SonarCloud Analysis
**Arquivo:** `.github/workflows/sonarcloud.yml`

**Objetivo:** Análise de qualidade de código

**Executa:**
- ✅ Análise estática de código
- ✅ Relatórios de qualidade
- ✅ Métricas de manutenibilidade

### 6. Deploy (Apenas na main)
**Objetivo:** Deploy automático em produção

**Executa:**
- ✅ Build da aplicação
- ✅ Criação de release no GitHub
- ✅ Upload de artifacts

## 🔧 Configurações

### Dependabot
**Arquivo:** `.github/dependabot.yml`

- Atualizações semanais de dependências
- Atualizações automáticas para versões minor/patch
- Revisão manual para versões major
- Agendamento: Segundas-feiras às 09:00

### Renovate (Alternativa)
**Arquivo:** `renovate.json`

- Configuração alternativa ao Dependabot
- Merge automático para atualizações seguras
- Agrupamento de dependências relacionadas

### Stale Bot
**Arquivo:** `.github/stale.yml`

- Marca issues como stale após 30 dias
- Marca PRs como stale após 7 dias
- Fecha automaticamente após período de grace

## 📊 Ferramentas Integradas

### Codecov
**Arquivo:** `.codecov.yml`

- Relatórios de cobertura de testes
- Meta de 80% de cobertura
- Comentários automáticos em PRs

### SonarCloud
**Arquivo:** `sonar-project.properties`

- Análise de qualidade de código
- Métricas de complexidade
- Detecção de code smells

## 🎯 Templates

### Issue Templates
- **Bug Report:** `.github/ISSUE_TEMPLATE/bug_report.md`
- **Feature Request:** `.github/ISSUE_TEMPLATE/feature_request.md`

### Pull Request Template
- **PR Template:** `.github/pull_request_template.md`

## 🔐 Secrets Necessários

Configure os seguintes secrets no GitHub:

```bash
# Para Snyk
SNYK_TOKEN=your_snyk_token

# Para SonarCloud
SONAR_TOKEN=your_sonarcloud_token

# Para Codecov (opcional)
CODECOV_TOKEN=your_codecov_token
```

## 📈 Métricas e Badges

Adicione os seguintes badges ao seu README:

```markdown
[![CI/CD](https://github.com/dfsilvadev/challange-blog-api/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/dfsilvadev/challange-blog-api/actions)
[![Codecov](https://codecov.io/gh/dfsilvadev/challange-blog-api/branch/main/graph/badge.svg)](https://codecov.io/gh/dfsilvadev/challange-blog-api)
[![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=dfsilvadev_challange-blog-api&metric=alert_status)](https://sonarcloud.io/dashboard?id=dfsilvadev_challange-blog-api)
[![Dependabot](https://api.dependabot.com/badges/status?host=github&repo=dfsilvadev/challange-blog-api)](https://dependabot.com)
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Falha no PostgreSQL:**
   - Verifique se o serviço está configurado corretamente
   - Aumente o timeout de health check se necessário

2. **Falha no Docker Build:**
   - Verifique se o Dockerfile está correto
   - Execute `docker build` localmente para testar

3. **Falha nos Testes:**
   - Execute `yarn test` localmente
   - Verifique se as variáveis de ambiente estão corretas

4. **Falha no ESLint:**
   - Execute `yarn lint` localmente
   - Use `yarn lint:fix` para corrigir automaticamente

### Logs e Debug

- Acesse a aba "Actions" no GitHub para ver logs detalhados
- Use `continue-on-error: true` para jobs não críticos
- Configure `fail-fast: false` para executar todos os jobs mesmo com falhas

## 🔄 Workflow de Desenvolvimento

1. **Crie uma branch:** `git checkout -b feature/nova-funcionalidade`
2. **Desenvolva:** Faça suas alterações
3. **Teste localmente:** `yarn test && yarn lint && yarn build`
4. **Commit:** Use conventional commits
5. **Push:** `git push origin feature/nova-funcionalidade`
6. **Crie PR:** O pipeline executará automaticamente
7. **Review:** Aguarde aprovação e merge

## 📚 Recursos Adicionais

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Documentation](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [Codecov Documentation](https://docs.codecov.io/) 