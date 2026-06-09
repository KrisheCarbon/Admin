"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { reverseGeocode } from "@/lib/reverseGeocode";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function LocationPicker({ value, onChange }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markerRef = useRef(null);

  const [mode, setMode] = useState("search");
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");
  const [gmapsUrl, setGmapsUrl] = useState("");

  /* ------------------ Map init (ONLY ONCE) ------------------ */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [78.4867, 17.385],
      zoom: 5,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.resize();
      setTimeout(() => map.resize(), 300);
    });

    /* Search */
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      countries: "IN",
      placeholder: "Search location",
    });

    map.addControl(geocoder, "top-left");

    geocoder.on("result", (e) => {
      const [lng, lat] = e.result.center;
      setMarker(lng, lat);
      onChange({
        lat,
        lng,
        place_name: e.result.place_name,
        source: "mapbox_search",
        raw: e.result,
      });
    });

    /* Click on map */
    map.on("click", async (e) => {
      const { lng, lat } = e.lngLat;
      setMarker(lng, lat);

      const geo = await reverseGeocode(lat, lng);
      onChange({
        lat,
        lng,
        place_name: geo?.features?.[0]?.place_name ?? null,
        source: "map_click",
        raw: geo,
      });
    });
  }, []);

  /* ------------------ Marker helper ------------------ */
  function setMarker(lng, lat) {
    if (!mapRef.current) return;
    if (markerRef.current) markerRef.current.remove();

    markerRef.current = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    mapRef.current.flyTo({ center: [lng, lat], zoom: 12 });
  }

  /* ------------------ My Location ------------------ */
  function useMyLocation() {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMarker(lng, lat);

        const geo = await reverseGeocode(lat, lng);

        onChange({
          lat,
          lng,
          place_name: geo?.features?.[0]?.place_name ?? null,
          source: "device_gps",
          raw: geo,
        });
      },
      () => alert("Location permission denied")
    );
  }

  /* ------------------ Coordinates ------------------ */
  function applyCoordinates() {
    const lat = Number(latInput);
    const lng = Number(lngInput);
    if (isNaN(lat) || isNaN(lng)) {
      alert("Invalid coordinates");
      return;
    }
    setMarker(lng, lat);
    onChange({
      lat,
      lng,
      source: "manual_coordinates",
    });
  }

  /* ------------------ Google Maps URL ------------------ */
  function applyGoogleMapsUrl() {
    const match = gmapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (!match) {
      alert("Invalid Google Maps URL");
      return;
    }

    const lat = Number(match[1]);
    const lng = Number(match[2]);
    setMarker(lng, lat);

    onChange({
      lat,
      lng,
      source: "google_maps_url",
      raw_url: gmapsUrl,
    });
  }

  return (
    <div className="space-y-3">
      {/* Mode buttons */}
      <div className="flex flex-wrap gap-2 text-sm">
        {[
          ["search", "Search"],
          ["gps", "My location"],
          ["coords", "Coordinates"],
          ["gmaps", "Google Maps URL"],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setMode(k)}
            className={`px-3 py-1 rounded border ${
              mode === k ? "bg-black text-white" : "bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Extra inputs */}
      {mode === "gps" && (
        <button
          onClick={useMyLocation}
          className="text-sm text-blue-600"
        >
          Use my current location
        </button>
      )}

      {mode === "coords" && (
        <div className="flex gap-2">
          <input
            placeholder="Latitude"
            className="border px-2 py-1 rounded w-1/2"
            value={latInput}
            onChange={(e) => setLatInput(e.target.value)}
          />
          <input
            placeholder="Longitude"
            className="border px-2 py-1 rounded w-1/2"
            value={lngInput}
            onChange={(e) => setLngInput(e.target.value)}
          />
          <button
            onClick={applyCoordinates}
            className="text-sm text-blue-600"
          >
            Set
          </button>
        </div>
      )}

      {mode === "gmaps" && (
        <div className="flex gap-2">
          <input
            placeholder="Paste Google Maps URL"
            className="border px-2 py-1 rounded w-full"
            value={gmapsUrl}
            onChange={(e) => setGmapsUrl(e.target.value)}
          />
          <button
            onClick={applyGoogleMapsUrl}
            className="text-sm text-blue-600"
          >
            Set
          </button>
        </div>
      )}

      {/* Map */}
      <div
        ref={containerRef}
        className="w-full h-[300px] rounded border"
      />

      {/* Selected output */}
      {value?.lat && value?.lng && (
        <p className="text-xs text-gray-600">
          📍 {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
          {value.place_name && ` — ${value.place_name}`}
        </p>
      )}
    </div>
  );
}
