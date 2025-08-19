"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "./MapComponent.css";

// ✅ Define your custom bus icon
const busIcon = L.icon({
  iconUrl:
    "https://e7.pngegg.com/pngimages/486/358/png-clipart-tour-bus-service-car-minibus-bus-car-mode-of-transport.png",
  iconSize: [50, 50], // adjust size to look good
  iconAnchor: [25, 50], // anchor so bottom of bus sits on location
  popupAnchor: [0, -50], // popup above the icon
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png", // optional shadow
  shadowSize: [60, 60],
  shadowAnchor: [30, 60],
});

const MapComponent = ({ title = "Live Bus Tracking", showControls = true }) => {
  const [buses, setBuses] = useState([]);
  const [isTracking, setIsTracking] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState("all");

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/buses");
        setBuses(res.data);
      } catch (err) {
        console.error("Error fetching bus data:", err);
      }
    };

    fetchBuses();

    let interval;
    if (isTracking) {
      interval = setInterval(fetchBuses, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  const filteredBuses =
    selectedRoute === "all"
      ? buses
      : buses.filter((bus) => bus.routeName === selectedRoute);

  const uniqueRoutes = [...new Set(buses.map((bus) => bus.routeName))];

  return (
    <div className="map-container">
      <div className="map-header">
        <h3>{title}</h3>
        <p>Real-time bus locations • Updated every 5 seconds</p>
      </div>

      <MapContainer
        center={[12.9791, 77.5913]}
        zoom={7}
        className="leaflet-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {filteredBuses.map((bus) => (
          <Marker
            key={bus._id}
            position={[bus.currentLocation.lat, bus.currentLocation.lng]}
            icon={busIcon} // ✅ apply custom bus icon here
          >
            <Popup>
              <div className="bus-popup">
                <strong>{bus.busNumber}</strong>
                <div className="bus-info">
                  <div>Route: {bus.routeName}</div>
                  <div>Contact: {bus.contact}</div>
                </div>
                <div className="coordinates">
                  Lat: {bus.currentLocation.lat.toFixed(4)}
                  <br />
                  Lng: {bus.currentLocation.lng.toFixed(4)}
                  <br />
                  Updated:{" "}
                  {new Date(bus.currentLocation.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {showControls && (
        <div className="map-controls">
          <span className="control-button" style={{ background: "gray" }}>
            {filteredBuses.length} Buses Active
          </span>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
