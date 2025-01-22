import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const SimpleMap: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    id: "minimal-map-script",
    googleMapsApiKey: "AIzaSyAZ6JbKzNhBv_PyxP9Fx_xC8FXZuOZvAIU", // Replace with your API KEY, or use the environment variable as always
  });

  const center = { lat: 0, lng: 0 }; // Default center

  return (
    <div>
      {isLoaded ? (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={2}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SimpleMap;
