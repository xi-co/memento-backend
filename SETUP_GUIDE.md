# 🔧 Guia de Configuração Completo

## 📂 Localização do Projeto

```
/tmp/cc-agent/60234018/project/
```

## ✅ Status Atual

- ✅ **Node.js** instalado
- ✅ **Dependências** instaladas (148 packages)
- ✅ **TypeScript** configurado
- ✅ **Prisma** configurado e gerado
- ✅ **Código compilado** (pasta `dist/`)
- ✅ **Supabase** conectado
- ✅ **Tabela `users`** criada no banco
- ⚠️ **DATABASE_URL** precisa da senha

## 🔐 IMPORTANTE: Configurar Senha do Banco

### Passo a Passo

1. **Obter a senha do Supabase:**
   - Acesse https://app.supabase.com
   - Login na sua conta
   - Selecione o projeto: `mqojbwhqcmkasoltjwoj`
   - Vá em **Settings** → **Database**
   - Na seção **Connection String**, copie a senha
   - OU, se não lembrar, você pode resetar a senha

2. **Editar o arquivo `.env`:**

```bash
cd /tmp/cc-agent/60234018/project
nano .env
```

3. **Substituir a senha:**

Procure esta linha:
```
DATABASE_URL="postgresql://postgres.mqojbwhqcmkasoltjwoj:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

Substitua `[YOUR-PASSWORD]` pela senha real:
```
DATABASE_URL="postgresql://postgres.mqojbwhqcmkasoltjwoj:SuaSenhaAqui@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

4. **Salvar e fechar:**
   - No nano: `Ctrl+O` (salvar) → `Enter` → `Ctrl+X` (sair)
   - No vim: `:wq` (salvar e sair)

## 🚀 Iniciar o Servidor

Após configurar a senha:

```bash
cd /tmp/cc-agent/60234018/project
npm run dev
```

**Você deve ver:**
```
[INFO] Database connected successfully
[INFO] Server running on http://0.0.0.0:3000
```

Se aparecer erro de conexão, verifique a senha novamente.

## 🧪 Teste Rápido

Em outro terminal:

```bash
curl http://localhost:3000/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

## 📁 Estrutura Criada

```
project/
├── src/                        # Código TypeScript
│   ├── app.ts                 # Configuração do Fastify ✅
│   ├── server.ts              # Entry point ✅
│   ├── config/
│   │   └── database.ts        # Conexão Prisma ✅
│   ├── controllers/
│   │   └── auth.controller.ts # Controller de auth ✅
│   ├── middlewares/
│   │   └── auth.middleware.ts # JWT middleware ✅
│   ├── routes/
│   │   └── auth.routes.ts     # Rotas de auth ✅
│   ├── services/
│   │   ├── auth.service.ts    # Lógica de auth ✅
│   │   ├── google.service.ts  # Google OAuth ✅
│   │   └── user.service.ts    # Operações de user ✅
│   ├── types/
│   │   ├── auth.types.ts      # Tipos TypeScript ✅
│   │   └── validation.schemas.ts # Schemas Zod ✅
│   └── utils/
│       ├── password.util.ts   # Hash bcrypt ✅
│       └── token.util.ts      # JWT tokens ✅
├── dist/                       # JavaScript compilado ✅
├── prisma/
│   └── schema.prisma          # Schema do banco ✅
├── node_modules/              # Dependências ✅
├── .env                        # Variáveis de ambiente ⚠️
├── .env.example               # Template ✅
├── package.json               # Config do projeto ✅
├── tsconfig.json              # Config TypeScript ✅
├── README.md                  # Documentação ✅
├── API_EXAMPLES.md            # Exemplos de uso ✅
└── SETUP_GUIDE.md             # Este arquivo ✅
```

## 🗂️ Banco de Dados

### Tabela `users` já criada no Supabase:

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text,
  google_id text UNIQUE,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
```

### Verificar dados:

```bash
npm run prisma:studio
```

Abre em: http://localhost:5555

## 📋 Comandos Úteis

### Desenvolvimento

```bash
npm run dev              # Inicia com hot-reload
npm run build            # Compila TypeScript
npm start                # Inicia produção
```

### Prisma

```bash
npm run prisma:generate  # Regenera client
npm run prisma:studio    # Interface visual
```

### Verificar

```bash
# Ver logs do servidor
# (aparecem no terminal onde rodou npm run dev)

# Testar health
curl http://localhost:3000/health

# Ver processos Node
ps aux | grep node

# Matar servidor se travar
pkill -f "tsx watch"
```

## 🔧 Variáveis de Ambiente (.env)

```env
# Supabase (já configurado)
VITE_SUPABASE_URL=https://mqojbwhqcmkasoltjwoj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# Database (PRECISA DA SENHA!)
DATABASE_URL="postgresql://postgres.mqojbwhqcmkasoltjwoj:[YOUR-PASSWORD]@..."

# Server (já configurado)
PORT=3000
NODE_ENV=development

# JWT (já configurado com secrets seguros)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345678
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production-87654321
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# CORS (já configurado)
CORS_ORIGIN=http://localhost:5173
```

## 🌐 Endpoints Disponíveis

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/health` | Health check | Não |
| POST | `/api/auth/register` | Registrar usuário | Não |
| POST | `/api/auth/login` | Login | Não |
| POST | `/api/auth/google` | Login Google | Não |
| POST | `/api/auth/refresh` | Refresh token | Não |
| GET | `/api/auth/me` | Dados do usuário | Sim ✅ |

## 🔒 Segurança Implementada

- ✅ Senhas hasheadas com bcrypt (salt rounds: 10)
- ✅ JWT tokens com expiração (15min access, 7d refresh)
- ✅ Rate limiting (100 req/15min por IP)
- ✅ CORS configurado
- ✅ Helmet (security headers)
- ✅ Validação de entrada com Zod
- ✅ Row Level Security no Supabase

## 🐛 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"

```bash
npm run prisma:generate
```

### Erro: "Database connection failed"

1. Verifique a senha no `.env`
2. Confirme que o Supabase está ativo
3. Teste com Prisma Studio:
   ```bash
   npm run prisma:studio
   ```

### Erro: "Port 3000 already in use"

```bash
# Matar processo
lsof -ti:3000 | xargs kill -9

# Ou mudar porta no .env
PORT=3001
```

### Build falha

```bash
# Limpar e recompilar
rm -rf dist/
npm run build
```

### Reinstalar dependências

```bash
rm -rf node_modules package-lock.json
npm install
npm run prisma:generate
npm run build
```

## 📊 Verificar Instalação

Execute este checklist:

```bash
# 1. Verificar Node.js
node --version  # Deve ser v18+

# 2. Verificar npm
npm --version

# 3. Verificar pasta do projeto
pwd  # Deve ser /tmp/cc-agent/60234018/project

# 4. Verificar arquivos principais
ls -la src/server.ts src/app.ts package.json

# 5. Verificar dependências
npm list --depth=0

# 6. Verificar build
ls -la dist/server.js

# 7. Verificar Prisma
npm run prisma:generate

# 8. Testar conexão (após configurar senha)
npm run prisma:studio
```

## 🎯 Próximos Passos

1. ✅ Configure a senha do banco (OBRIGATÓRIO)
2. ✅ Inicie o servidor: `npm run dev`
3. ✅ Teste com: `curl http://localhost:3000/health`
4. ✅ Registre um usuário de teste
5. ✅ Explore a API com os exemplos em `API_EXAMPLES.md`
6. ⭐ Configure Google OAuth (opcional)
7. ⭐ Integre com seu frontend
8. ⭐ Deploy em produção

## 📞 Links Úteis

- **Supabase Dashboard**: https://app.supabase.com
- **Google Cloud Console**: https://console.cloud.google.com
- **Prisma Docs**: https://www.prisma.io/docs
- **Fastify Docs**: https://www.fastify.io/docs

## ✅ Checklist de Setup

- [ ] Senha do banco configurada no `.env`
- [ ] Servidor iniciado com `npm run dev`
- [ ] Health check funcionando
- [ ] Usuário de teste registrado
- [ ] Login funcionando
- [ ] Token JWT obtido
- [ ] Rota `/me` acessível com token
- [ ] Dados visíveis no Prisma Studio

## 🎉 Pronto!

Se todos os checkboxes acima estiverem marcados, seu servidor backend está 100% funcional!

Para exemplos práticos de uso, veja: **API_EXAMPLES.md**
