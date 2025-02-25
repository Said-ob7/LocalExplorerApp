import React, { useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

interface Place {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface PlacesResponse {
  results: Place[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

const placeTypes = ["restaurant", "cafe", "park", "museum", "bar"];
const PlacesComponent: React.FC = () => {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [userLocationMarker, setUserLocationMarker] = useState<any>(null);
  const [places, setPlaces] = useState<PlacesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<GeminiResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPlaceType, setSelectedPlaceType] = useState<string | null>(
    null
  );
  const [directionsResponse, setDirectionsResponse] = useState<any>(null);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);

  const center = useMemo(() => {
    if (!location) {
      return {
        lat: 0,
        lng: 0,
      };
    }
    return {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };
  }, [location]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY || "",
  });

  const fetchLocationAndRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelectedDestination(null); // Clear the selected destination
    setDirectionsResponse(null); // Clear the directions response
    try {
      // Get location
      const position = await getCurrentLocation();
      setLocation(position);
      setUserLocationMarker({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      // Get recommendations
      await fetchRecommendations(
        position.coords.latitude,
        position.coords.longitude,
        selectedPlaceType
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedPlaceType]);

  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  const fetchRecommendations = async (
    latitude: number,
    longitude: number,
    placeType: string | null
  ): Promise<void> => {
    try {
      const response = await axios.get<GeminiResponse>(
        "http://localhost:8787/places/recommendations",
        {
          params: {
            latitude,
            longitude,
            placeType,
          },
        }
      );
      setRecommendations(response.data);
      await fetchPlaces(latitude, longitude, placeType);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchPlaces = async (
    latitude: number,
    longitude: number,
    placeType: string | null
  ): Promise<void> => {
    try {
      const response = await axios.get<PlacesResponse>(
        "http://localhost:8787/places/nearby",
        {
          params: {
            latitude,
            longitude,
            placeType,
          },
        }
      );
      setPlaces(response.data);
    } catch (error: any) {
      setError(error.message);
    }
  };
  const handlePlaceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlaceType(e.target.value);
  };

  const renderRecommendations = () => {
    if (
      !recommendations ||
      !recommendations.candidates ||
      recommendations.candidates.length === 0
    ) {
      return null;
    }
    const currentRecommendation = recommendations.candidates[0];
    const recommendationText = currentRecommendation.content.parts[0].text;

    return (
      <div className="recommendation-card">
        <h2>Recommendation</h2>
        <p>{recommendationText}</p>
      </div>
    );
  };

  const handleMarkerClick = (place: Place) => {
    if (location) {
      setSelectedDestination(place.geometry.location);
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
          destination: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
          travelMode: google.maps.TravelMode.WALKING,
        },
        directionsCallback
      );
    }
  };

  const directionsCallback = useCallback((response: any) => {
    if (response !== null) {
      if (response.status === "OK") {
        setDirectionsResponse(response);
      } else {
        console.error("response: ", response);
      }
    }
  }, []);

  return (
    <div>
      <select value={selectedPlaceType || ""} onChange={handlePlaceTypeChange}>
        <option value="">All Types</option>
        {placeTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <button onClick={fetchLocationAndRecommendations}>
        Get Recommendations
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {location && <div></div>}
      {isLoaded ? (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={15}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
          }}
        >
          {userLocationMarker && (
            <Marker position={userLocationMarker} label="You" />
          )}
          {places?.results.map((place: Place) => (
            <Marker
              key={place.place_id}
              position={{
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
              }}
              label={place.name}
              onClick={() => handleMarkerClick(place)}
            />
          ))}
          {selectedDestination && directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      ) : (
        <p>Loading Map...</p>
      )}
      {renderRecommendations()}
    </div>
  );
};

export default PlacesComponent;
