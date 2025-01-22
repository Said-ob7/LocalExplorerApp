package keiken.localexplorer.Config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiConfig {

    private final String geminiApiKey;
    private final String googleMapsApiKey;
    private final String weatherApiKey;


    public ApiConfig() {
        Dotenv dotenv = Dotenv.load();
        this.geminiApiKey = dotenv.get("GEMINI_API_KEY");
        this.googleMapsApiKey = dotenv.get("GOOGLE_MAPS_API_KEY");
        this.weatherApiKey = dotenv.get("WEATHER_API_KEY");
    }
    public String getGeminiApiKey() {
        return geminiApiKey;
    }

    public String getGoogleMapsApiKey() {
        return googleMapsApiKey;
    }
    public String getWeatherApiKey() {
        return weatherApiKey;
    }
}