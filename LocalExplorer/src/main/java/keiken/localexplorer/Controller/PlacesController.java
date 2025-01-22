package keiken.localexplorer.Controller;

import com.google.maps.errors.ApiException;
import com.google.maps.model.PlacesSearchResponse;
import keiken.localexplorer.Model.GeminiResponse;
import keiken.localexplorer.Service.GoogleMapsService;
import keiken.localexplorer.Service.RecommendationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.io.IOException;

@RestController
@RequestMapping("/places")
@CrossOrigin(origins = "http://localhost:5173")
public class PlacesController {

    private final GoogleMapsService googleMapsService;
    private final RecommendationService recommendationService;
    private final Logger logger = LoggerFactory.getLogger(PlacesController.class);
    public PlacesController(GoogleMapsService googleMapsService, RecommendationService recommendationService) {
        this.googleMapsService = googleMapsService;
        this.recommendationService = recommendationService;
    }

    @GetMapping("/nearby")
    public PlacesSearchResponse findNearbyPlaces(
            @RequestParam double latitude,
            @RequestParam double longitude
    ) throws ApiException, InterruptedException, IOException {
        logger.info("Received request: " + latitude + ", lon: " + longitude);
        return googleMapsService.findNearbyPlaces(latitude, longitude).getBody();
    }

    @GetMapping("/recommendations")
    public Mono<ResponseEntity<GeminiResponse>> getRecommendations(
            @RequestParam double latitude,
            @RequestParam double longitude
    ){
        return recommendationService.getRecommendations(latitude, longitude);
    }
}