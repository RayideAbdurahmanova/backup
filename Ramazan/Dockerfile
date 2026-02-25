# 1. OpenJDK 17 ilə başla (sənin Java 17 toolchain-in var)
FROM eclipse-temurin:17-jdk

# İş qovluğunu təyin et (isteğe bağlı, amma yaxşı təcrübədir)
WORKDIR /app

# JAR faylını konteynerə köçür
# Sənin fayl adın tam olaraq Ramazan-0.0.1-SNAPSHOT.jar olduğuna görə belə yazırıq
COPY build/libs/Ramazan-0.0.1-SNAPSHOT.jar app.jar

# 8080 portunu aç (Spring Boot default portudur)
EXPOSE 8080

# Konteyner start olarkən nə işləsin
ENTRYPOINT ["java", "-jar", "app.jar"]