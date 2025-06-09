
// server.js
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const rooms = {}; // In-memory room tracking

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server }); // Attach to existing HTTP server

  wss.on('connection', (ws) => {
    ws.id = uuidv4();
    ws.roomId = null;

    ws.on('message', (message) => {
      let parsed;
      try {
        parsed = JSON.parse(message);
      } catch {
        return;
      }

      const { type, payload } = parsed;

      if (type === 'join-room') {
        const { roomId, gamertag } = payload;

        if (!/^\d{6}$/.test(roomId)) {
          ws.send(JSON.stringify({ type: 'invalid-room-id', payload: { message: 'Room ID must be a 6-digit number.' } }));
          return;
        }
        ws.gamertag = gamertag;
        ws.roomId = roomId;
       
        


        if (!rooms[roomId]) {
          rooms[roomId] = { players: [], answers: {} };
        }

        if (rooms[roomId].players.length >= 2) {
          ws.send(JSON.stringify({ type: 'room-full' }));
          return;
        }

        rooms[roomId].players.push(ws);

        if (rooms[roomId].players.length === 2) {
          const playersInfo = rooms[roomId].players.map((player) => ({
            playerId: player.id,
            gamertag: player.gamertag,
          }));

          rooms[roomId].players.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'both-joined',
                payload: { players: playersInfo },
              }));
            }
          });
        }

        ws.send(JSON.stringify({ type: 'joined', payload: { playerId: ws.id } }));
        return;
      }

      if (type === 'submit-answer') {
        const { questionId, selectedOption, correctAnswer } = payload;
        const room = rooms[ws.roomId];
        if (!room) return;

        const existing = room.answers[questionId];
        if (existing?.winnerId) return;

        if (selectedOption === correctAnswer) {
          if (!room.answers[questionId]) {
            room.answers[questionId] = {
              winnerId: ws.id,
              timestamp: Date.now(),
            };

            room.players.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'question-locked',
                  payload: { questionId, winnerId: ws.id },
                }));
              }
            });
          }
        }
      }

      if (type === 'rematch-request') {
        const room = rooms[ws.roomId];
        if (!room) return;

        if (!room.rematchVotes) {
          room.rematchVotes = new Set();
        }

        room.rematchVotes.add(ws.id);

        if (room.rematchVotes.size === 2) {
          room.answers = {};
          room.rematchVotes.clear();

          const playersInfo = room.players.map(player => ({
            playerId: player.id,
            gamertag: player.gamertag,
          }));

          room.players.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'both-joined',
                payload: { players: playersInfo },
              }));
            }
          });
        }
      }
    });

    ws.on('close', () => {
      const room = rooms[ws.roomId];
      if (room) {
        room.players = room.players.filter((p) => p.id !== ws.id);
        if (room.players.length === 0) {
          delete rooms[ws.roomId];
        }
      }
    });
  });

  console.log('✅ WebSocket server attached');
}

module.exports = { setupWebSocket };

