package keiken.localexplorer.Service;

import com.google.maps.GeoApiContext;
import com.google.maps.PlacesApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.LatLng;
import com.google.maps.model.PlaceType;
import com.google.maps.model.PlacesSearchResponse;
import keiken.localexplorer.Config.ApiConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class GoogleMapsService {
    private final GeoApiContext geoApiContext;
    private final Logger logger = LoggerFactory.getLogger(GoogleMapsService.class);

    public GoogleMapsService(ApiConfig apiConfig) {
        this.geoApiContext =
                new GeoApiContext.Builder().apiKey(apiConfig.getGoogleMapsApiKey()).build();
    }

    public PlacesSearchResponse findNearbyPlaces(
            double latitude, double longitude, PlaceType placeType)
            throws ApiException, InterruptedException, IOException {
        LatLng location = new LatLng(latitude, longitude);
        logger.info(
                "Find nearby places: lat " + latitude + ", lon: " + longitude + ", type:" + placeType);
        return PlacesApi.nearbySearchQuery(geoApiContext, location)
                .radius(1000) // Search within a 1000-meter radius
                .type(placeType)
                .await();
    }
}
