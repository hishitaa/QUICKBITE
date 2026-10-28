const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

exports.init = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_ORIGIN === '*' ? true : process.env.CLIENT_ORIGIN },
  });

  // Authenticate every socket with the same JWT used for REST
  io.use((socket, next) => {
    try {
      socket.user = jwt.verify(socket.handshake.auth?.token, process.env.JWT_SECRET);
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user:${socket.user.id}`);
    if (socket.user.role === 'admin') socket.join('admins');
  });

  return io;
};

exports.toUser = (userId, event, payload) => io && io.to(`user:${userId}`).emit(event, payload);
exports.toAdmins = (event, payload) => io && io.to('admins').emit(event, payload);
