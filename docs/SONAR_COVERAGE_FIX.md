# Correção do Problema de Cobertura do SonarQube

## Problema Identificado

O SonarQube não estava contando a cobertura de código e sempre retornava zero na pipeline, mesmo com os testes executando corretamente.

## Causas Identificadas

1. **Configuração incorreta do `sonar-project.properties`**:
   - Configurações conflitantes entre `sonar.test.inclusions` e `sonar.exclusions`
   - Falta de configuração específica para TypeScript
   - Exclusões muito amplas que removiam arquivos importantes

2. **Workflow do GitHub Actions com problemas**:
   - O job do SonarCloud não estava baixando os artefatos de cobertura do job anterior
   - Execução redundante de testes sem usar os artefatos

3. **Configuração do Jest inadequada**:
   - Falta de configuração específica para relatórios de cobertura
   - Exclusões não otimizadas

## Correções Implementadas

### 1. Arquivo `sonar-project.properties`

```properties
sonar.projectKey=dfsilva-dxp_blog-challenge
sonar.organization=dfsilva-dxp
sonar.projectName=blog-challenge

sonar.language=ts
sonar.sourceEncoding=UTF-8

sonar.sources=src/
sonar.tests=src/
sonar.test.inclusions=src/**/*.test.ts,src/**/*.spec.ts
sonar.exclusions=src/**/*.test.ts,src/**/*.spec.ts,src/index.tsx
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.coverage.exclusions=src/**/*.test.ts,src/**/*.spec.ts,src/index.tsx

# Configurações adicionais para melhorar a detecção de cobertura
sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.coverage.inclusions=src/**/*.ts
```

### 2. Workflow do GitHub Actions (`.github/workflows/ci.yml`)

```yaml
sonarcloud:
  name: CI - Sonar Analysis
  runs-on: ubuntu-latest
  needs: [test]
  steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
    - name: Download coverage artifacts
      uses: actions/download-artifact@v4
      with:
        name: coverage
        path: coverage
    - name: Install dependencies
      run: yarn install
    - name: Run tests and generate coverage
      run: yarn test:coverage
    - name: Verify coverage files exist
      run: |
        echo "Checking if coverage files exist:"
        ls -la coverage/
        echo "Content of lcov.info:"
        head -20 coverage/lcov.info
    - name: SonarCloud Scan
      uses: SonarSource/sonarqube-scan-action@v5.0.0
      env:
        SONAR_TOKEN: ${{ secrets.SONARCLOUD_TOKEN }}
```

### 3. Configuração do Jest (`jest.config.cjs`)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/types/**/*.ts',
    '!src/**/index.ts'
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  }
};
```

### 4. Script adicional no `package.json`

```json
{
  "scripts": {
    "sonar:local": "yarn test:coverage && sonar-scanner"
  }
}
```

## Principais Mudanças

1. **Adicionada configuração específica para TypeScript**: `sonar.typescript.lcov.reportPaths`
2. **Corrigidas as exclusões**: Agora apenas arquivos de teste são excluídos da análise de cobertura
3. **Melhorado o workflow**: Download de artefatos e verificação de arquivos
4. **Configuração otimizada do Jest**: Relatórios múltiplos e exclusões específicas
5. **Adicionada verificação de debug**: Para identificar problemas na pipeline

## Como Testar

1. **Localmente**:

   ```bash
   yarn test:coverage
   yarn sonar:local  # Se tiver sonar-scanner instalado
   ```

2. **Na Pipeline**:
   - Faça um pull request para a branch main
   - Verifique os logs do job "CI - Sonar Analysis"
   - Confirme que os arquivos de cobertura estão sendo gerados e enviados

## Resultado Esperado

Após essas correções, o SonarQube deve:

- Detectar corretamente os arquivos de cobertura
- Mostrar métricas de cobertura diferentes de zero
- Exibir relatórios detalhados de cobertura por arquivo
- Integrar corretamente com a pipeline do GitHub Actions
