"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Espaco {
  id: string;
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
}

interface MapaEspacosProps {
  espacos: Espaco[];
}

export default function MapaEspacos({ espacos }: MapaEspacosProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Evita erro: garante que rode somente no cliente
    setReady(true);

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  // Impede render no SSR E impede erro ao atualizar página
  if (!ready) return null;

  if (!espacos || espacos.length === 0)
    return <p>Nenhum espaço cadastrado.</p>;

  const center: [number, number] = [
    espacos[0].latitude,
    espacos[0].longitude,
  ];

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {espacos.map((espaco) => (
        <Marker
          key={espaco.id}
          position={[espaco.latitude, espaco.longitude]}
        >
          <Popup>
            <strong>{espaco.nome}</strong>
            <br />
            {espaco.endereco}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
