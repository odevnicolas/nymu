# API Client - Documentação

## Estrutura

Este módulo centraliza todas as chamadas HTTP da aplicação, seguindo uma arquitetura modular e extensível.

```
src/lib/api/
├── config.ts          # URL base e endpoints
├── types.ts           # Tipos TypeScript
├── client.ts          # Cliente HTTP com interceptors
├── interceptors.ts    # Configuração de interceptors
├── auth.ts            # Funções de autenticação
└── index.ts           # Exports centralizados
```

## Uso Básico

### Login

```typescript
import { login } from '@/lib/api/auth';
import { saveToken } from '@/lib/storage';

try {
  const token = await login('usuario@exemplo.com', 'senha123');
  await saveToken(token);
  // Navegar para dashboard
} catch (error) {
  console.error('Erro:', error.message);
}
```

### Requisições Autenticadas

Após configurar o interceptor (já feito no `_layout.tsx`), todas as requisições que precisarem de autenticação devem usar o parâmetro `requireAuth: true`:

```typescript
import { apiRequest } from '@/lib/api/client';

// Requisição autenticada (token adicionado automaticamente)
const data = await apiRequest('/api/protected-endpoint', {
  method: 'GET',
}, true); // requireAuth = true
```

## Próximos Passos

### 1. Instalar Dependências de Storage

Para usar o storage de token em produção, instale uma das opções:

**Opção 1: SecureStore (Recomendado para tokens)**
```bash
npx expo install expo-secure-store
```

**Opção 2: AsyncStorage (Alternativa)**
```bash
npx expo install @react-native-async-storage/async-storage
```

Depois, atualize `src/lib/storage/token.ts` removendo os comentários TODO e usando a biblioteca escolhida.

### 2. Usar Requisições Autenticadas

Ao criar novas rotas que precisam de autenticação, use o parâmetro `requireAuth`:

```typescript
// Exemplo: buscar dados do usuário
export async function getUserProfile() {
  return apiRequest<UserProfile>('/api/user/profile', {
    method: 'GET',
  }, true); // requireAuth = true
}
```

### 3. Implementar Outras Rotas

As funções `validateCode` e `register` já estão criadas e prontas para uso. Basta chamá-las:

```typescript
import { validateCode, register } from '@/lib/api/auth';

// Validar código
await validateCode('email@exemplo.com', '123456');

// Registrar usuário
await register('email@exemplo.com', 'senha123', '123.456.789-00', '123456');
```

## Configuração

### URL da API

Você tem **3 opções** para configurar a URL da API. O código já suporta todas elas:

#### Opção 1: Arquivo `.env` (Recomendado para desenvolvimento)

1. Crie um arquivo `.env` na raiz do projeto:
```bash
# .env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

2. Para produção, use:
```bash
EXPO_PUBLIC_API_URL=https://api.seudominio.com
```

3. **Importante**: Reinicie o servidor Expo após criar/modificar o `.env`:
```bash
npm start
```

**Vantagens:**
- ✅ Não precisa commitar no git (já está no .gitignore)
- ✅ Cada desenvolvedor pode ter sua própria configuração
- ✅ Fácil de trocar entre dev/prod

#### Opção 2: `app.json` (Para builds/configurações fixas)

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:3000"
    }
  }
}
```

**Vantagens:**
- ✅ Funciona sem arquivo .env
- ✅ Útil para builds específicos

**Desvantagens:**
- ❌ Precisa commitar no git (pode expor URLs)
- ❌ Menos flexível para diferentes ambientes

#### Opção 3: Fallback padrão

Se nenhuma das opções acima for configurada, usa `http://localhost:3000` por padrão.

### Ordem de Prioridade

O código verifica nesta ordem:
1. `app.json` → `extra.apiUrl`
2. `.env` → `EXPO_PUBLIC_API_URL`
3. Fallback → `http://localhost:3000`

### Criando o arquivo .env

```bash
# Na raiz do projeto
echo "EXPO_PUBLIC_API_URL=http://localhost:3000" > .env
```

**Importante no Expo:**
- Variáveis de ambiente devem começar com `EXPO_PUBLIC_` para serem acessíveis no código
- Após criar/modificar `.env`, sempre reinicie o servidor (`npm start`)

## Interceptors

O sistema de interceptors permite adicionar headers automaticamente. O interceptor de autenticação já está configurado e adiciona o token automaticamente quando disponível.

Para adicionar novos interceptors:

```typescript
import { addHeaderInterceptor } from '@/lib/api/client';

addHeaderInterceptor(() => {
  return {
    'X-Custom-Header': 'valor',
  };
});
```
