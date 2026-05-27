import { Activity, Cpu, Ruler, Satellite, ShieldCheck } from "lucide-react";

export function KpiStrip({ geocode, t }) {
  const items = [
    { icon: Satellite, label: t.image, value: geocode?.provider === "google-geocoding" ? t.realSatellite : t.demo },
    { icon: Ruler, label: t.gisRadius, value: `${geocode?.viewport?.radiusMeters || 45} m` },
    { icon: Cpu, label: t.futureAi, value: t.cvReady },
    { icon: ShieldCheck, label: "CRS", value: geocode?.gis?.crs || "EPSG:4326" },
    { icon: Activity, label: t.status, value: t.activeMvp }
  ];

  return (
    <div className="kpi-strip">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div className="kpi" key={item.label}>
            <Icon size={18} />
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        );
      })}
    </div>
  );
}
