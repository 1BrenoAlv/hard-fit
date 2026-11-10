FROM node:22-bookworm-slim AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.js postcss.config.js ./
COPY public ./public
COPY src ./src
ARG VITE_INSTAGRAM_URL
ARG VITE_WHATSAPP_URL
ARG VITE_HOTMART_CHECKOUT_URL
RUN npm run build

FROM maven:3.9-eclipse-temurin-21 AS backend
WORKDIR /app
COPY backend/pom.xml ./pom.xml
COPY backend/src ./src
COPY --from=frontend /app/dist ./src/main/resources/static
RUN mvn -B -ntp -Dmaven.test.skip=true package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend /app/target/hardfit-api-0.1.0.jar ./hardfit.jar
RUN mkdir uploads && chown 10001:10001 uploads
USER 10001:10001
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "hardfit.jar"]
