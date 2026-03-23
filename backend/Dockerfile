FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw

# 👇 THIS CREATES JAR
RUN ./mvnw clean package

EXPOSE 8080

# 👇 RUN ACTUAL JAR NAME (NOT *)
CMD ["java", "-jar", "target/farmchainx-backend-1.0.0.jar"]