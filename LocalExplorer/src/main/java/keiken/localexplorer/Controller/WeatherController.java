package keiken.localexplorer.Controller;

import keiken.localexplorer.Config.ApiConfig;
import keiken.localexplorer.Model.WeatherResponse;
import keiken.localexplorer.Service.WeatherService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/weather")
@CrossOrigin(origins = "http://localhost:5173")
public class WeatherController {

    private final WeatherService weatherService;
    private static final Logger logger = LoggerFactory.getLogger(WeatherController.class);
    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }
    @GetMapping
    public Mono<WeatherResponse> getWeather(@RequestParam String location) {
        logger.info("Location parameter: " + location);
        return weatherService.getCurrentWeather(location);
    }
}
