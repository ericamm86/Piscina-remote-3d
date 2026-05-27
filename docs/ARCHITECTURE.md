# Arquitetura Tecnica

## Visao Geral

O PoolSight Remote 3D e uma plataforma web para pre-venda e estudo conceitual de piscinas residenciais. O sistema combina geocodificacao, imagens aereas, camada GIS, configurador 3D e estimativa comercial.

## Fluxo Principal

1. Cliente informa o endereco.
2. Backend consulta a Google Geocoding API ou retorna coordenada demo.
3. Frontend centraliza a residencia no mapa.
4. Usuario seleciona manualmente a area livre do quintal.
5. Three.js renderiza o lote, a residencia, a piscina e opcionais.
6. Backend calcula uma estimativa de custo.
7. Projeto e salvo com endereco, coordenadas, configuracao 3D e metadados GIS.

## Modulos

### API

- `geocode.routes.js`: entrada de endereco e normalizacao geografica.
- `pools.routes.js`: catalogo de modelos de piscina.
- `estimate.routes.js`: calculo de orcamento conceitual.
- `projects.routes.js`: persistencia de projetos.
- `auth.routes.js`: login demo com JWT.

### Web

- `MapPanel`: visualizacao satelite ou demo GIS e selecao da area.
- `ThreePoolScene`: cena WebGL com Three.js, WebXR/VR e modo anaglifo.
- `Configurator`: controles de modelo, escala, cor e opcionais.
- `AddressSearch`: entrada de endereco.

## Integracoes Externas

- Google Geocoding API: endereco para latitude/longitude.
- Google Maps JavaScript API: mapa satelite e retangulo editavel.
- Futuro: Places API para autocomplete, Static Maps API para relatorios, drone imagery APIs para ortomosaicos.
- WebXR Device API: entrada imersiva em headsets compativeis, como Meta Quest, usando Three.js.

## Escalabilidade

Para producao, substituir o `projectStore` em JSON por PostgreSQL/PostGIS. A API ja separa rotas e servicos para facilitar troca de persistencia, filas de processamento de imagem, workers de IA e renderizacao server-side.
