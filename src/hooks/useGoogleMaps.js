import { useEffect, useState } from "react";

export function useGoogleMaps() {
  const [state, setState] = useState({ status: "idle", google: null });
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setState({ status: "demo", google: null });
      return;
    }

    if (window.google?.maps) {
      setState({ status: "ready", google: window.google });
      return;
    }

    const existing = document.querySelector("script[data-google-maps]");
    if (existing) {
      existing.addEventListener("load", () => setState({ status: "ready", google: window.google }));
      return;
    }

    setState({ status: "loading", google: null });
    const script = document.createElement("script");
    script.dataset.googleMaps = "true";
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.onload = () => setState({ status: "ready", google: window.google });
    script.onerror = () => setState({ status: "demo", google: null });
    document.head.appendChild(script);
  }, [apiKey]);

  return state;
}
