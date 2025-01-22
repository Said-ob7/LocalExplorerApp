package keiken.localexplorer.Controller;

import com.google.maps.errors.ApiException;
import com.google.maps.model.PlaceType;
import com.google.maps.model.PlacesSearchResponse;
import keiken.localexplorer.Service.GoogleMapsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/places")
@CrossOrigin(origins = "http://localhost:5173")
public class PlacesController {

    private final GoogleMapsService googleMapsService;
    private final Logger logger = LoggerFactory.getLogger(PlacesController.class);
    public PlacesController(GoogleMapsService googleMapsService) {
        this.googleMapsService = googleMapsService;
    }

    @GetMapping("/nearby")
    public PlacesSearchResponse findNearbyPlaces(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam String placeType
    ) throws ApiException, InterruptedException, IOException {
        logger.info("Received request: " + latitude + ", lon: " + longitude + ", type:" + placeType);
        PlaceType type = PlaceType.valueOf(placeType.toUpperCase());
        return googleMapsService.findNearbyPlaces(latitude, longitude, type);
    }
}