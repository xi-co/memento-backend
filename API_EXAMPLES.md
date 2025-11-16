# 🧪 Exemplos de Uso da API

## 📍 Localização do Projeto

**Diretório:** `/tmp/cc-agent/60234018/project/`

```bash
cd /tmp/cc-agent/60234018/project
```

## 🚀 Como Iniciar o Servidor

### Passo 1: Configure a senha do banco de dados

Edite o arquivo `.env` e substitua `[YOUR-PASSWORD]` pela senha real do Supabase:

```bash
nano .env
# ou
vim .env
```

Procure por:
```
DATABASE_URL="postgresql://postgres.mqojbwhqcmkasoltjwoj:[YOUR-PASSWORD]@..."
```

### Passo 2: Inicie o servidor

```bash
npm run dev
```

Aguarde até ver:
```
[INFO] Database connected successfully
[INFO] Server running on http://0.0.0.0:3000
[INFO] Health check available at http://0.0.0.0:3000/health
```

## ✅ Teste 1: Health Check

```bash
curl http://localhost:3000/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-15T18:35:00.000Z"
}
```

---

## 👤 Teste 2: Registrar um Novo Usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@example.com",
    "password": "SenhaForte123"
  }'
```

**Resposta esperada (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Maria Silva",
    "email": "maria@example.com",
    "createdAt": "2024-11-15T18:35:00.000Z",
    "updatedAt": "2024-11-15T18:35:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**💾 Salve o accessToken para os próximos testes!**

---

## 🔐 Teste 3: Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "SenhaForte123"
  }'
```

**Resposta esperada (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Maria Silva",
    "email": "maria@example.com",
    ...
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

## 👨‍💼 Teste 4: Obter Dados do Usuário (Rota Protegida)

**⚠️ Substitua `SEU-TOKEN-AQUI` pelo token recebido no registro ou login!**

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer SEU-TOKEN-AQUI"
```

**Exemplo com token real:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6Im1hcmlhQGV4YW1wbGUuY29tIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDA5MDB9.abc123xyz"
```

**Resposta esperada (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Maria Silva",
    "email": "maria@example.com",
    "createdAt": "2024-11-15T18:35:00.000Z",
    "updatedAt": "2024-11-15T18:35:00.000Z"
  }
}
```

---

## 🔄 Teste 5: Refresh Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "SEU-REFRESH-TOKEN-AQUI"
  }'
```

**Resposta esperada (200):**
```json
{
  "message": "Token refreshed successfully",
  "tokens": {
    "accessToken": "novo-token...",
    "refreshToken": "novo-refresh-token..."
  }
}
```

---

## ❌ Testes de Erro

### Senha Fraca

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João",
    "email": "joao@test.com",
    "password": "123"
  }'
```

**Resposta (400):**
```json
{
  "error": "Registration failed",
  "message": "Password must be at least 8 characters long, Password must contain at least one uppercase letter"
}
```

### Email Duplicado

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@example.com",
    "password": "SenhaForte123"
  }'
```

**Resposta (409):**
```json
{
  "error": "Registration failed",
  "message": "Email already registered"
}
```

### Token Inválido

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer token-invalido-123"
```

**Resposta (401):**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired access token"
}
```

### Sem Token

```bash
curl -X GET http://localhost:3000/api/auth/me
```

**Resposta (401):**
```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid authorization header"
}
```

---

## 🛠️ Usando Postman

### 1. Criar Collection

1. Abra Postman
2. Clique em **New** → **Collection**
3. Nomeie como "Backend API"

### 2. Adicionar Requests

#### Health Check
- Method: `GET`
- URL: `http://localhost:3000/health`

#### Register
- Method: `POST`
- URL: `http://localhost:3000/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "name": "Maria Silva",
    "email": "maria@example.com",
    "password": "SenhaForte123"
  }
  ```

#### Login
- Method: `POST`
- URL: `http://localhost:3000/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "email": "maria@example.com",
    "password": "SenhaForte123"
  }
  ```

#### Get User (Protected)
- Method: `GET`
- URL: `http://localhost:3000/api/auth/me`
- Headers:
  - `Authorization: Bearer {{token}}`

**Dica:** Use variáveis do Postman para armazenar o token automaticamente!

---

## 🐛 Debug e Logs

### Ver Logs do Servidor

Os logs aparecem no terminal onde você executou `npm run dev`:

```
[INFO] Database connected successfully
[INFO] Server running on http://0.0.0.0:3000
[INFO] Incoming request: POST /api/auth/register
[INFO] Request completed: 201
```

### Ver Dados no Banco

```bash
npm run prisma:studio
```

Isso abre uma interface em `http://localhost:5555` onde você pode:
- Ver todos os usuários cadastrados
- Editar dados manualmente
- Deletar registros de teste

---

## 📊 Verificar Estrutura do Projeto

```bash
# Ver todos os arquivos TypeScript
ls -la src/**/*.ts

# Ver arquivos compilados
ls -la dist/

# Ver schema do Prisma
cat prisma/schema.prisma

# Ver variáveis de ambiente
cat .env
```

---

## 🎯 Próximos Passos

Após testar a API com sucesso:

1. ✅ Teste todos os endpoints
2. ✅ Verifique os dados no Prisma Studio
3. ✅ Configure Google OAuth (opcional)
4. ✅ Implemente seu frontend conectando nesta API
5. ✅ Adicione novos endpoints conforme necessário

---

**🎉 API funcionando perfeitamente!**

Para dúvidas, consulte o `README.md` principal.
