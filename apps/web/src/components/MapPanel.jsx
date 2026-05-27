import { Crosshair, ImageUp, Layers, Satellite, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGoogleMaps } from "../hooks/useGoogleMaps";

export function MapPanel({ geocode, poolConfig, siteImage, onSiteImageUpload, onSiteImageRemove, onPoolPositionChange }) {
  const mapElement = useRef(null);
  const mapInstance = useRef(null);
  const rectangleRef = useRef(null);
  const { status, google } = useGoogleMaps();
  const [demoPosition, setDemoPosition] = useState(poolConfig.position);

  useEffect(() => {
    if (status !== "ready" || !google || !mapElement.current || !geocode?.coordinates) return;

    const center = geocode.coordinates;
    mapInstance.current = new google.maps.Map(mapElement.current, {
      center,
      zoom: 20,
      tilt: 0,
      mapTypeId: "satellite",
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: true
    });

    new google.maps.Marker({
      position: center,
      map: mapInstance.current,
      title: "Residencia analisada"
    });
  }, [status, google, geocode]);

  useEffect(() => {
    if (!google || !mapInstance.current || !geocode?.coordinates) return;

    const latDelta = 0.000045 * (poolConfig.scale || 1);
    const lngDelta = 0.00007 * (poolConfig.scale || 1);
    const latOffset = ((poolConfig.position.y - 50) / 50) * 0.00008;
    const lngOffset = ((poolConfig.position.x - 50) / 50) * 0.00008;
    const center = {
      lat: geocode.coordinates.lat - latOffset,
      lng: geocode.coordinates.lng + lngOffset
    };

    const bounds = {
      north: center.lat + latDelta,
      south: center.lat - latDelta,
      east: center.lng + lngDelta,
      west: center.lng - lngDelta
    };

    rectangleRef.current?.setMap(null);
    rectangleRef.current = new google.maps.Rectangle({
      bounds,
      map: mapInstance.current,
      editable: true,
      draggable: true,
      strokeColor: poolConfig.color,
      strokeOpacity: 0.95,
      strokeWeight: 2,
      fillColor: poolConfig.color,
      fillOpacity: 0.35
    });
  }, [google, geocode, poolConfig]);

  function handleDemoClick(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const next = {
      x: Math.round(((event.clientX - rect.left) / rect.width) * 100),
      y: Math.round(((event.clientY - rect.top) / rect.height) * 100)
    };
    setDemoPosition(next);
    onPoolPositionChange(next);
  }

  return (
    <section className="map-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Sensoriamento remoto</span>
          <h2>Imagem aerea e selecao do quintal</h2>
        </div>
        <div className="map-badges">
          <span>
            <Satellite size={15} />
            {siteImage ? "Imagem real" : status === "ready" ? "Google Satellite" : "Demo GIS"}
          </span>
          <span>
            <Layers size={15} />
            EPSG:4326
          </span>
        </div>
      </div>

      <div className="image-uploader">
        <label>
          <ImageUp size={17} />
          <span>{siteImage ? siteImage.name : "Carregar foto real do quintal ou drone"}</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => onSiteImageUpload(event.target.files?.[0])}
          />
        </label>
        {siteImage && (
          <button type="button" onClick={onSiteImageRemove} title="Remover imagem real">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {siteImage ? (
        <button
          className="demo-map real-image-map"
          type="button"
          onClick={handleDemoClick}
          aria-label="Imagem real do terreno"
          style={{ backgroundImage: `linear-gradient(rgba(12, 22, 18, 0.12), rgba(12, 22, 18, 0.12)), url(${siteImage.url})` }}
        >
          <span className="real-image-grid" />
          <span
            className="demo-pool real-image-pool"
            style={{
              left: `${demoPosition.x}%`,
              top: `${demoPosition.y}%`,
              backgroundColor: poolConfig.color
            }}
          />
          <span className="demo-target">
            <Crosshair size={18} />
            Clique na foto para posicionar a piscina
          </span>
        </button>
      ) : status === "ready" ? (
        <div className="google-map" ref={mapElement} aria-label="Mapa satelite do terreno" />
      ) : (
        <button className="demo-map" type="button" onClick={handleDemoClick} aria-label="Mapa demonstrativo">
          <span className="demo-map-grid" />
          <span className="demo-house" />
          <span className="demo-driveway" />
          <span className="demo-tree demo-tree-a" />
          <span className="demo-tree demo-tree-b" />
          <span
            className="demo-pool"
            style={{
              left: `${demoPosition.x}%`,
              top: `${demoPosition.y}%`,
              backgroundColor: poolConfig.color
            }}
          />
          <span className="demo-target">
            <Crosshair size={18} />
            Clique no quintal para reposicionar
          </span>
        </button>
      )}

      <div className="geo-readout">
        <div>
          <strong>{siteImage ? `Base real: ${siteImage.name}` : geocode?.formattedAddress || "Endereco ainda nao processado"}</strong>
          <span>
            {siteImage
              ? `Arquivo local / ${(siteImage.size / 1024 / 1024).toFixed(2)} MB / posicao X ${poolConfig.position.x} Y ${poolConfig.position.y}`
              : `Latitude ${geocode?.coordinates?.lat?.toFixed(6) || "-"} / Longitude ${geocode?.coordinates?.lng?.toFixed(6) || "-"}`}
          </span>
        </div>
        <div>
          <strong>{siteImage ? "Modo" : "Confianca GIS"}</strong>
          <span>{siteImage ? "Foto real" : `${Math.round((geocode?.gis?.confidence || 0.68) * 100)}%`}</span>
        </div>
      </div>
    </section>
  );
}
