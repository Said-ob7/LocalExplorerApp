package keiken.localexplorer.Service;

import keiken.localexplorer.Config.ApiConfig;
import keiken.localexplorer.Model.WeatherResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
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
    public Mono<WeatherResponse> getCurrentWeather(String location) {
        String apiUrl = WEATHER_API_BASE_URL + "?key=" + apiConfig.getWeatherApiKey() + "&q=" + location;
        logger.info("Weather API URL: " + apiUrl);
        return webClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(WeatherResponse.class);
    }
}
