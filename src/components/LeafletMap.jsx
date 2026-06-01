import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './LeafletMap.css'

const UNITS = [
  { id: 'T 417 KL',  lat: 49.348, lng: 16.424, s: 'g' },
  { id: 'BOS 278 RV',lat: 49.488, lng: 16.662, s: 'g' },
  { id: 'BLA 260 KL',lat: 49.361, lng: 16.649, s: 'g' },
  { id: 'III 94 BL', lat: 49.192, lng: 16.630, s: 'r' },
  { id: 'Z 22 RV',   lat: 48.888, lng: 16.048, s: 'y' },
  { id: 'VYS 732 KL',lat: 49.275, lng: 17.004, s: 'g' },
  { id: 'BHU 530 BL',lat: 48.944, lng: 16.720, s: 'b' },
  { id: 'IVA 27 RV', lat: 49.099, lng: 16.349, s: 'y' },
  { id: 'HOD 68 RV',  lat: 48.853, lng: 17.133, s: 'g' },
  { id: 'KYJ 639',   lat: 49.012, lng: 17.122, s: 'g' },
]

const EVENT_POS = [49.148, 16.572]

const STATUS = {
  g: { bg: '#16a34a', color: '#fff', border: '#15803d' },
  r: { bg: '#dc2626', color: '#fff', border: '#b91c1c' },
  y: { bg: '#d97706', color: '#fff', border: '#b45309' },
  b: { bg: '#2563eb', color: '#fff', border: '#1d4ed8' },
}

function unitIcon(id, s) {
  const c = STATUS[s] || STATUS.g
  return L.divIcon({
    html: `<div class="lmap-unit" style="background:${c.bg};color:${c.color};border:1px solid ${c.border}">${id}</div>`,
    className: '',
    iconSize: null,
    iconAnchor: [0, 0],
  })
}

const eventIcon = L.divIcon({
  html: `<div class="lmap-event"><span class="lmap-ring"></span>!</div>`,
  className: '',
  iconSize: [26, 26],
  iconAnchor: [13, 13],
})

export default function LeafletMap() {
  return (
    <MapContainer
      center={[49.15, 16.6]}
      zoom={9}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {UNITS.map(u => (
        <Marker key={u.id} position={[u.lat, u.lng]} icon={unitIcon(u.id, u.s)} />
      ))}
      <Marker position={EVENT_POS} icon={eventIcon} />
    </MapContainer>
  )
}
