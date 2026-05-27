const demoLocations = [
  {
    label: "Fortaleza, CE",
    lat: -3.7319,
    lng: -38.5267
  },
  {
    label: "Orlando, Florida",
    lat: 28.5384,
    lng: -81.3789
  },
  {
    label: "Miami, Florida",
    lat: 25.7617,
    lng: -80.1918
  }
];

function hashAddress(address) {
  return [...address].reduce((total, char) => total + char.charCodeAt(0), 0);
}

function buildDemoResult(address) {
  const location = demoLocations[hashAddress(address) % demoLocations.length];
  const offset = (hashAddress(address) % 70) / 10000;

  return {
    provider: "gis-base",
    formattedAddress: `${address} - base cartografica (${location.label})`,
    coordinates: {
      lat: Number((location.lat + offset).toFixed(6)),
      lng: Number((location.lng - offset).toFixed(6))
    },
    viewport: {
      radiusMeters: 45,
      heading: 32,
      pitch: 0
    },
    gis: {
      crs: "EPSG:4326",
      source: "local-gis-base",
      confidence: 0.68
    }
  };
}

export async function geocodeAddress(address) {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    return buildDemoResult(address);
  }

  const params = new URLSearchParams({
    address,
    key: process.env.GOOGLE_MAPS_API_KEY
  });

  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`);
  const payload = await response.json();

  if (payload.status !== "OK" || !payload.results?.length) {
    const err = new Error("Endereco nao encontrado pela Geocoding API");
    err.status = 404;
    err.details = payload;
    throw err;
  }

  const result = payload.results[0];
  return {
    provider: "google-geocoding",
    formattedAddress: result.formatted_address,
    coordinates: {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng
    },
    viewport: {
      radiusMeters: 45,
      heading: 32,
      pitch: 0
    },
    gis: {
      crs: "EPSG:4326",
      source: "Google Geocoding API",
      confidence: result.geometry.location_type === "ROOFTOP" ? 0.96 : 0.82
    }
  };
}
