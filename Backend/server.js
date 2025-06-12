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

        // Track player answers for this question
        if (!room.answers[questionId]) {
          room.answers[questionId] = {
            attempts: []
          };
        }
        
        room.answers[questionId].attempts.push({
          playerId: ws.id,
          selectedOption
        });

        // If correct answer, lock immediately
        if (selectedOption === correctAnswer) {
          room.answers[questionId].winnerId = ws.id;
          room.answers[questionId].timestamp = Date.now();
          
          room.players.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'question-locked',
                payload: { questionId, winnerId: ws.id },
              }));
            }
          });
          return;
        }

        // If both players have attempted and neither got it right, lock with no winner
        const attempts = room.answers[questionId].attempts;
        if (attempts.length === 2) {
          room.answers[questionId].winnerId = null;
          room.answers[questionId].timestamp = Date.now();
          
          room.players.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'question-locked',
                payload: { questionId, winnerId: null },
              }));
            }
          });
        }
      }      if (type === 'rematch-request') {
        const room = rooms[ws.roomId];
        if (!room) return;

        // Generate new room ID when requesting rematch
        const newRoomId = String(Math.floor(100000 + Math.random() * 900000));
        
        // Store the new room ID with the current room
        room.pendingRematchRoom = newRoomId;

        // Notify other player about rematch request
        const otherPlayer = room.players.find(p => p.id !== ws.id);
        if (otherPlayer && otherPlayer.readyState === WebSocket.OPEN) {
          otherPlayer.send(JSON.stringify({
            type: 'rematch-requested',
            payload: { 
              requesterId: ws.id,
              newRoomId: newRoomId 
            }
          }));
        }
      }      
        if (type === 'rematch-accept') {
        const room = rooms[ws.roomId];
        if (!room || !room.pendingRematchRoom) return;

        const newRoomId = room.pendingRematchRoom;
        
        // Create new room if it doesn't exist
        if (!rooms[newRoomId]) {
          rooms[newRoomId] = {
            players: [],
            answers: {},
            rematchVotes: new Set()
          };
        }

        // Get the accepting player and requesting player
        const acceptingPlayer = ws;
        const requestingPlayer = room.players.find(p => p.id !== ws.id);

        
        room.players = room.players.filter(p => p.id !== acceptingPlayer.id && p.id !== requestingPlayer.id);

       
        acceptingPlayer.roomId = newRoomId;
        requestingPlayer.roomId = newRoomId;
        
        rooms[newRoomId].players.push(acceptingPlayer);
        rooms[newRoomId].players.push(requestingPlayer);

        const playersInfo = [acceptingPlayer, requestingPlayer].map(player => ({
          playerId: player.id,
          gamertag: player.gamertag,
        }));        
        [acceptingPlayer, requestingPlayer].forEach(player => {
          if (player.readyState === WebSocket.OPEN) {
            player.send(JSON.stringify({
              type: 'rematch-started',
              payload: { 
                newRoomId,
                players: playersInfo
              }
            }));
            
            
            player.send(JSON.stringify({
              type: 'both-joined',
              payload: { 
                players: playersInfo
              }
            }));
          }
        });

        
        delete rooms[ws.roomId];
      }

      if (type === 'rematch-decline') {
        const room = rooms[ws.roomId];
        if (!room) return;

        const requestingPlayer = room.players.find(p => p.id !== ws.id);
        if (requestingPlayer && requestingPlayer.readyState === WebSocket.OPEN) {
          requestingPlayer.send(JSON.stringify({
            type: 'rematch-declined'
          }));
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

