package keiken.localexplorer.Service;

import keiken.localexplorer.Config.ApiConfig;
import keiken.localexplorer.Model.WeatherResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

@Service
public class WeatherService {
    private final WebClient webClient;
    private final ApiConfig apiConfig;
    private static final String WEATHER_API_BASE_URL = "http://api.weatherapi.com/v1/current.json";
    private static final Logger logger = LoggerFactory.getLogger(WeatherService.class);
    public WeatherService(WebClient webClient, ApiConfig apiConfig) {
        this.webClient = webClient;
        this.apiConfig = apiConfig;
    }
    public Mono<ResponseEntity<WeatherResponse>> getCurrentWeather(String location) {
        String apiUrl = UriComponentsBuilder.fromHttpUrl(WEATHER_API_BASE_URL)
                .queryParam("key", apiConfig.getWeatherApiKey())
                .queryParam("q", location)
                .toUriString();
        logger.info("Weather API URL: " + apiUrl);
        return webClient.get()
                .uri(apiUrl)
                .retrieve()
                .onStatus(httpStatus -> !httpStatus.is2xxSuccessful(),
                        clientResponse -> Mono.error(new RuntimeException("Failed to call Weather API.")))
                .toEntity(WeatherResponse.class);
    }
}