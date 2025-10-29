"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Ajuste do ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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
  if (!espacos || espacos.length === 0) return <p>Nenhum espaço cadastrado.</p>;

  // Centraliza o mapa no primeiro espaço
  const center: [number, number] = [
    espacos[0].latitude,
    espacos[0].longitude,
  ];

  return (
    <MapContainer center={center} zoom={14} style={{ height: "500px", width: "100%" }}>
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
