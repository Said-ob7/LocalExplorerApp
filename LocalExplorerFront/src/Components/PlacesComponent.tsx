import React, { useState, useCallback, useMemo } from "react";
import axios from "axios";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

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
  const [places, setPlaces] = useState<PlacesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<GeminiResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPlaceType, setSelectedPlaceType] = useState<string | null>(
    null
  );

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

    try {
      //Get location
      const position = await getCurrentLocation();
      setLocation(position);
      //Get recommendations
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
      if (response.data && response.data.candidates) {
        await fetchPlaces(latitude, longitude, placeType);
      }
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
    if (!recommendations || !recommendations.candidates) {
      return null;
    }

    return (
      <div>
        <h2>Recommendations</h2>
        <ol>
          {recommendations.candidates.map((candidate, candidateIndex) => (
            <li key={candidateIndex}>
              {candidate.content.parts.map((part, partIndex) => (
                <React.Fragment key={partIndex}>{part.text}</React.Fragment>
              ))}
            </li>
          ))}
        </ol>
      </div>
    );
  };

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
      {location && (
        <div>
          <h2>Your Location</h2>
          <p>Latitude: {location.coords.latitude}</p>
          <p>Longitude: {location.coords.longitude}</p>
        </div>
      )}

      {isLoaded ? (
        <GoogleMap
          mapContainerClassName="map-container"
          center={center}
          zoom={5}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
          }}
        >
          {places?.results.map((place: Place) => (
            <Marker
              key={place.place_id}
              position={{
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
              }}
              label={place.name}
            />
          ))}
        </GoogleMap>
      ) : (
        <p>Loading Map...</p>
      )}

      {renderRecommendations()}
    </div>
  );
};

export default PlacesComponent;
