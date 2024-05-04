const socket = new WebSocket('wss://localhost:5000');

socket.addEventListener('open', () => {
  console.log('WebSocket connection established');
});

export default socket;