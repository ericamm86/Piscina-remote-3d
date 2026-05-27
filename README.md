# PoolSight Remote 3D

Sistema web de sensoriamento remoto aplicado a construcao, simulacao e visualizacao 3D de piscinas residenciais.

O MVP permite informar um endereco, converter para coordenadas geograficas, visualizar um terreno em modo satelite ou demo GIS, posicionar manualmente a piscina no quintal, trocar modelo/cor/acessorios, renderizar uma pre-visualizacao 3D em Three.js, gerar estimativa conceitual e salvar o projeto.

## Stack

- Frontend: React, Vite, HTML5, CSS3, JavaScript moderno, Three.js, lucide-react
- Backend: Node.js, Express, Zod, JWT demo
- Mapas: Google Maps JavaScript API e Geocoding API quando as chaves forem configuradas
- Banco planejado: PostgreSQL com PostGIS para evolucao GIS
- Persistencia MVP: arquivo JSON local no backend

## Como rodar

```bash
npm install
npm run dev
```

URLs locais:

- Web: `http://localhost:5173`
- API: `http://localhost:4200`

Copie `.env.example` para `.env` se quiser ativar as APIs Google Maps:

```bash
GOOGLE_MAPS_API_KEY=sua-chave
VITE_GOOGLE_MAPS_API_KEY=sua-chave
```

Sem chave, o sistema roda em modo demonstrativo com mapa GIS sintetico.

## Funcionalidades MVP

- Busca de endereco com geocodificacao real ou fallback demo
- Conversao para latitude/longitude em EPSG:4326
- Visualizacao de terreno por satelite quando a API esta ativa
- Upload de foto real do quintal, drone ou vista aerea como base visual do projeto
- Selecao manual da area do quintal
- Modelos 3D: retangular, organico e spa compacto
- Troca de cor da agua, escala, deck, iluminacao, arvores e area gourmet
- Modo imersivo com WebXR/VR e visualizacao anaglifa vermelho/ciano
- Orcamento conceitual
- Salvamento de projeto no backend
- Interface responsiva com linguagem visual de arquitetura, engenharia e real estate

## Estrutura

```text
piscina-remote-3d/
  apps/
    api/
      src/
        routes/
        services/
        middleware/
        data/
    web/
      src/
        components/
        hooks/
        lib/
        styles/
  database/
  docs/
```

## Documentacao

- [Arquitetura tecnica](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Sensoriamento remoto e GIS](docs/REMOTE-SENSING.md)
- [Subagents do projeto](docs/SUBAGENTS.md)
- [Schema PostgreSQL/PostGIS](database/schema.sql)
