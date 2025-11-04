# Weather App (Node + Express + Weatherstack)

App sencilla que consulta la API de Weatherstack desde un servidor Express y muestra el clima en la web.

## Requisitos previos

- Node.js 18+
- Cuenta gratuita en https://weatherstack.com/ para obtener tu `access_key`

## Cómo correr en local

1. Clona el repo o descarga este folder.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Copia `.env.example` a `.env` y coloca tu API key:
   ```env
   WEATHERSTACK_KEY=TU_API_KEY
   ```
4. Arranca el servidor:
   ```bash
   npm start
   ```
5. Abre http://localhost:3000 y busca una ciudad o código postal.

## Manejo de errores

- Si no envías `?query=`, devuelve 400 con `NO_QUERY`.
- Si falta la `WEATHERSTACK_KEY`, devuelve 500 con `NO_API_KEY`.
- Si Weatherstack responde error, se devuelve 400 con `API_ERROR`.
- En frontend se muestra un bloque rojo con el mensaje.

## Despliegue rápido

### Heroku (gratis con verificación de tarjeta o plan a elección)

1. Crea app en Heroku y sube el código con Git.
2. Configura el config var `WEATHERSTACK_KEY`.
3. Heroku detecta el `Procfile` y ejecuta `web: node server.js`.

### Render.com (alternativa sencilla)

1. Crear “Web Service” desde repo.
2. Runtime: Node, Start Command: `node server.js`.
3. Añade `WEATHERSTACK_KEY` como Environment Variable.

## Estructura

```
weather-app-node/
├─ public/
│  ├─ index.html
│  ├─ style.css
│  └─ app.js
├─ server.js
├─ package.json
├─ Procfile
└─ .env.example
```

## Git básico

```bash
git init
git add .
git commit -m "Weather app inicial"
```
