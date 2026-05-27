# Sensoriamento Remoto e GIS

## Conceitos Aplicados

Sensoriamento remoto e a obtencao de informacoes da superficie terrestre sem contato fisico direto, usando satelites, aeronaves, drones, sensores opticos, LiDAR ou radar.

No contexto do projeto:

- Imagens aereas permitem interpretar telhado, vegetacao, patio, piscina existente, acesso lateral e area permeavel.
- Geocodificacao transforma endereco textual em coordenadas geograficas.
- GIS/SIG organiza dados espaciais, camadas, geometrias e metadados.
- Coordenadas em EPSG:4326 representam latitude e longitude em WGS84.
- Analise de terreno pode estimar areas livres, obstaculos e restricoes.

## Pipeline MVP

1. Entrada do endereco.
2. Geocodificacao para latitude e longitude.
3. Visualizacao satelite do lote.
4. Opcionalmente, upload de foto real do quintal, drone ou vista aerea.
5. Selecao manual da area aproveitavel.
6. Conversao da selecao em configuracao do projeto.
7. Renderizacao 3D conceitual.
8. Visualizacao imersiva em WebXR ou modo anaglifo para apresentacao com profundidade.

## Imagens Reais no MVP

O sistema aceita imagem local em JPG, PNG ou WebP para simular uma base real de sensoriamento remoto. Essa imagem pode vir de:

- Foto do quintal
- Drone residencial
- Captura aerea autorizada
- Levantamento preliminar da obra

No MVP, a piscina e sobreposta manualmente sobre essa imagem com controles de arrastar, redimensionar e rotacionar. Em uma etapa futura, pontos de controle e escala real podem georreferenciar a foto para medições mais precisas.

## Pipeline Avancado

1. Obter imagem de alta resolucao por satelite, drone ou ortomosaico.
2. Segmentar pixels em telhado, grama, piso, arvore, sombra e construcao.
3. Detectar poligonos livres no quintal.
4. Aplicar regras urbanisticas: recuos, area permeavel, acesso e inclinacao.
5. Sugerir posicionamento e modelo de piscina.
6. Gerar planta baixa, memorial tecnico e estimativa inteligente.

## IA e Visao Computacional

Modelos futuros podem usar segmentacao semantica para identificar:

- Areas verdes
- Superficies concretadas
- Coberturas
- Muros
- Sombras
- Arvores
- Regioes livres para construcao

Bibliotecas candidatas: OpenCV, TensorFlow.js, PyTorch, Segment Anything, YOLO e modelos GIS especializados.

## Visualizacao Imersiva

O MVP usa Three.js como motor 3D e adiciona dois caminhos imersivos:

- WebXR/VR: permite abrir a cena em headsets compativeis diretamente pelo navegador.
- Anaglifo vermelho/ciano: gera duas imagens deslocadas para simular profundidade com oculos 3D simples.

Essa abordagem preserva o projeto como web app, sem depender inicialmente de Unity ou Unreal Engine. Em uma versao futura, modelos vindos de fotogrametria, LiDAR ou Cesium 3D Tiles podem alimentar a mesma experiencia.
