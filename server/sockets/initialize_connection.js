const socketIO = require('socket.io');
const Message = require('../models/message/message');

module.exports = (http, sessionMiddleware) => {
  const io = socketIO(http);

  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });

  io.use((socket, next) => {
    if (socket.request.session.user) return next();
    return next(new Error('Authentication error'));
  });

  io.sockets.on('connection', (socket) => {
    console.log(socket.request.session);
    socket.on('chat message', async (message) => {
      console.log(`message: ${message}`);
      const newMessage = new Message({
        message,
        created: Date(),
        // eslint-disable-next-line no-underscore-dangle
        author: socket.request.session.user._id,
      });
      try {
        let newMessageDB = await newMessage.save();
        newMessageDB = await newMessageDB.populate('author').execPopulate();
        io.emit('chat message', newMessageDB);
      } catch (error) {
        socket.emit('message delivery failed', error);
      }
    });
  });
};
