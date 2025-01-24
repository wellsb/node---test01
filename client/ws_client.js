import {io} from './node_modules/socket.io-client/dist/socket.io.esm.min.js';

const socket = io('http://192.168.0.170:3000');

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = messageInput.value;
  socket.emit('aMessage', msg);
  messageInput.value = '';
  messageInput.focus();
  return false;
});

socket.on('aMessage', (msg) => {
  const messageRow = document.createElement('div'); // Parent "message"
  const sendId = document.createElement('div'); // Sender Id
  const messageBody = document.createElement('div'); // Message
  const timeStamp = document.createElement('div'); // timeStamp

  // Assign classes for the parent and childs
  sendId.className = 'sender'; // Sender
  messageBody.className = 'message-text'; // Message content
  timeStamp.className = 'timeStamp';
  messageRow.className = 'message'; // Parent

  // Set text content for the sender and message divs
  sendId.textContent = msg.id.slice(-5); // Sender's ID
  sendId.style.color = generateHexColor(msg.id); // Set sender color
  messageBody.textContent = msg.message; // Message content
  timeStamp.textContent = getTimestamp();

  // Append everything to "message"
  messageRow.appendChild(timeStamp);
  messageRow.appendChild(sendId);
  messageRow.appendChild(messageBody);

  // Append the parent "message" existing "messageContainer"
  const messageContainer = document.getElementById('messageContainer');
  messageContainer.appendChild(messageRow);

  // Highlight incoming messages
  messageRow.className = "message highlight";
  setTimeout(() => {
    messageRow.classList.remove("highlight");
  }, 20);

  // Auto-scroll to the bottom of the messageContainer
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

/**
 * Generates the current timestamp in "HH:MM" format.
 *
 * @returns {string} The current time as a string, formatted with two-digit
 * hours and minutes (e.g., "14:05").
 *
 * Example:
 * // If the current time is 9:5 AM, it returns "09:05".
 * getTimestamp(); // "09:05"
 */
function getTimestamp() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0'); // Ensure 2 digits
  const minutes = now.getMinutes().toString().padStart(2, '0'); // Ensure 2 digits

  return `${hours}:${minutes}`;
}

/**
 * Generates a unique hexadecimal color code (#RRGGBB) based on a given string ID.
 * This ensures consistent color output for the same input string.
 *
 * @param {string} msgId - The string identifier (e.g., a unique message ID).
 * @returns {string} A hexadecimal color string in the format #RRGGBB.
 *
 * @example
 * // Generate a consistent color for the message "message12345"
 * const color = generateHexColor("message12345");
 * console.log(color); // Output: A hex color such as "#a1b2c3"
 *
 * @description
 * The function slices the last 5 characters of the input string (msgId),
 * hashes it into a numeric value, and converts the hash into an RGB color.
 * The hash is deterministic, ensuring the same `msgId` results in the same color.
 */
function generateHexColor(msgId) {
  msgId = msgId.slice(-5);
  // Hash the msg.id string into a number
  let hash = 0;
  for (let i = 0; i < msgId.length; i++) {
    hash = msgId.charCodeAt(i) + ((hash << 5) - hash);
    //console.log(hash);
  }

  // Convert the number into an RGB color
  const r = (hash >> 16) & 0xff; // red
  const g = (hash >> 8) & 0xff;  // green
  const b = hash & 0xff;         // blue

  // Format as a hex color string
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
