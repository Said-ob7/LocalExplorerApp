# Stage 1: Build the app with Maven
FROM maven:3.8.4-openjdk-17 AS builder

# Set the working directory for the build
WORKDIR /app

# Copy the pom.xml and install dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline

# Copy the entire source code and compile the app
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the final image
FROM openjdk:17-jdk-slim

# Set environment variables for API keys (and MySQL)
ENV WEATHER_API_KEY=0699d996001a475bbce125428252101
ENV GOOGLE_MAPS_API_KEY=AIzaSyAZ6JbKzNhBv_PyxP9Fx_xC8FXZuOZvAIU
ENV GEMINI_API_KEY=AIzaSyAd0quebZx-l6tNZo2EJn9Wq8fxp3T9uhg
#Connect to MySQL on host machine
ENV MYSQL_HOST=host.docker.internal

# Set the working directory in the container
WORKDIR /app

# Copy the jar file from the builder stage
COPY --from=builder /app/target/LocalExplorer-0.0.1-SNAPSHOT.jar /app/LocalExplorer.jar

# Expose the port your application is running on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "/app/LocalExplorer.jar"]
