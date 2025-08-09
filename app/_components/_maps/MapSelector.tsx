"use client";
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";

interface Props {
  initialLocation: any;
  setLocation: (loc: any) => void;
  showMap: boolean;
  onClose: () => void;
  locale: "en" | "ar";
}

// إصلاح الأيقونة الافتراضية في Leaflet
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// مكون داخلي للتعامل مع نقر المستخدم على الخريطة
function LocationMarker({ setLocation }: { setLocation: (loc: any) => void }) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [address, setAddress] = useState<string>("");

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });

      e.originalEvent.preventDefault(); // ⛔️ يمنع إرسال النموذج
      e.originalEvent.stopPropagation(); // ⛔️ يمنع انتشار الحدث

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        const addressText = data.display_name || "Unknown location";
        setAddress(addressText);

        setLocation({
          address: addressText,
          coordinates: { lat, lng },
        });
      } catch (err) {
        console.error("Failed to fetch address", err);
        setLocation({
          address: "Unknown location",
          coordinates: { lat, lng },
        });
      }
    },
  });

  return position ? (
    <Marker position={[position.lat, position.lng]}>
      <Popup>{address || "جارٍ تحديد العنوان..."}</Popup>
    </Marker>
  ) : null;
}

export default function MapSelector({
  initialLocation,
  setLocation,
  showMap,
  onClose,
  locale,
}: Props) {
  return (
    <AnimatePresence>
      {showMap && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeIn" }}
          className="fixed w-full h-screen px-4 z-[99999] top-0 left-0 bg-black/50 backdrop-blur-md flex items-center justify-center"
        >
          <div className="bg-white w-4xl p-2 rounded-md shadow-lg border border-gray-300">
            <MapContainer
              center={[
                initialLocation.coordinates.lat,
                initialLocation.coordinates.lng,
              ]}
              zoom={13}
              className="h-[500px] w-full rounded-2xl shadow-md outline-none"
            >
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker
                position={[
                  initialLocation.coordinates.lat,
                  initialLocation.coordinates.lng,
                ]}
              >
                <Popup>{initialLocation.address || "موقعك الحالي"}</Popup>
              </Marker>

              <LocationMarker setLocation={setLocation} />
            </MapContainer>
            <div
              onClick={onClose}
              className="flex items-center w-fit cursor-pointer gap-1 bg-red-400 text-white px-3 py-2 rounded-md shadow mt-4 hover:bg-red-500 hover:scale-110  duration-200"
            >
              <p>{locale == "ar" ? "إغلاق" : "Close"}</p>
              <IoMdClose className=" cursor-pointer ml-auto  block  size-6" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
