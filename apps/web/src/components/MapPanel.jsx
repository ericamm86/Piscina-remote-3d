import { Crosshair, ImageUp, Layers, Satellite, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { useGoogleMaps } from "../hooks/useGoogleMaps";

export function MapPanel({ geocode, poolConfig, siteImage, onSiteImageUpload, onSiteImageRemove, onPoolLayoutChange, t }) {
  const mapElement = useRef(null);
  const realMapRef = useRef(null);
  const mapInstance = useRef(null);
  const rectangleRef = useRef(null);
  const { status, google } = useGoogleMaps();
  const [demoPosition, setDemoPosition] = useState(poolConfig.position);
  const [realPool, setRealPool] = useState(() => ({
    x: 0,
    y: 0,
    width: poolConfig.footprint?.width || 190,
    height: poolConfig.footprint?.height || 108
  }));
  const formattedAddress = geocode?.formattedAddress?.replace("visualizacao demonstrativa", t.demoVisualization);

  useEffect(() => {
    if (!siteImage || !realMapRef.current) return;

    const rect = realMapRef.current.getBoundingClientRect();
    const width = poolConfig.footprint?.width || 190;
    const height = poolConfig.footprint?.height || 108;
    setRealPool({
      x: (rect.width * poolConfig.position.x) / 100 - width / 2,
      y: (rect.height * poolConfig.position.y) / 100 - height / 2,
      width,
      height
    });
  }, [siteImage]);

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
    onPoolLayoutChange({ position: next });
  }

  function syncRealPool(nextRect) {
    const bounds = realMapRef.current?.getBoundingClientRect();
    if (!bounds?.width || !bounds?.height) return;

    const position = {
      x: Math.round(((nextRect.x + nextRect.width / 2) / bounds.width) * 100),
      y: Math.round(((nextRect.y + nextRect.height / 2) / bounds.height) * 100)
    };

    setDemoPosition(position);
    setRealPool(nextRect);
    onPoolLayoutChange({
      position,
      footprint: {
        width: Math.round(nextRect.width),
        height: Math.round(nextRect.height)
      }
    });
  }

  return (
    <section className="map-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">{t.remoteSensing}</span>
          <h2>{t.aerialImageTitle}</h2>
        </div>
        <div className="map-badges">
          <span>
            <Satellite size={15} />
            {siteImage ? t.realImage : status === "ready" ? t.googleSatellite : t.demoGis}
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
          <span>{siteImage ? siteImage.name : t.uploadRealImage}</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => onSiteImageUpload(event.target.files?.[0])}
          />
        </label>
        {siteImage && (
          <button type="button" onClick={onSiteImageRemove} title={t.removeRealImage}>
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {siteImage ? (
        <div
          className="demo-map real-image-map"
          aria-label={t.realTerrainImage}
          role="application"
          ref={realMapRef}
          style={{ backgroundImage: `linear-gradient(rgba(12, 22, 18, 0.12), rgba(12, 22, 18, 0.12)), url(${siteImage.url})` }}
        >
          <span className="real-image-grid" />
          <Rnd
            className="pool-rnd"
            bounds="parent"
            size={{ width: realPool.width, height: realPool.height }}
            position={{ x: realPool.x, y: realPool.y }}
            minWidth={86}
            minHeight={48}
            lockAspectRatio={false}
            onDragStop={(_event, data) => syncRealPool({ ...realPool, x: data.x, y: data.y })}
            onResizeStop={(_event, _direction, ref, _delta, position) =>
              syncRealPool({
                x: position.x,
                y: position.y,
                width: ref.offsetWidth,
                height: ref.offsetHeight
              })
            }
          >
            <span
              className="real-image-pool"
              style={{
                backgroundColor: poolConfig.color,
                transform: `rotate(${poolConfig.footprint?.rotation || 0}deg)`
              }}
            >
              <span className="pool-ruler horizontal">{Math.round(realPool.width)} px</span>
              <span className="pool-ruler vertical">{Math.round(realPool.height)} px</span>
            </span>
          </Rnd>
          <span className="demo-target">
            <Crosshair size={18} />
            {t.dragResizePool}
          </span>
        </div>
      ) : status === "ready" ? (
        <div className="google-map" ref={mapElement} aria-label={t.googleSatellite} />
      ) : (
        <button className="demo-map" type="button" onClick={handleDemoClick} aria-label={t.demoMap}>
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
            {t.clickBackyard}
          </span>
        </button>
      )}

      <div className="geo-readout">
        <div>
          <strong>{siteImage ? `${t.realBase}: ${siteImage.name}` : formattedAddress || t.pendingAddress}</strong>
          <span>
            {siteImage
              ? `${t.localFile} / ${(siteImage.size / 1024 / 1024).toFixed(2)} MB / ${t.position} X ${poolConfig.position.x} Y ${poolConfig.position.y}`
              : `${t.latitude} ${geocode?.coordinates?.lat?.toFixed(6) || "-"} / ${t.longitude} ${geocode?.coordinates?.lng?.toFixed(6) || "-"}`}
          </span>
        </div>
        <div>
          <strong>{siteImage ? t.mode : t.gisConfidence}</strong>
          <span>{siteImage ? t.realPhoto : `${Math.round((geocode?.gis?.confidence || 0.68) * 100)}%`}</span>
        </div>
      </div>
    </section>
  );
}
