"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketServer = void 0;
const socket_io_1 = require("socket.io");
const initSocketServer = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
        //  on  a socket , for user any activates.
        socket.on('notification', (data) => {
            // emit a socket for admin 
            io.emit('newNotification', data);
        });
        socket.on('disconnect', (socket) => {
            console.log('Client disconnected- ' + socket);
        });
        // separate;
    });
};
exports.initSocketServer = initSocketServer;
