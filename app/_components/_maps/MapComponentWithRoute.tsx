"use client";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocale } from "next-intl";

// ✅ Order Icon (blue)
const customIconOrder = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// ✅ User Icon (green)
const customIconUser = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

interface LatLng {
  lat: number;
  lang: number;
}

interface Props {
  orgLocation: { address: string; coordinates: LatLng };
  userLocation?: LatLng | null;
}

// ✅ Helper component to auto-fit bounds
function FitBounds({ org, user }: { org: LatLng; user?: LatLng | null }) {
  const map = useMap();

  useEffect(() => {
    if (user) {
      const bounds = L.latLngBounds([org.lat, org.lang], [user.lat, user.lang]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([org.lat, org.lang], 12); // default zoom if no user location
    }
  }, [org, user, map]);

  return null;
}

export default function MapComponentWithRoute({
  orgLocation,
  userLocation,
}: Props) {
  const locale = useLocale();

  const orderLatLng: LatLng = orgLocation.coordinates;
  const userLatLng: LatLng | null = userLocation ?? null;

  return (
    <MapContainer
      center={{ lat: orderLatLng.lat, lng: orderLatLng.lang }}
      zoom={12}
      scrollWheelZoom
      className="lg:h-[600px] h-[60vh] w-full outline-none rounded-2xl z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Auto fit bounds */}
      <FitBounds org={orderLatLng} user={userLatLng} />

      {/* Marker: Organization */}
      <Marker
        position={{ lat: orderLatLng.lat, lng: orderLatLng.lang }}
        icon={customIconOrder}
      >
        <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
          {locale === "ar" ? orgLocation.address : "Center Location"}
        </Tooltip>
      </Marker>

      {/* Marker: User */}
      {userLatLng && (
        <Marker
          position={{ lat: userLatLng.lat, lng: userLatLng.lang }}
          icon={customIconUser}
        >
          <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
            {locale === "ar" ? "موقعك" : "Your Location"}
          </Tooltip>
        </Marker>
      )}

      {/* Polyline between points */}
      {userLatLng && (
        <Polyline
          positions={[
            [orderLatLng.lat, orderLatLng.lang],
            [userLatLng.lat, userLatLng.lang],
          ]}
          color="#007bff"
          weight={4}
          opacity={0.8}
          dashArray="8"
          smoothFactor={1}
        />
      )}
    </MapContainer>
  );
}
