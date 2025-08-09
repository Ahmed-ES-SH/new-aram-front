"use client";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // تأكد من استيراد CSS
import { useLocale } from "next-intl";

// ✅ أيقونة الطلب (زرقاء)
const customIconOrder = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// ✅ أيقونة المستخدم (خضراء)
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
  lng: number;
}

interface Props {
  orderLocation: LatLng;
  userLocation?: LatLng | null;
}

export default function MapComponentWithRoute({
  orderLocation,
  userLocation,
}: Props) {
  const locale = useLocale();
  const [mapCenter, setMapCenter] = useState<LatLng>(orderLocation);

  useEffect(() => {
    if (userLocation) {
      const midLat = (orderLocation.lat + userLocation.lat) / 2;
      const midLng = (orderLocation.lng + userLocation.lng) / 2;
      setMapCenter({ lat: midLat, lng: midLng });
    }
  }, [orderLocation, userLocation]);

  const orderLatLng: LatLng = orderLocation;
  const userLatLng: LatLng | null = userLocation ?? null;

  return (
    <MapContainer
      center={mapCenter}
      zoom={10}
      scrollWheelZoom
      className="lg:h-[600px] h-[60vh] w-full outline-none rounded-2xl z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Marker: موقع الطلب */}
      <Marker position={orderLatLng} icon={customIconOrder}>
        <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
          {locale === "ar" ? "موقع الطلب" : "Order Location"}
        </Tooltip>
      </Marker>

      {/* Marker: موقع المستخدم */}
      {userLatLng && (
        <Marker position={userLatLng} icon={customIconUser}>
          <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
            {locale === "ar" ? "موقعك" : "Your Location"}
          </Tooltip>
        </Marker>
      )}

      {/* Polyline بين الموقعين */}
      {userLatLng && (
        <Polyline
          positions={[orderLatLng, userLatLng]}
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
