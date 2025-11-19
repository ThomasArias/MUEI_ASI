
### 🍎 macOS (Apple Silicon / Intel)
Recomendamos usar Homebrew. Abre la terminal y ejecuta:

```bash
# 1. Instalar Java 21 y Node.js
brew install openjdk@21 node

# 2. Verificar instalaciones
java -version
node -v
````

### 🪟 Windows

Descarga e instala manualmente:

1.  **Java JDK 21 (LTS):**
      * Descarga: [Eclipse Temurin JDK 21](https://adoptium.net/)
      * *IMPORTANTE:* Durante la instalación, marca la casilla **"Set JAVA\_HOME variable"**.
2.  **Node.js (LTS):**
      * Descarga: [Node.js Official Website](https://nodejs.org/)
3.  **Verificar:** Abre PowerShell y ejecuta:
    ```powershell
    java -version
    node -v
    ```

### 🐧 Linux

Abre tu terminal y ejecuta:

```bash
# 1. Instalar Java 21
sudo apt update
sudo apt install openjdk-21-jdk

# 2. Instalar Node.js
curl -fsSL [https://deb.nodesource.com/setup_20.x](https://deb.nodesource.com/setup_20.x) | sudo -E bash -
sudo apt-get install -y nodejs
```

-----

## ⚙️ 2. Configuración del IDE (para VSCode)

Para trabajar correctamente, instala estas extensiones desde el marketplace de VSCode:

  * **Extension Pack for Java** (Microsoft)
  * **Spring Boot Extension Pack** (VMware)
  * **ES7+ React/Redux/React-Native snippets**
  * **Lombok Annotations Support**

-----

## 📦 3. Instalación de Dependencias

Ejecuta estos comandos **una única vez** después de clonar el proyecto.

### Backend (Spring Boot)

Desde la carpeta raíz `Project/`:

```bash
cd backend

# macOS / Linux:
chmod +x mvnw
./mvnw clean install

# Windows:
.\mvnw clean install
```

### Frontend (React)

Desde la carpeta raíz `Project/`:

```bash
cd frontend
npm install
```

-----

## ▶️ 4. Ejecución del Proyecto

Necesitarás dos terminales abiertas simultáneamente.

### Terminal 1: Backend 🐘

*(Servidor en http://localhost:8080)*

```bash
cd backend

# macOS / Linux:
./mvnw spring-boot:run

# Windows:
.\mvnw spring-boot:run
```

### Terminal 2: Frontend ⚛️

*(Cliente Web en http://localhost:5173)*

```bash
cd frontend
npm run dev
```
