import { io } from './node_modules/socket.io-client/dist/socket.io.esm.min.js';

console.log('Client-side JavaScript is running');
const socket = io('http://192.168.0.170:3000');

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = messageInput.value;
  socket.emit('chat message', msg);
  messageInput.value = '';
  messageInput.focus();
  return false;
});

socket.on('chat message', (msg) => {
  const messageDiv = document.createElement('div'); // Parent "message" div
  const senderDiv = document.createElement('div'); // Sender <div>
  const contentDiv = document.createElement('div'); // Message content <div>

  // Assign classes for the parent and child divs
  messageDiv.className = 'message'; // Parent div
  senderDiv.className = 'sender'; // Sender div
  contentDiv.className = 'message-text'; // Message content div

  // Set text content for the sender and message divs
  senderDiv.textContent = msg.id.slice(-5); // Sender's ID
  senderDiv.style.color = generateHexColor(msg.id); // Set sender div's text color
  contentDiv.textContent = msg.message; // Message content

  // Append the sender and message divs into the parent "message" div
  messageDiv.appendChild(senderDiv);
  messageDiv.appendChild(contentDiv);

  // Append the parent "message" div to the existing "messageContainer"
  const messageContainer = document.getElementById('messageContainer');
  messageContainer.appendChild(messageDiv);

  // handle highlighting incoming messages
  messageDiv.className = "message highlight";
  setTimeout(() => {
    messageDiv.classList.remove("highlight");
  }, 20);

  // Auto-scroll to the bottom of the messageContainer after adding a new message
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

function generateHexColor(msgId) {
  msgId = msgId.slice(-5);
  // Hash the msg.id string into a number
  let hash = 0;
  for (let i = 0; i < msgId.length; i++) {
    hash = msgId.charCodeAt(i) + ((hash << 5) - hash); // Simple hash
    console.log(hash);
  }

  // Convert the number into an RGB color
  const r = (hash >> 16) & 0xff; // Extract red
  const g = (hash >> 8) & 0xff;  // Extract green
  const b = hash & 0xff;         // Extract blue

  // Format as a hex color string
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

