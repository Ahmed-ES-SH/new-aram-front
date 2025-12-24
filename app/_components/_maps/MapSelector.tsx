"use client";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";

interface Props {
  initialLocation: any;
  setLocation: (loc: any) => void;
  showMap: boolean;
  onClose: () => void;
  locale: "en" | "ar";
}

const DEFAULT_LOCATION = {
  address: "سلطنة عمان",
  coordinates: { lat: 21.4735, lng: 55.9754 },
};

// Fix Leaflet Default Icon
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Internal component to handle map clicks
function LocationMarker({
  setLocation,
  setLocalLocation,
  setIsGeocoding,
}: {
  setLocation: (loc: any) => void;
  setLocalLocation: (loc: any) => void;
  setIsGeocoding: (loading: boolean) => void;
}) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      e.originalEvent.preventDefault();
      e.originalEvent.stopPropagation();

      // OPTIMISTIC UPDATE: Move marker immediately
      const tempLoc = {
        address: "Loading address...",
        coordinates: { lat, lng },
      };
      setLocalLocation(tempLoc);
      setIsGeocoding(true);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        const addressText = data.display_name || "Unknown location";

        const newLoc = {
          address: addressText,
          coordinates: { lat, lng },
        };

        setLocalLocation(newLoc);
        setLocation(newLoc); // Update parent state only after fetch is done (optional, or immediate if you want parent to reflect coords fast)
      } catch (err) {
        console.error("Failed to fetch address", err);
        const newLoc = {
          address: "Unknown location",
          coordinates: { lat, lng },
        };
        setLocalLocation(newLoc);
        setLocation(newLoc);
      } finally {
        setIsGeocoding(false);
      }
    },
  });

  return null;
}

// Component to focus map on location change
function MapFocus({ location }: { location: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      // Use standard flyTo, maybe reduce duration for snappier feel
      map.flyTo([location.lat, location.lng], 13, { duration: 1 });
    }
  }, [location, map]);

  return null;
}

export default function MapSelector({
  initialLocation,
  setLocation,
  showMap,
  onClose,
  locale,
}: Props) {
  const [location, setLocalLocation] = useState<any>(
    initialLocation || DEFAULT_LOCATION
  );
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Auto-detect location if initialLocation is missing
  useEffect(() => {
    if (!initialLocation) {
      if (navigator.geolocation) {
        setIsGeocoding(true);
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await res.json();
              const addressText = data.display_name || DEFAULT_LOCATION.address;

              const newLoc = {
                address: addressText,
                coordinates: { lat: latitude, lng: longitude },
              };

              setLocalLocation(newLoc);
              setLocation(newLoc);
            } catch (err) {
              console.error("Reverse geocoding failed", err);
              setLocalLocation(DEFAULT_LOCATION);
              setLocation(DEFAULT_LOCATION);
            } finally {
              setIsGeocoding(false);
            }
          },
          () => {
            setLocalLocation(DEFAULT_LOCATION);
            setLocation(DEFAULT_LOCATION);
            setIsGeocoding(false);
          }
        );
      } else {
        setLocalLocation(DEFAULT_LOCATION);
        setLocation(DEFAULT_LOCATION);
      }
    }
  }, [initialLocation, setLocation]);

  return (
    <AnimatePresence>
      {showMap && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeIn" }}
          className="fixed w-full h-screen px-4 z-[9999] top-0 left-0 bg-black/50 backdrop-blur-md flex items-center justify-center"
        >
          <div className="bg-white w-full max-w-4xl p-2 rounded-md shadow-lg border border-gray-300 relative">
            <MapContainer
              center={[location.coordinates.lat, location.coordinates.lng]}
              zoom={13}
              className="h-[500px] w-full rounded-2xl shadow-md outline-none z-0"
            >
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker
                position={[location.coordinates.lat, location.coordinates.lng]}
              >
                <Popup>
                  {isGeocoding ? (
                    <div className="flex items-center gap-2">
                      <FaSpinner className="animate-spin text-primary" />
                      <span>Loading address...</span>
                    </div>
                  ) : (
                    location.address ||
                    (locale === "ar" ? "موقعك الحالي" : "Your location")
                  )}
                </Popup>
              </Marker>

              <MapFocus location={location.coordinates} />

              <LocationMarker
                setLocation={setLocation}
                setLocalLocation={setLocalLocation}
                setIsGeocoding={setIsGeocoding}
              />
            </MapContainer>

            {/* Geocoding Indicator Overlay (Optional, but good for UX) */}
            {isGeocoding && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full shadow-md z-[1000] flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaSpinner className="animate-spin text-primary" />
                <span>جاري تحديد العنوان...</span>
              </div>
            )}

            <div
              onClick={onClose}
              className="flex items-center w-fit cursor-pointer gap-1 bg-red-400 text-white px-3 py-2 rounded-md shadow mt-4 hover:bg-red-500 hover:scale-105 duration-200"
            >
              <p>{locale == "ar" ? "إغلاق" : "Close"}</p>
              <IoMdClose className="cursor-pointer ml-auto block size-6" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
