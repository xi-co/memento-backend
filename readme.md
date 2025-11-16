# Backend Server - Node.js + Fastify + Prisma + PostgreSQL

Servidor backend completo com autenticação JWT e Google OAuth, construído com Node.js, Fastify, Prisma e PostgreSQL (Supabase).

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Fastify** - Framework web de alta performance
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados (Supabase)
- **JWT** - Autenticação via tokens
- **bcrypt** - Hash de senhas
- **Google OAuth** - Autenticação via Google
- **Zod** - Validação de dados

## 📁 Estrutura do Projeto

```
project/
├── src/
│   ├── config/          # Configurações (database)
│   ├── controllers/     # Controllers (auth)
│   ├── middlewares/     # Middlewares (auth)
│   ├── routes/          # Rotas da API
│   ├── services/        # Lógica de negócio
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Utilitários (password, token)
│   ├── app.ts           # Configuração do Fastify
│   └── server.ts        # Entry point
├── prisma/
│   └── schema.prisma    # Schema do banco
├── dist/                # Código compilado
├── .env                 # Variáveis de ambiente
├── .env.example         # Template de variáveis
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Pré-requisitos

- Node.js 18+ instalado
- Conta Supabase com banco PostgreSQL configurado
- Google Cloud Console (opcional, para OAuth)

## 🔧 Configuração e Instalação

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

O arquivo `.env` já está parcialmente configurado. Você precisa adicionar:

**✅ Obter a senha do banco de dados do Supabase:**

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto `mqojbwhqcmkasoltjwoj`
3. Vá em **Settings** → **Database**
4. Na seção **Connection String**, copie a **Connection pooling** URI
5. Substitua `[YOUR-PASSWORD]` pela senha do banco no `.env`:

```env
DATABASE_URL="postgresql://postgres.mqojbwhqcmkasoltjwoj:SUA-SENHA-AQUI@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

**🔐 Variáveis JWT (Já configuradas):**
- `JWT_SECRET` - Já definido
- `JWT_REFRESH_SECRET` - Já definido
- `JWT_EXPIRES_IN=15m` - Token expira em 15 minutos
- `JWT_REFRESH_EXPIRES_IN=7d` - Refresh token expira em 7 dias

**📧 Google OAuth (Opcional):**

Se quiser usar login com Google:

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto ou use um existente
3. Ative **Google+ API**
4. Vá em **APIs & Services** → **Credentials**
5. Crie **OAuth 2.0 Client ID**
6. Configure:
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
7. Copie **Client ID** e **Client Secret** e adicione no `.env`:

```env
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
```

### 3. Verificar Tabela no Banco de Dados

A tabela `users` já foi criada no Supabase. Para verificar:

```bash
npx prisma studio
```

Isso abre uma interface visual do banco de dados em `http://localhost:5555`

### 4. Gerar Prisma Client (Já executado)

Se precisar regenerar:

```bash
npm run prisma:generate
```

## 🏃 Executar o Servidor

### Modo Desenvolvimento (Recomendado)

```bash
npm run dev
```

O servidor inicia em: **http://localhost:3000**

### Modo Produção

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Health Check

```http
GET http://localhost:3000/health
```

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-15T18:00:00.000Z"
}
```

---

### 1️⃣ Registrar Usuário

```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "SenhaForte123"
}
```

**Validações:**
- Nome: mínimo 2 caracteres
- Email: formato válido
- Senha: mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número

**Resposta (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-11-15T18:00:00.000Z",
    "updatedAt": "2024-11-15T18:00:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 2️⃣ Login

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "SenhaForte123"
}
```

**Resposta (200):**
```json
{
  "message": "Login successful",
  "user": { ... },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

### 3️⃣ Login com Google

```http
POST http://localhost:3000/api/auth/google
Content-Type: application/json

{
  "token": "google-id-token-aqui"
}
```

**Resposta (200):**
```json
{
  "message": "Login successful",
  "user": { ... },
  "tokens": { ... },
  "isNewUser": false
}
```

---

### 4️⃣ Refresh Token

```http
POST http://localhost:3000/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Resposta (200):**
```json
{
  "message": "Token refreshed successfully",
  "tokens": {
    "accessToken": "novo-access-token",
    "refreshToken": "novo-refresh-token"
  }
}
```

---

### 5️⃣ Obter Dados do Usuário Autenticado (Rota Protegida)

```http
GET http://localhost:3000/api/auth/me
Authorization: Bearer SEU-ACCESS-TOKEN-AQUI
```

**Resposta (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-11-15T18:00:00.000Z",
    "updatedAt": "2024-11-15T18:00:00.000Z"
  }
}
```

---

## 🔒 Segurança

### Validação de Senha

As senhas devem conter:
- ✅ Mínimo 8 caracteres
- ✅ Pelo menos 1 letra minúscula
- ✅ Pelo menos 1 letra maiúscula
- ✅ Pelo menos 1 número

### Autenticação JWT

- **Access Token**: Expira em 15 minutos
- **Refresh Token**: Expira em 7 dias
- Formato: `Authorization: Bearer {token}`

### Rate Limiting

- **Máximo**: 100 requisições por IP
- **Janela**: 15 minutos

### CORS

Configurado para aceitar requisições de: `http://localhost:5173`

Para produção, altere `CORS_ORIGIN` no `.env`

## 📝 Scripts Disponíveis

```bash
npm run dev              # Modo desenvolvimento com hot-reload
npm run build            # Compila TypeScript para JavaScript
npm start                # Inicia servidor em produção
npm run prisma:generate  # Regenera Prisma Client
npm run prisma:studio    # Abre interface visual do banco
```

## 🐛 Tratamento de Erros

Todos os erros retornam no formato:

```json
{
  "error": "Error Type",
  "message": "Descrição do erro"
}
```

### Códigos HTTP

| Código | Significado |
|--------|-------------|
| `200` | Sucesso |
| `201` | Recurso criado |
| `400` | Dados inválidos |
| `401` | Não autenticado |
| `404` | Recurso não encontrado |
| `409` | Conflito (email já existe) |
| `500` | Erro interno do servidor |

## 🧪 Testar a API

### Usando cURL

**Registrar:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@test.com","password":"SenhaForte123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@test.com","password":"SenhaForte123"}'
```

**Obter perfil:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer SEU-TOKEN-AQUI"
```

### Usando Postman ou Insomnia

Importe a collection com os endpoints acima.

## 📊 Logs

O servidor usa **Pino** para logging estruturado:

- **Desenvolvimento**: Logs coloridos e formatados
- **Produção**: Logs em formato JSON

## 🛠️ Troubleshooting

### ❌ Erro: Cannot find module '@prisma/client'

```bash
npm run prisma:generate
```

### ❌ Erro de conexão com banco

1. Verifique se a senha no `DATABASE_URL` está correta
2. Confirme se seu IP está na whitelist do Supabase
3. Teste a conexão com Prisma Studio

### ❌ Porta 3000 em uso

Altere no `.env`:
```env
PORT=3001
```

### ❌ JWT Token inválido

- Tokens expiram após 15 minutos
- Use o endpoint `/api/auth/refresh` para renovar

## 📂 Localização dos Arquivos

**Código-fonte:** `/tmp/cc-agent/60234018/project/`

```
project/
├── src/          # Código TypeScript
├── dist/         # Código compilado (após npm run build)
├── prisma/       # Schema do banco
├── node_modules/ # Dependências
└── .env          # Configurações
```

## 🎯 Próximos Passos Sugeridos

- [ ] Implementar testes unitários (Jest/Vitest)
- [ ] Adicionar Swagger/OpenAPI para documentação
- [ ] Implementar logout com blacklist de tokens
- [ ] Adicionar mais OAuth providers (GitHub, Facebook)
- [ ] Implementar reset de senha por email
- [ ] Adicionar logs de auditoria
- [ ] Configurar CI/CD
- [ ] Adicionar Docker e docker-compose

## 📄 Licença

ISC

---

**✨ Servidor criado e pronto para uso!**

Para iniciar: `npm run dev`
