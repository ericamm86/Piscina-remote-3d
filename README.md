# PoolSight Remote 3D

Plataforma web escalavel para visualizacao, planejamento e pre-venda de piscinas residenciais usando mapas, imagens de satelite, GIS e renderizacao 3D.

O sistema permite localizar um terreno por endereco, visualizar a base aerea/satelite, carregar imagens reais de drone ou quintal, posicionar uma piscina sobre o lote, configurar modelos e materiais, autenticar usuarios com JWT Bearer Token, salvar projetos e consultar historico.

## Stack

- Frontend: React, Vite, TailwindCSS, CSS3, Three.js, WebXR, lucide-react
- Backend: Node.js, Express, Zod, Helmet, Morgan
- Banco: PostgreSQL com PostGIS preparado para Neon Database
- Autenticacao: JWT com Bearer Token
- Mapas/GIS: Google Maps JavaScript API, Geocoding API, EPSG:4326
- Deploy: Vercel para frontend e backend serverless

## Arquitetura

```text
piscina-remote-3d/
  apps/
    api/
      api/                  # entrada serverless Vercel
      scripts/              # init-db
      src/
        config/             # env e postgres
        controllers/        # entrada HTTP
        middleware/         # JWT, roles e erros
        repositories/       # PostgreSQL/Neon ou fallback em memoria
        routes/             # APIs REST
        services/           # regras de negocio e integracoes
        utils/
    web/
      src/
        components/
        hooks/
        lib/
        styles/
  database/
    schema.sql
    seed.sql
  docs/
```

## Funcionalidades

- Login e cadastro com JWT
- Rotas protegidas por Bearer Token
- Area autenticada do usuario
- Historico de projetos salvos
- Painel administrativo basico para usuarios `admin`
- Busca de terreno por endereco
- Geocodificacao para latitude/longitude
- Mapa satelite com Google Maps quando a chave esta configurada
- Fallback GIS local sem chave externa
- Upload de imagem real do quintal, drone ou Google Maps
- Piscina 2D arrastavel, redimensionavel e com rotacao
- Configurador profissional de piscinas
- Renderizacao 3D com Three.js
- Modo WebXR/VR e anaglifo
- Seletor de idioma portugues/ingles com medidas e especificacoes traduzidas
- Responsividade validada para desktop, tablet e celulares pequenos

## Instalar

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

URLs locais:

- Web: `http://localhost:5173` ou proxima porta livre do Vite
- API: `http://localhost:4200`

## Variaveis

```env
PORT=4200
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require
GOOGLE_MAPS_API_KEY=
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=2h

VITE_API_URL=http://localhost:4200
VITE_GOOGLE_MAPS_API_KEY=
```

Sem `DATABASE_URL`, a API usa fallback em memoria para desenvolvimento. Para producao, use Neon PostgreSQL.

## Banco Neon PostgreSQL

1. Crie um projeto no Neon.
2. Copie a connection string com `sslmode=require`.
3. Configure `DATABASE_URL` no `.env`.
4. Rode:

```bash
npm run db:init
```

O script cria tabelas para:

- usuarios
- sessoes de autenticacao
- terrenos
- projetos
- coordenadas GIS/PostGIS
- modelos de piscina
- estimativas

## APIs REST

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/geocode`
- `GET /api/pools`
- `POST /api/estimate`
- `GET /api/projects` protegido
- `POST /api/projects` protegido
- `GET /api/admin/overview` protegido por role `admin`
- `GET /health`

Rotas protegidas exigem:

```http
Authorization: Bearer <token>
```

## Deploy Vercel

### Opcao A: monorepo unico

1. Importe o repositorio no Vercel.
2. Use o `vercel.json` da raiz.
   - Root directory: deixe em branco ou use `./`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
3. Configure as variaveis:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `GOOGLE_MAPS_API_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY`
   - `VITE_API_URL` apontando para a URL publica do deploy
   - `CLIENT_ORIGIN` apontando para a URL publica do frontend
4. Deploy.

### Opcao B: frontend e backend separados

Frontend:

- Root directory: `apps/web`
- Build command: `npm run build`
- Output directory: `dist`

Backend:

- Root directory: `apps/api`
- Serverless entry: `api/index.js`
- Configure as variaveis de ambiente do backend.

## Documentacao

- [Arquitetura tecnica](docs/ARCHITECTURE.md)
- [PRD do produto](docs/PRD.md)
- [Roadmap](docs/ROADMAP.md)
- [Sensoriamento remoto e GIS](docs/REMOTE-SENSING.md)
- [Subagents do projeto](docs/SUBAGENTS.md)
- [Schema PostgreSQL/PostGIS](database/schema.sql)
