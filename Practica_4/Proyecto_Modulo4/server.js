const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const WEATHERSTACK_KEY = process.env.WEATHERSTACK_KEY;

// Static assets
app.use(express.static('public'));

// Simple health route
app.get('/health', (_req, res) => res.json({ ok: true }));

// Weather endpoint (server-side call to Weatherstack, hides your key)
app.get('/weather', async (req, res) => {
  try {
    const q = (req.query.query || '').trim();
    if (!q) {
      return res.status(400).json({ error: 'NO_QUERY', message: 'Debes enviar ?query=Ciudad o código postal.' });
    }
    if (!WEATHERSTACK_KEY) {
      return res.status(500).json({ error: 'NO_API_KEY', message: 'Falta configurar WEATHERSTACK_KEY en variables de entorno.' });
    }

    const url = 'http://api.weatherstack.com/current';
    const { data } = await axios.get(url, {
      params: {
        access_key: WEATHERSTACK_KEY,
        query: q,
        units: 'm'
      },
      timeout: 10000
    });

    // Weatherstack returns success=false on errors with 200 status
    if (data && data.success === false) {
      return res.status(400).json({ error: 'API_ERROR', message: data.error && data.error.info || 'Error en Weatherstack' });
    }

    const payload = {
      location: data?.location?.name && data?.location?.country
        ? `${data.location.name}, ${data.location.country}`
        : q,
      temperature: data?.current?.temperature,
      description: Array.isArray(data?.current?.weather_descriptions) ? data.current.weather_descriptions.join(', ') : undefined,
      feelslike: data?.current?.feelslike,
      humidity: data?.current?.humidity,
      wind_kph: data?.current?.wind_speed,
      icon: Array.isArray(data?.current?.weather_icons) ? data.current.weather_icons[0] : undefined,
      raw: data
    };

    return res.json(payload);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'SERVER_ERROR', message: 'Ocurrió un error al consultar el clima.' });
  }
});

// Home route (optional if using index.html in /public)
app.get('/', (_req, res) => {
  res.sendFile(require('path').join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Weather app listening on http://localhost:${PORT}`);
});
