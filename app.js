// Historial de la conversación guardado en memoria del navegador
let conversationHistory = [];

// Función principal: envía el mensaje del usuario al backend
async function sendMessage() {
  const inputField = document.getElementById('userInput');
  const chatBox = document.getElementById('chatBox');
  const text = inputField.value.trim();

  // Si el campo está vacío, no hacer nada
  if (!text) return;

  // 1. Mostrar mensaje del usuario en la interfaz
  appendMessage(text, 'user');
  inputField.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;

  // Agregar el mensaje al historial local
  conversationHistory.push({ role: 'user', content: text });

  try {
    // 2. Enviar la petición al backend
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        history: conversationHistory.slice(0, -1) // Enviamos el historial previo (sin el mensaje actual)
      })
    });

    const data = await response.json();

    if (data.reply) {
      // 3. Mostrar la respuesta del agente en la interfaz
      appendMessage(data.reply, 'assistant');
      // Agregar la respuesta al historial local
      conversationHistory.push({ role: 'assistant', content: data.reply });
    } else {
      appendMessage('Error: No se pudo obtener respuesta del servidor.', 'assistant');
    }
  } catch (error) {
    console.error('Error de red:', error);
    appendMessage('Error de conexión con el servidor.', 'assistant');
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

// Crea y agrega un mensaje (burbuja) al chat
function appendMessage(text, sender) {
  const chatBox = document.getElementById('chatBox');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
}

// Permite enviar el mensaje presionando Enter
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}