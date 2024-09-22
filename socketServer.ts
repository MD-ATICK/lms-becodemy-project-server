import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

export const initSocketServer = (server: http.Server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {

        //  on  a socket , for user any activates.
        socket.on('notification', (data) => {

            // emit a socket for admin 
            io.emit('newNotification', data)
        })

        socket.on('disconnect', (socket) => {
            console.log('Client disconnected- ' + socket);
        });

        // separate;
    })
}