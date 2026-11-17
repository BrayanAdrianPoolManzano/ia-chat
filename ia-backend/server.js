// Importar las librerías necesarias
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Carga las variables del archivo .env
const { OpenAI } = require('openai');

const app = express();

// Middlewares: permitir JSON en las peticiones y habilitar CORS para el frontend
app.use(express.json());
app.use(cors());

// Inicializar el cliente de OpenAI apuntando a la baseURL de OpenRouter
const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://tu-sitio-web.com', // Opcional: para rankings en OpenRouter
    'X-Title': 'Mi Aplicativo Web',             // Opcional: nombre de tu app
  },
});

// Endpoint que recibe los mensajes del frontend
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    // Construir el arreglo de mensajes combinando el historial y el mensaje actual
    const messages = [...(history || []), { role: 'user', content: message }];

    // Llamada a la API a través de OpenRouter
    const completion = await openrouter.chat.completions.create({
      model: 'openai/gpt-4o-mini', // Puedes cambiarlo por cualquier modelo soportado por OpenRouter
      messages: messages,
    });

    // Extraer el texto de la respuesta y enviarlo al frontend
    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Error al comunicarse con OpenRouter:', error);
    res.status(500).json({ error: 'Error interno al procesar la solicitud con la IA' });
  }
});

// Iniciar el servidor en el puerto definido en .env (o 3000 por defecto)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});