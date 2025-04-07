# Etapa 1: Build usando Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build  
WORKDIR /app  
COPY . .  
RUN mvn clean package -DskipTests  

# Etapa 2: Criar um contêiner com o JAR gerado
FROM openjdk:17-jdk-slim  
WORKDIR /app  

COPY --from=build /app/target/morada-do-sol-0.0.1-SNAPSHOT.jar app.jar   

EXPOSE 8023 

CMD ["java", "-jar", "app.jar", "--server.port=8023"]

