# KivuIMSProxyService

**Kivu IMS Proxy Service** — A Spring Boot microservice designed to handle proxying requests and managing integration between Kivu IMS components.

---

## 📦 Project Metadata
- **Group**: `com.kivuims`
- **Artifact**: `proxyservice`
- **Version**: `0.0.1-SNAPSHOT`
- **Java**: 21 (Recommended)
- **Build Tool**: Gradle
- **Spring Boot**: 3.5.4

---

## 🚀 Getting Started

### Prerequisites
- **Java 17 or 21** installed
- **Gradle Wrapper** (included in repo — no need to install Gradle globally)

### Build the Application
```bash
./gradlew clean build
```

### ⚙️ Project Structure
```
src/
  main/
    java/                # Java source code
    resources/           # application.properties / application.yml and static files
  test/
    java/                # Unit and integration tests
```

### 🛠 Useful Gradle Commands

| Command                  | Description                         |
| ------------------------ | ----------------------------------- |
| `./gradlew clean`        | Cleans the build directory          |
| `./gradlew build`        | Compiles and builds the application |
| `./gradlew bootRun`      | Runs the Spring Boot app            |
| `./gradlew test`         | Runs all tests                      |
| `./gradlew bootJar`      | Creates an executable JAR           |
| `./gradlew dependencies` | Shows dependency tree               |
