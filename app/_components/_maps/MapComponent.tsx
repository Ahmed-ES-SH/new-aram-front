"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface props {
  location: any;
}

// interface locationType {
//   address: string;
//   coordinates: {
//     lat: number;
//     lang: number;
//   };
// }

// القاهرة كمثال

// إصلاح الأيقونة الافتراضية في Leaflet (مهم لـ Next.js)
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapComponent({ location }: props) {
  const address = location.address;
  const position: [number, number] = [
    location.coordinates.lat,
    location.coordinates.lng,
  ];

  return (
    <MapContainer
      center={position}
      zoom={13}
      className="h-[500px] w-full rounded-2xl shadow-md"
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>{address || "Address not available"}</Popup>
      </Marker>
    </MapContainer>
  );
}
