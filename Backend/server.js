// server.js
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const rooms = {}; // In-memory room tracking

// Game room data structure
const gameRooms = new Map();

function setupWebSocket(server) {
  console.log("log for connedction")
  const wss = new WebSocket.Server({ server }); 
  wss.on('connection', (ws) => {
    console.log("log for connedction")
    ws.id = uuidv4();
    
    ws.roomId = null;

    ws.on('message', (message) => {
      let parsed;
      try {
        console.log("Received message:", message);
        
        parsed = JSON.parse(message);
      } catch {
        return;
      }

      const { type, payload } = parsed;

      if (type === 'join-room') {
  const { roomId, gamertag, category, language, level } = payload;

  if (!/^\d{6}$/.test(roomId)) {
    ws.send(JSON.stringify({ type: 'invalid-room-id', payload: { message: 'Room ID must be a 6-digit number.' } }));
    return;
  }

  if (!rooms[roomId]) {
    rooms[roomId] = {
      players: [],
      answers: {},
      language,
      level,
      category
    };
  }

  // Save player metadata
  ws.gamertag = gamertag;
  ws.roomId = roomId;
  ws.language = language;
  ws.level = level;
  ws.category = category;

  console.log(`Player ${ws.id} (${gamertag}) joined room ${roomId}`);
  console.log(`Language: ${language}, Level: ${level}, Category: ${category}`);

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
          payload: {
            players: playersInfo,
            language: rooms[roomId].language,
            level: rooms[roomId].level,
            category: rooms[roomId].category
          }
        }));
      }
    });
  }

  ws.send(JSON.stringify({
    type: 'joined',
    payload: {
      playerId: ws.id,
      language: rooms[roomId].language,
      level: rooms[roomId].level,
      category: rooms[roomId].category
    }
  }));
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
      }      if (type === 'rematch-decline') {
        const room = rooms[ws.roomId];
        if (!room) return;

        const requestingPlayer = room.players.find(p => p.id !== ws.id);
        if (requestingPlayer && requestingPlayer.readyState === WebSocket.OPEN) {
          requestingPlayer.send(JSON.stringify({
            type: 'rematch-declined'
          }));
        }
      }

      if (type === 'player-exit') {
        const room = rooms[ws.roomId];
        if (!room) return;        // Notify other player about the exit
        room.players.forEach((player) => {
          if (player.id !== ws.id && player.readyState === WebSocket.OPEN) {
            player.send(JSON.stringify({
              type: 'opponent-left'
            }));
          }
        });
        
        // Clean up the room
        delete rooms[ws.roomId];

        // Each client will close their own connection after navigation
      }

      if (type === 'createRoom') {
        const { gamertag, language, level, category, questions } = payload;
        const roomId = generateUniqueRoomId();
        
        gameRooms.set(roomId, {
          creator: {
            id: ws.id,
            gamertag
          },
          language,
          level,
          category,
          questions,
          players: [ws.id],
          gameStarted: false
        });

        ws.join(roomId);
        ws.emit('roomCreated', { roomId });
      }

      if (type === 'joinRoom') {
        const { roomId, gamertag } = payload;
        const room = gameRooms.get(roomId);
        
        if (!room) {
          ws.emit('error', { message: 'Room not found' });
          return;
        }

        if (room.players.length >= 2) {
          ws.emit('error', { message: 'Room is full' });
          return;
        }

        // Add the second player
        room.players.push(ws.id);
        ws.join(roomId);

        // Send game configuration to joining player
        ws.emit('gameConfig', {
          language: room.language,
          level: room.level,
          category: room.category,
          questions: room.questions
        });

        // Notify both players that the game can start
        io.to(roomId).emit('gameReady', {
          players: [
            { id: room.creator.id, gamertag: room.creator.gamertag },
            { id: ws.id, gamertag }
          ]
        });
      }

      if (type === 'startGame') {
        const { roomId } = payload;
        const room = gameRooms.get(roomId);
        if (room) {
          room.gameStarted = true;
          io.to(roomId).emit('gameStarted');
        }
      }

      if (type === 'submitAnswer') {
        const { roomId, questionIndex, answer, score } = payload;
        io.to(roomId).emit('playerAnswer', {
          playerId: ws.id,
          questionIndex,
          answer,
          score
        });
      }

      ws.on('close', () => {
        const room = rooms[ws.roomId];
        if (room) {
          room.players = room.players.filter((p) => p.id !== ws.id);
          if (room.players.length === 0) {
            delete rooms[ws.roomId];
          }
        }

        // Clean up any rooms where this socket was a player
        for (const [roomId, room] of gameRooms.entries()) {
          if (room.players.includes(ws.id)) {
            room.players = room.players.filter(id => id !== ws.id);
            if (room.players.length === 0) {
              gameRooms.delete(roomId);
            } else {
              io.to(roomId).emit('playerLeft', { playerId: ws.id });
            }
          }
        }
      });
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

function generateUniqueRoomId() {
  let roomId;
  do {
    roomId = String(Math.floor(100000 + Math.random() * 900000));
  } while (rooms[roomId] || gameRooms.has(roomId)); // Ensure uniqueness in both structures
  return roomId;
}

module.exports = { setupWebSocket };

