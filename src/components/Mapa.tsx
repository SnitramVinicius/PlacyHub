// "use client";

// import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// const MapContainer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.MapContainer),
//   { ssr: false }
// );

// const TileLayer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.TileLayer),
//   { ssr: false }
// );

// const Marker = dynamic(
//   () => import("react-leaflet").then((mod) => mod.Marker),
//   { ssr: false }
// );

// const Popup = dynamic(
//   () => import("react-leaflet").then((mod) => mod.Popup),
//   { ssr: false }
// );

// interface Espaco {
//   id: string;
//   nome: string;
//   endereco: string;
//   latitude: number;
//   longitude: number;
// }

// interface MapaEspacosProps {
//   espacos: Espaco[];
// }

// export default function MapaEspacos({ espacos }: MapaEspacosProps) {
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     setReady(true);

//     delete (L.Icon.Default.prototype as any)._getIconUrl;

//     L.Icon.Default.mergeOptions({
//       iconRetinaUrl:
//         "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//       iconUrl:
//         "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//       shadowUrl:
//         "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
//     });
//   }, []);

//   if (!ready) return null;

//   if (!espacos || espacos.length === 0)
//     return <p>Nenhum espaço cadastrado.</p>;

//   const center: [number, number] = [
//     espacos[0].latitude,
//     espacos[0].longitude,
//   ];

//   return (
//     <div className="rounded-2xl overflow-hidden shadow-md">
//       <MapContainer
//         center={center}
//         zoom={14}
//         style={{ height: "500px", width: "100%" }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="&copy; OpenStreetMap contributors"
//         />

//         {espacos.map((espaco) => (
//           <Marker
//             key={espaco.id}
//             position={[espaco.latitude, espaco.longitude]}
//           >
//             <Popup>
//               <strong>{espaco.nome}</strong>
//               <br />
//               {espaco.endereco}
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// }