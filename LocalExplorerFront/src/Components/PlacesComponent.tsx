import React, { useState, useCallback } from "react";
import axios from "axios";

interface Place {
  place_id: string;
  name: string;
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
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePlaceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlaceType(e.target.value);
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

      {recommendations && recommendations.candidates && (
        <div>
          <h2>Recommendations</h2>
          <ul>
            {recommendations.candidates.map((candidate) =>
              candidate.content.parts.map((part, index) => (
                <li key={index}>{part.text}</li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlacesComponent;
