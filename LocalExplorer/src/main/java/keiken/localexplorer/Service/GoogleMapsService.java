package keiken.localexplorer.Service;

import com.google.maps.GeoApiContext;
import com.google.maps.PlacesApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.LatLng;
import com.google.maps.model.PlacesSearchResponse;
import keiken.localexplorer.Config.ApiConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    public ResponseEntity<PlacesSearchResponse> findNearbyPlaces(
            double latitude, double longitude)
            throws ApiException, InterruptedException, IOException {
        LatLng location = new LatLng(latitude, longitude);
        logger.info(
                "Find nearby places: lat " + latitude + ", lon: " + longitude);
        try{
            PlacesSearchResponse response =  PlacesApi.nearbySearchQuery(geoApiContext, location)
                    .radius(1000) // Search within a 1000-meter radius
                    .await();
            return ResponseEntity.ok(response);
        }
        catch(ApiException e){
            logger.error("Google Maps API Exception: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }catch (InterruptedException e) {
            logger.error("Google Maps API Interrupted: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IOException e) {
            logger.error("IO Exception with Google Maps API: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}