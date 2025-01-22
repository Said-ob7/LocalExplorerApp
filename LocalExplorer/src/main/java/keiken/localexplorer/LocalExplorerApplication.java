package keiken.localexplorer;

import com.google.maps.GeoApiContext;
import keiken.localexplorer.Config.ApiConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
public class LocalExplorerApplication {

    public static void main(String[] args) {
        SpringApplication.run(LocalExplorerApplication.class, args);
    }
    @Bean
    public WebClient webClient() {
        return WebClient.create();
    }

    @Bean
    public GeoApiContext geoApiContext(ApiConfig apiConfig) {
        return new GeoApiContext.Builder()
                .apiKey(apiConfig.getGoogleMapsApiKey())
                .build();
    }
}
