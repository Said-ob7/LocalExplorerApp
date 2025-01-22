package keiken.localexplorer.Service;

import keiken.localexplorer.Config.ApiConfig;
import keiken.localexplorer.Model.GeminiResponse;
import keiken.localexplorer.Model.WeatherResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

@Service
public class RecommendationService {
    private final WebClient webClient;
    private final ApiConfig apiConfig;
    private final WeatherService weatherService;
    private final GoogleMapsService googleMapsService;
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);

    public RecommendationService(WebClient webClient, ApiConfig apiConfig, WeatherService weatherService, GoogleMapsService googleMapsService) {
        this.webClient = webClient;
        this.apiConfig = apiConfig;
        this.weatherService = weatherService;
        this.googleMapsService = googleMapsService;
    }

    public Mono<ResponseEntity<GeminiResponse>> getRecommendations(double latitude, double longitude) {
        Mono<ResponseEntity<WeatherResponse>> weather = weatherService.getCurrentWeather(latitude + "," + longitude);
        Mono<ResponseEntity<com.google.maps.model.PlacesSearchResponse>> nearbyPlaces = Mono.fromCallable(() -> googleMapsService.findNearbyPlaces(latitude, longitude));

        return Mono.zip(weather, nearbyPlaces)
                .flatMap(tuple -> {
                    ResponseEntity<WeatherResponse> weatherResponse = tuple.getT1();
                    ResponseEntity<com.google.maps.model.PlacesSearchResponse> placesResponseEntity = tuple.getT2();
                    if (!weatherResponse.getStatusCode().is2xxSuccessful() || !placesResponseEntity.getStatusCode().is2xxSuccessful()) {
                        return Mono.error(new RuntimeException("Failed to fetch weather or places data."));
                    }
                    WeatherResponse weatherData = weatherResponse.getBody();
                    com.google.maps.model.PlacesSearchResponse placesData = placesResponseEntity.getBody();

                    String prompt = createPrompt(latitude, longitude, weatherData, placesData);
                    return callGeminiApi(prompt);
                });

    }
    private String createPrompt(double latitude, double longitude, WeatherResponse weatherData, com.google.maps.model.PlacesSearchResponse placesData) {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        String currentTime = now.format(timeFormatter);
        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("EEEE");
        String currentDay = now.format(dayFormatter);

        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("You are a travel assistant. Based on the following information, recommend some places to visit.\n");
        promptBuilder.append("Today is ").append(currentDay).append(", and the current time is ").append(currentTime).append(".\n");
        promptBuilder.append("The current location is latitude: ").append(latitude).append(", and longitude: ").append(longitude).append(".\n");

        if(weatherData != null && weatherData.getCurrent() != null && weatherData.getCurrent().getCondition() != null){
            promptBuilder.append("The weather is ").append(weatherData.getCurrent().getCondition().getText()).append(" and the current temperature is ").append(weatherData.getCurrent().getTempC()).append(" degrees Celsius.\n");
        }
        else{
            promptBuilder.append("There is no information about the weather.\n");
        }

        promptBuilder.append("Nearby places are:\n");
        if(placesData != null && placesData.results != null){
            List<com.google.maps.model.PlacesSearchResult> results =  Arrays.asList(placesData.results);
            for (int i = 0; i < results.size(); i++){
                com.google.maps.model.PlacesSearchResult result = results.get(i);
                promptBuilder.append(i + 1).append(" - ").append(result.name).append("\n");
            }
        }else{
            promptBuilder.append("There is no nearby places information\n");
        }

        promptBuilder.append("Considering the time of day, the location and the weather conditions, Recommend some activities and places to visit. Provide your answer as an ordered list.");
        return promptBuilder.toString();
    }

    private Mono<ResponseEntity<GeminiResponse>> callGeminiApi(String prompt) {
        logger.info("Gemini API URL: " + GEMINI_API_URL);
        String requestBody = String.format("{\n" +
                "    \"contents\": [\n" +
                "      {\n" +
                "        \"parts\": [\n" +
                "          {\n" +
                "            \"text\": \"%s\"\n" +
                "          }\n" +
                "        ]\n" +
                "      }\n" +
                "    ]\n" +
                "  }", prompt);
        return webClient.post()
                .uri(GEMINI_API_URL)
                .header("Content-Type", "application/json")
                .header("x-goog-api-key", apiConfig.getGeminiApiKey())
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(httpStatus -> !httpStatus.is2xxSuccessful(),
                        clientResponse -> Mono.error(new RuntimeException("Failed to call Gemini API.")))
                .toEntity(GeminiResponse.class);
    }
}