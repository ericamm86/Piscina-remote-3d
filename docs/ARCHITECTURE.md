# Arquitetura Tecnica

## Visao Geral

O PoolSight Remote 3D e uma plataforma web para planejamento de piscinas residenciais com sensoriamento remoto, GIS, mapas, imagem real, autenticacao e renderizacao 3D.

## Camadas

### Frontend

- React e Vite
- TailwindCSS preparado para evolucao de design system
- Componentes isolados por responsabilidade
- Cliente REST em `src/lib/api.js`
- Internacionalizacao PT/EN em `src/lib/i18n.js`
- Three.js/WebXR isolado em `ThreePoolScene`

### Backend

- `routes`: declaracao das APIs REST
- `controllers`: validacao e entrada HTTP
- `services`: regras de negocio e integracoes externas
- `repositories`: persistencia PostgreSQL/Neon ou fallback em memoria
- `middleware`: JWT Bearer Token, roles e seguranca
- `config`: variaveis e conexao com banco

### Banco

PostgreSQL com PostGIS no Neon Database:

- `users`
- `auth_sessions`
- `terrains`
- `projects`
- `pool_models`
- `estimates`

## Fluxo Principal

1. Usuario cria conta ou realiza login.
2. Backend valida credenciais e gera JWT.
3. Frontend persiste o token no cliente e envia `Authorization: Bearer <token>`.
4. Usuario busca endereco.
5. API usa Google Geocoding ou fallback demo.
6. Frontend exibe satelite, demo GIS ou imagem real enviada pelo usuario.
7. Usuario posiciona, redimensiona e rotaciona a piscina.
8. Three.js atualiza a cena 3D.
9. Usuario gera estimativa e salva o projeto em rota protegida.
10. Historico fica disponivel na area autenticada.

## APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/geocode`
- `GET /api/pools`
- `POST /api/estimate`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/admin/overview`
- `GET /health`

## Integracoes

- Google Maps JavaScript API
- Google Geocoding API
- Neon PostgreSQL
- PostGIS para coordenadas e geometrias
- WebXR para VR

## Expansao Futura

A arquitetura esta preparada para:

- IA e visao computacional
- deteccao automatica de lote
- integracao com drones
- fotogrametria
- LiDAR e nuvem de pontos
- realidade aumentada
- modulos admin e multi-tenant
- filas de processamento e workers
