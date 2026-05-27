import { Glasses, Maximize2, Rotate3D, View } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { AnaglyphEffect } from "three/examples/jsm/effects/AnaglyphEffect.js";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";

export function ThreePoolScene({ model, poolConfig }) {
  const hostRef = useRef(null);
  const vrSlotRef = useRef(null);
  const sceneState = useRef(null);
  const [viewMode, setViewMode] = useState("standard");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#eef4ef");
    scene.fog = new THREE.Fog("#eef4ef", 18, 42);

    const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(8, 8, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.xr.enabled = true;
    host.appendChild(renderer.domElement);

    const anaglyph = new AnaglyphEffect(renderer);
    anaglyph.setSize(host.clientWidth, host.clientHeight);

    const vrButton = VRButton.createButton(renderer);
    vrButton.classList.add("xr-button");
    vrSlotRef.current?.appendChild(vrButton);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI * 0.47;
    controls.minDistance = 7;
    controls.maxDistance = 22;
    controls.target.set(0, 0.25, 0);

    const hemi = new THREE.HemisphereLight("#ffffff", "#5e7a60", 1.7);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight("#fff2d5", 3.2);
    sun.position.set(-5, 9, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const group = new THREE.Group();
    scene.add(group);

    const yard = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 14, 24, 24),
      new THREE.MeshStandardMaterial({ color: "#6e9b59", roughness: 0.95 })
    );
    yard.rotation.x = -Math.PI / 2;
    yard.receiveShadow = true;
    group.add(yard);

    const house = new THREE.Mesh(
      new THREE.BoxGeometry(7.5, 1.6, 3.6),
      new THREE.MeshStandardMaterial({ color: "#f7f0e2", roughness: 0.8 })
    );
    house.position.set(-3.7, 0.8, -4.4);
    house.castShadow = true;
    group.add(house);

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(4.8, 1.35, 4),
      new THREE.MeshStandardMaterial({ color: "#b85f3c", roughness: 0.75 })
    );
    roof.rotation.y = Math.PI / 4;
    roof.scale.z = 0.48;
    roof.position.set(-3.7, 2.25, -4.4);
    roof.castShadow = true;
    group.add(roof);

    sceneState.current = {
      scene,
      camera,
      renderer,
      anaglyph,
      controls,
      group,
      poolGroup: null,
      water: null,
      viewMode: "standard"
    };

    function resize() {
      if (!host.clientWidth || !host.clientHeight) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
      anaglyph.setSize(host.clientWidth, host.clientHeight);
    }

    function animate() {
      if (sceneState.current.water) {
        sceneState.current.water.material.opacity = 0.74 + Math.sin(performance.now() * 0.002) * 0.04;
      }
      controls.update();
      if (sceneState.current.viewMode === "anaglyph" && !renderer.xr.isPresenting) {
        anaglyph.render(scene, camera);
      } else {
        renderer.render(scene, camera);
      }
    }

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    renderer.setAnimationLoop(animate);

    return () => {
      observer.disconnect();
      renderer.setAnimationLoop(null);
      controls.dispose();
      renderer.dispose();
      vrButton.remove();
      host.removeChild(renderer.domElement);
      scene.traverse((object) => {
        object.geometry?.dispose?.();
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose?.());
        else object.material?.dispose?.();
      });
      sceneState.current = null;
    };
  }, []);

  useEffect(() => {
    if (sceneState.current) {
      sceneState.current.viewMode = viewMode;
    }
  }, [viewMode]);

  useEffect(() => {
    if (!sceneState.current || !model) return;
    buildPoolScene(sceneState.current, model, poolConfig);
  }, [model, poolConfig]);

  return (
    <section className="three-panel">
      <div className="panel-heading overlay">
        <div>
          <span className="eyebrow">Render 3D</span>
          <h2>{model?.name || "Piscina residencial"}</h2>
        </div>
        <div className="map-badges">
          <span>
            <Rotate3D size={15} />
            Orbit
          </span>
          <span>
            <Maximize2 size={15} />
            WebGL
          </span>
        </div>
      </div>
      <div className="immersive-toolbar" aria-label="Modos de visualizacao imersiva">
        <button
          className={viewMode === "standard" ? "active" : ""}
          type="button"
          onClick={() => setViewMode("standard")}
          title="Visualizacao 3D padrao"
        >
          <View size={16} />
          <span>Normal</span>
        </button>
        <button
          className={viewMode === "anaglyph" ? "active" : ""}
          type="button"
          onClick={() => setViewMode("anaglyph")}
          title="Modo 3D anaglifo vermelho e ciano"
        >
          <Glasses size={16} />
          <span>Anaglifo</span>
        </button>
        <div className="vr-slot" ref={vrSlotRef} />
      </div>
      <div className="three-host" ref={hostRef} data-testid="three-scene" />
    </section>
  );
}

function buildPoolScene(state, model, config) {
  if (state.poolGroup) {
    state.group.remove(state.poolGroup);
    state.poolGroup.traverse((object) => {
      object.geometry?.dispose?.();
      if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose?.());
      else object.material?.dispose?.();
    });
  }

  const poolGroup = new THREE.Group();
  const dimensions = model.dimensions || { width: 4, length: 8, depth: 1.35 };
  const width = dimensions.width * config.scale;
  const length = dimensions.length * config.scale;
  const x = ((config.position.x - 50) / 50) * 3.2;
  const z = ((config.position.y - 50) / 50) * 2.8;
  poolGroup.position.set(x, 0.03, z);
  poolGroup.rotation.y = THREE.MathUtils.degToRad(config.footprint?.rotation || 0);

  if (config.features.deck) {
    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(width + 2.2, 0.18, length + 2.2),
      new THREE.MeshStandardMaterial({ color: "#c79a63", roughness: 0.7 })
    );
    deck.position.y = 0.03;
    deck.receiveShadow = true;
    deck.castShadow = true;
    poolGroup.add(deck);
  }

  const shell = createShell(model.id, width, length);
  shell.position.y = 0.16;
  shell.traverse((object) => {
    object.castShadow = true;
    object.receiveShadow = true;
  });
  poolGroup.add(shell);

  const water = createWater(model.id, width * 0.86, length * 0.86, config.color);
  water.position.y = 0.29;
  poolGroup.add(water);
  state.water = water;

  if (config.features.lighting) {
    addPoolLights(poolGroup, width, length, config.color);
  }

  if (config.features.trees) {
    addTrees(poolGroup, width, length);
  }

  if (config.features.gourmet) {
    addGourmetArea(poolGroup, width, length);
  }

  state.group.add(poolGroup);
  state.poolGroup = poolGroup;
}

function createShell(modelId, width, length) {
  const material = new THREE.MeshStandardMaterial({ color: "#f4efe4", roughness: 0.52, metalness: 0.05 });

  if (modelId === "family-freeform") {
    const shape = new THREE.Shape();
    shape.absellipse(0, 0, width / 2, length / 2, 0, Math.PI * 2, false, 0);
    const hole = new THREE.Path();
    hole.absellipse(0, 0, width * 0.39, length * 0.39, 0, Math.PI * 2, true, 0);
    shape.holes.push(hole);
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.28, bevelEnabled: true, bevelSize: 0.08, bevelSegments: 8 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  if (modelId === "compact-spa") {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(width / 2, 0.22, 14, 72), material);
    ring.rotation.x = Math.PI / 2;
    return ring;
  }

  const rim = new THREE.Group();
  const thickness = 0.36;
  const height = 0.28;
  const parts = [
    { size: [width + thickness, height, thickness], position: [0, 0, -length / 2] },
    { size: [width + thickness, height, thickness], position: [0, 0, length / 2] },
    { size: [thickness, height, length], position: [-width / 2, 0, 0] },
    { size: [thickness, height, length], position: [width / 2, 0, 0] }
  ];

  parts.forEach((part) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...part.size), material);
    mesh.position.set(...part.position);
    rim.add(mesh);
  });

  return rim;
}

function createWater(modelId, width, length, color) {
  const material = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.08,
    transmission: 0.2,
    transparent: true,
    opacity: 0.76,
    clearcoat: 1
  });

  if (modelId === "family-freeform") {
    const shape = new THREE.Shape();
    shape.ellipse(0, 0, width / 2, length / 2, 0, Math.PI * 2);
    const geometry = new THREE.ShapeGeometry(shape, 72);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  if (modelId === "compact-spa") {
    return new THREE.Mesh(new THREE.CircleGeometry(width / 2, 64), material);
  }

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, length), material);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

function addPoolLights(group, width, length, color) {
  const positions = [
    [-width / 2 + 0.35, 0.42, -length / 2 + 0.35],
    [width / 2 - 0.35, 0.42, length / 2 - 0.35]
  ];

  positions.forEach((position) => {
    const light = new THREE.PointLight(color, 1.7, 4);
    light.position.set(...position);
    group.add(light);

    const lens = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 12),
      new THREE.MeshStandardMaterial({ color: "#fff8ce", emissive: color, emissiveIntensity: 1.5 })
    );
    lens.position.set(...position);
    group.add(lens);
  });
}

function addTrees(group, width, length) {
  const spots = [
    [-width / 2 - 1.2, 0, -length / 2 - 0.8],
    [width / 2 + 1.2, 0, length / 2 + 0.9],
    [width / 2 + 1.35, 0, -length / 2 - 1.05]
  ];

  spots.forEach(([x, y, z]) => {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.12, 0.85, 10),
      new THREE.MeshStandardMaterial({ color: "#7c5135", roughness: 0.8 })
    );
    trunk.position.set(x, y + 0.42, z);
    trunk.castShadow = true;
    group.add(trunk);

    const canopy = new THREE.Mesh(
      new THREE.SphereGeometry(0.48, 18, 14),
      new THREE.MeshStandardMaterial({ color: "#2f7b4b", roughness: 0.9 })
    );
    canopy.position.set(x, y + 1.05, z);
    canopy.castShadow = true;
    group.add(canopy);
  });
}

function addGourmetArea(group, width, length) {
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.16, 2.1),
    new THREE.MeshStandardMaterial({ color: "#d8d2c5", roughness: 0.85 })
  );
  floor.position.set(-width / 2 - 2.35, 0.08, length / 2 - 0.5);
  floor.castShadow = true;
  floor.receiveShadow = true;
  group.add(floor);

  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.62, 0.42),
    new THREE.MeshStandardMaterial({ color: "#4c4f4a", roughness: 0.45 })
  );
  counter.position.set(-width / 2 - 2.35, 0.47, length / 2 - 1.1);
  counter.castShadow = true;
  group.add(counter);
}
