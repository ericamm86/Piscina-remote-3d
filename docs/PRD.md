# PRD - PoolSight Remote 3D

## 1. Resumo executivo

O PoolSight Remote 3D e uma plataforma web de sensoriamento remoto aplicada ao planejamento, configuracao e visualizacao 3D de piscinas residenciais. O sistema permite que clientes informem um endereco, visualizem uma base aerea ou imagem real do terreno, posicionem uma piscina no quintal e tenham uma previa visual antes da visita tecnica.

O produto foi pensado como uma solucao digital para empresas de construcao de piscinas, arquitetura, paisagismo e engenharia residencial, com potencial de evolucao para uma plataforma inteligente com GIS, IA, drones, realidade aumentada e banco de dados geoespacial.

## 2. Objetivo do produto

Criar uma experiencia web moderna e responsiva que reduza a distancia entre o primeiro contato comercial e a proposta tecnica, permitindo:

- Visualizar terrenos residenciais por imagem aerea, satelite ou upload manual.
- Posicionar e configurar modelos de piscinas sobre o quintal.
- Gerar uma visualizacao 3D inicial do projeto.
- Salvar projetos vinculados a usuarios autenticados.
- Preparar a arquitetura para evolucao com GIS, IA, drones e orcamento inteligente.

## 3. Problema

Empresas de piscinas geralmente dependem de visita presencial para iniciar a analise de viabilidade, entender o espaco disponivel e apresentar uma ideia visual ao cliente. Isso gera:

- Maior tempo ate a primeira proposta.
- Baixa clareza visual para o cliente.
- Dificuldade de comparar formatos, tamanhos e acabamentos.
- Processo comercial menos digitalizado.
- Baixa integracao entre mapa, projeto, orcamento e historico.

## 4. Solucao proposta

Uma plataforma web que combina:

- Autenticacao segura com token.
- Mapa ou imagem real como base do terreno.
- Configurador visual de piscinas.
- Renderizacao 3D com Three.js.
- Estrutura preparada para Google Maps, GIS e dados geoespaciais.
- Backend desacoplado com API REST.
- Banco PostgreSQL/Neon para persistencia futura em producao.

## 5. Publico-alvo

### Cliente residencial

Pessoa interessada em construir uma piscina e que deseja visualizar uma ideia inicial antes de contratar visita tecnica ou projeto completo.

### Consultor comercial

Profissional que atende leads, cria propostas iniciais, salva historico e apresenta alternativas visuais.

### Arquiteto, engenheiro ou designer de exteriores

Usuario tecnico que precisa avaliar espaco, posicao, modelo, dimensoes e compatibilidade visual com o terreno.

### Administrador da empresa

Responsavel por acompanhar projetos, usuarios, modelos de piscina, historico e possiveis metricas comerciais.

## 6. Personas

### Persona 1 - Cliente final

- Quer entender se uma piscina cabe no quintal.
- Nao tem conhecimento tecnico.
- Valoriza visualizacao simples e resultado rapido.
- Usa principalmente celular.

### Persona 2 - Vendedor tecnico

- Precisa montar uma proposta visual rapidamente.
- Usa computador ou tablet.
- Precisa acessar historico de projetos.
- Valoriza agilidade, clareza e apresentacao profissional.

### Persona 3 - Gestor da empresa

- Precisa acompanhar volume de projetos e leads.
- Quer padronizar o processo comercial.
- Valoriza dados, seguranca e escalabilidade.

## 7. Escopo MVP

O MVP deve entregar uma experiencia funcional para demonstracao academica e validacao inicial.

### Incluido no MVP

- Tela de login antes da plataforma.
- Cadastro/login com nome, email e senha.
- Autenticacao por JWT.
- Interface responsiva.
- Upload de imagem real do terreno.
- Visualizacao da imagem como base do projeto.
- Posicionamento manual da piscina.
- Troca de modelo, cor e dimensoes.
- Render 3D simples com Three.js.
- Modo anaglifo experimental.
- Botao de entrada em VR quando suportado.
- Salvamento de projetos via API.
- Historico basico de projetos.
- Rota `/health` para diagnostico da API.
- Suporte de idioma Portugues/Ingles.

### Fora do MVP

- Deteccao automatica real de quintal por IA.
- Medicao geoespacial precisa.
- Integracao completa com Google Maps em producao.
- Fotogrametria por drone.
- LiDAR.
- Orcamento tecnico definitivo.
- Projeto arquitetonico oficial.
- Realidade aumentada em escala real.

## 8. Requisitos funcionais

### RF01 - Autenticacao

O usuario deve conseguir acessar a plataforma somente apos login.

Critérios de aceite:

- Nome, email e senha sao obrigatorios.
- A API deve retornar token JWT em login valido.
- Rotas protegidas devem exigir Bearer Token.
- O frontend deve persistir a sessao localmente.

### RF02 - Selecao de idioma

O usuario deve poder alternar entre Portugues e Ingles.

Critérios de aceite:

- Textos principais mudam conforme idioma selecionado.
- Medidas e especificacoes devem estar coerentes com o idioma.
- Nao deve haver textos misturados indevidamente.

### RF03 - Upload de imagem do terreno

O usuario deve poder enviar uma imagem do terreno.

Critérios de aceite:

- Aceitar arquivos de imagem.
- Exibir a imagem como base visual.
- Manter a imagem visivel durante a configuracao.

### RF04 - Configuracao da piscina

O usuario deve configurar a piscina sobre a area visual.

Critérios de aceite:

- Alterar modelo.
- Alterar cor.
- Alterar tamanho.
- Posicionar manualmente no terreno.
- Visualizar resultado atualizado.

### RF05 - Renderizacao 3D

O usuario deve visualizar uma previa 3D do projeto.

Critérios de aceite:

- Render 3D deve carregar no navegador.
- Deve haver cena com piscina e area externa simplificada.
- Deve suportar visualizacao normal.
- Deve estar preparado para anaglifo e VR.

### RF06 - Salvamento de projeto

O usuario autenticado deve conseguir salvar um projeto.

Critérios de aceite:

- Projeto deve conter nome, endereco, coordenadas quando disponiveis, configuracao e status.
- API deve responder com projeto salvo.
- Historico deve listar projetos do usuario.

### RF07 - Painel administrativo basico

Administradores devem conseguir visualizar dados gerais.

Critérios de aceite:

- Listagem ou resumo de usuarios/projetos.
- Rota protegida por autenticacao.
- Estrutura preparada para evolucao.

## 9. Requisitos nao funcionais

### Performance

- Build frontend otimizada com Vite.
- Interface deve carregar rapidamente em desktop e celular.
- Cenas 3D devem ser leves para navegadores comuns.

### Responsividade

- Layout deve funcionar em celular, tablet e desktop.
- Elementos de login devem ser acessiveis em telas pequenas.
- Configurador deve continuar utilizavel em mobile.

### Seguranca

- Autenticacao baseada em JWT.
- Senhas armazenadas com hash no backend.
- Rotas protegidas por middleware.
- Variaveis sensiveis devem ficar em ambiente, nao no codigo.

### Escalabilidade

- Backend desacoplado do frontend.
- Organizacao por camadas: routes, controllers, services, repositories.
- Banco preparado para PostgreSQL/Neon.
- API REST preparada para integracoes futuras.

### Manutenibilidade

- Codigo modular.
- Componentes React separados por responsabilidade.
- Documentacao tecnica em `docs/`.
- Variaveis de ambiente documentadas.

## 10. Arquitetura

## 10.1. Tecnologias utilizadas

Esta secao consolida todas as tecnologias, conceitos e plataformas usados ou preparados no projeto.

### Frontend

- React: biblioteca principal para criacao da interface web.
- Vite: ferramenta de build e desenvolvimento rapido do frontend.
- JavaScript moderno: linguagem principal da aplicacao no navegador.
- HTML5: estrutura base da aplicacao.
- CSS3: estilos visuais e responsividade.
- TailwindCSS/PostCSS: organizacao e processamento de estilos.
- Lucide React: biblioteca de icones utilizada na interface.
- React RND: suporte para movimentar e redimensionar elementos visuais, como a piscina sobre o terreno.

### Backend

- Node.js: ambiente de execucao do backend.
- Express: framework para criacao da API REST.
- API REST: padrao de comunicacao entre frontend e backend.
- Middleware: validacao, autenticacao, logs e tratamento de erros.
- Morgan: logs basicos de requisicoes HTTP.
- Helmet: configuracoes basicas de seguranca HTTP.
- Zod: validacao de dados recebidos pela API.

### Autenticacao e seguranca

- JWT: geracao de token de autenticacao.
- Bearer Token: envio do token nas rotas protegidas.
- bcryptjs: hash seguro de senhas.
- CORS: controle de origens permitidas para acesso a API.
- Variaveis de ambiente: protecao de chaves, secrets e configuracoes sensiveis.

### Banco de dados

- PostgreSQL: banco relacional recomendado para persistencia principal.
- Neon Database: plataforma PostgreSQL serverless preparada para producao.
- SQL: linguagem usada para schema e seed inicial.
- Modo memory-fallback: persistencia temporaria em memoria para ambiente sem banco configurado.

### Mapas, GIS e sensoriamento remoto

- Google Maps Platform: integracao planejada para mapas e imagens de satelite.
- Geocoding API: conversao de endereco em latitude e longitude.
- Places API: suporte futuro para busca inteligente de enderecos.
- Maps JavaScript API: exibicao de mapa interativo no frontend.
- Coordenadas geograficas: uso de latitude e longitude para localizacao do terreno.
- GIS/SIG: conceito de sistema de informacao geografica aplicado a lotes, terrenos e camadas.
- Imagens aereas: base visual para analise do quintal.
- Imagens de satelite: base remota para visualizacao do terreno.
- Upload de imagem real: suporte para foto aerea, drone, print de mapa ou imagem do quintal.

### Renderizacao 3D e experiencia imersiva

- Three.js: motor 3D principal utilizado no navegador.
- WebGL: tecnologia grafica usada indiretamente pelo Three.js.
- Render 3D normal: visualizacao padrao da piscina e area externa.
- Visualizacao anaglifa: modo experimental para oculos vermelho/azul.
- WebXR/VR: base para entrada futura em realidade virtual.
- Modelagem parametrica simples: alteracao de formato, tamanho e cor da piscina.

### Tecnologias futuras planejadas

- Inteligencia artificial: sugestao automatica de melhor local para a piscina.
- Visao computacional: deteccao de areas livres, obstaculos e quintal.
- Fotogrametria: reconstrucao 3D com imagens de drone.
- Drones: captura de imagens aereas reais do terreno.
- LiDAR: nuvem de pontos para medicao precisa.
- Realidade aumentada: visualizacao da piscina no ambiente fisico.
- Cesium: possibilidade futura para mapas 3D estilo Google Earth.
- QGIS/ArcGIS: apoio conceitual para analises GIS avancadas.

### Deploy e infraestrutura

- Vercel: deploy do frontend e da API serverless.
- Serverless Functions: execucao da API no ambiente Vercel.
- GitHub: versionamento e hospedagem do repositorio.
- Git: controle de versao.
- npm Workspaces: organizacao inicial em monorepo.
- Variaveis de ambiente no Vercel: configuracao de `JWT_SECRET`, `DATABASE_URL`, `CLIENT_ORIGIN` e chaves externas.

### Documentacao e organizacao

- README: instrucoes principais do projeto.
- PRD: documento de requisitos de produto.
- Roadmap: planejamento de evolucao.
- Documentacao de arquitetura: explicacao tecnica da estrutura.
- `.env.example`: referencia das variaveis necessarias.

### Frontend

- React.
- Vite.
- TailwindCSS/PostCSS.
- Three.js.
- Componentes principais:
  - `App`
  - `AccountPanel`
  - `MapPanel`
  - `Configurator`
  - `ThreePoolScene`
  - `AddressSearch`
  - `KpiStrip`

### Backend

- Node.js.
- Express.
- API REST.
- JWT.
- Camadas:
  - routes
  - controllers
  - services
  - repositories
  - middleware
  - config

### Banco de dados

Banco recomendado: PostgreSQL com Neon Database.

Entidades principais:

- users
- projects
- terrains
- coordinates
- pool_models
- auth/session metadata

### Deploy

- Frontend e API publicados no Vercel.
- Frontend gerado em `dist`.
- API serverless em `/api/index.js`.
- Variaveis de ambiente configuradas no painel do Vercel.

## 11. Modelo inicial de dados

### users

- id
- name
- email
- password_hash
- role
- created_at

### projects

- id
- owner_id
- name
- address
- coordinate
- pool_model_id
- pool_config
- remote_sensing
- estimate
- status
- created_at
- updated_at

### pool_models

- id
- name
- category
- base_price
- dimensions
- metadata

### terrains

- id
- project_id
- source_type
- image_url
- bounds
- area_estimate
- metadata

## 12. Jornada principal do usuario

1. Usuario acessa a URL publica.
2. Usuario faz login ou cria conta.
3. Sistema valida credenciais e libera acesso.
4. Usuario informa endereco ou envia imagem real do terreno.
5. Sistema exibe base visual do terreno.
6. Usuario posiciona a piscina.
7. Usuario ajusta modelo, tamanho e cor.
8. Sistema atualiza visualizacao 3D.
9. Usuario salva o projeto.
10. Usuario consulta historico ou apresenta a previa ao cliente.

## 13. Criterios de sucesso

- Usuario consegue acessar a plataforma no celular e desktop.
- Login funciona em producao.
- Upload de imagem carrega sem quebrar a tela.
- Piscina pode ser visualizada e configurada.
- Render 3D aparece corretamente.
- API `/health` responde em producao.
- Projeto pode ser salvo em ambiente autenticado.
- Interface comunica visualmente um produto profissional de arquitetura/piscinas.

## 14. Metricas de produto

### Metricas iniciais

- Taxa de login bem-sucedido.
- Quantidade de projetos criados.
- Quantidade de uploads de imagem.
- Tempo medio ate primeira visualizacao 3D.
- Taxa de salvamento de projeto.
- Uso por dispositivo: mobile, tablet, desktop.

### Metricas futuras

- Conversao de lead em visita tecnica.
- Conversao de projeto em orcamento.
- Modelos de piscina mais escolhidos.
- Ticket medio estimado.
- Tempo medio entre criacao e fechamento.

## 15. Roadmap

### Fase 1 - MVP funcional

- Login e cadastro.
- Upload de imagem.
- Configurador manual.
- Render 3D simples.
- Deploy Vercel.
- API REST.

### Fase 2 - Plataforma inteligente

- Integracao real com Google Maps Platform.
- Busca por endereco.
- Coordenadas latitude/longitude.
- Camada satelite.
- Historico persistente com Neon PostgreSQL.
- Painel administrativo mais completo.

### Fase 3 - GIS e analise automatica

- Marcacao automatica de lote.
- Estimativa de area livre.
- Camadas GIS.
- Calculo aproximado de medidas.
- Relatorio tecnico inicial.

### Fase 4 - IA e visao computacional

- Identificacao automatica de quintal.
- Sugestao de melhor local para piscina.
- Deteccao de obstaculos.
- Classificacao de areas utilizaveis.
- Orcamento inteligente.

### Fase 5 - Imersao e engenharia avancada

- Realidade aumentada.
- VR com WebXR.
- Integracao com drones.
- Fotogrametria.
- Importacao de nuvem de pontos/LiDAR.
- Geracao automatica de projeto arquitetonico preliminar.

## 16. Riscos e mitigacoes

### Risco: dependencias de APIs externas

Mitigacao:

- Manter upload manual de imagem como alternativa.
- Isolar integracoes em services.
- Usar variaveis de ambiente.

### Risco: precisao insuficiente para obra real

Mitigacao:

- Deixar claro que o MVP e uma previa visual.
- Evoluir para dados GIS, drones e mediciones profissionais.
- Criar etapa de validacao tecnica.

### Risco: performance em celulares

Mitigacao:

- Manter modelos 3D leves.
- Reduzir efeitos pesados em telas pequenas.
- Otimizar Three.js e assets.

### Risco: seguranca de dados

Mitigacao:

- JWT com expiração.
- Hash de senha.
- Variaveis sensiveis fora do codigo.
- Revisar CORS e origem permitida antes de uso comercial.

## 17. Consideracoes tecnicas futuras

- Implementar banco PostgreSQL/Neon em producao.
- Migrar dados temporarios de memoria para persistencia real.
- Criar migrations versionadas.
- Adicionar testes automatizados.
- Adicionar observabilidade e logs estruturados.
- Criar dominio proprio.
- Revisar politicas de CORS para ambiente comercial.
- Adicionar armazenamento de imagens em servico externo.

## 18. Definicao de pronto

Uma versao e considerada pronta quando:

- Build passa localmente.
- Deploy no Vercel conclui com sucesso.
- Login funciona em desktop e celular.
- API `/health` responde.
- Fluxo principal de criacao/configuracao e acessivel.
- Interface nao quebra em telas pequenas.
- Documentacao basica esta atualizada.
