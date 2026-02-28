const socketIO = require('socket.io');

const initSocket = (server) => {
    const io = socketIO(server);
    io.on('connection', (socket) => {
        console.log('User connected');
    });
};

module.exports = initSocket;
