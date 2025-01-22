import React, { useState, useEffect } from "react";
import axios from "axios";

interface Place {
  place_id: string;
  name: string;
  // Add other properties of a place that you expect from the api
}

interface PlacesResponse {
  results: Place[];
  // Other properties from the response
}
interface Coordinates {
  latitude: number;
  longitude: number;
}

const PlacesComponent: React.FC = () => {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [places, setPlaces] = useState<PlacesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLocationAndPlaces = async () => {
      setLoading(true);
      setError(null);

      try {
        //Get location
        const position = await getCurrentLocation();
        setLocation(position);
        //Get Places
        await fetchPlaces(position.coords.latitude, position.coords.longitude);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLocationAndPlaces();
  }, []);

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

  const fetchPlaces = async (
    latitude: number,
    longitude: number
  ): Promise<void> => {
    try {
      const response = await axios.get<PlacesResponse>(
        "http://localhost:8787/places/nearby",
        {
          params: {
            latitude,
            longitude,
            placeType: "restaurant", // default
          },
        }
      );
      setPlaces(response.data);
    } catch (err: any) {
      setError(err.message);
    }
  };
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  if (!places) {
    return <p>No nearby places yet</p>;
  }
  return (
    <div>
      <h2>Nearby Places</h2>
      {places.results.map((place: Place) => (
        <div key={place.place_id}>
          <h3>{place.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default PlacesComponent;
