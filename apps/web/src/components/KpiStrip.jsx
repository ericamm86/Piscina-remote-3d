import { Activity, Cpu, Ruler, Satellite, ShieldCheck } from "lucide-react";

export function KpiStrip({ geocode }) {
  const items = [
    { icon: Satellite, label: "Imagem", value: geocode?.provider === "google-geocoding" ? "Sat real" : "Demo" },
    { icon: Ruler, label: "Raio GIS", value: `${geocode?.viewport?.radiusMeters || 45} m` },
    { icon: Cpu, label: "IA futura", value: "CV ready" },
    { icon: ShieldCheck, label: "CRS", value: geocode?.gis?.crs || "EPSG:4326" },
    { icon: Activity, label: "Status", value: "MVP ativo" }
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
