'use strict';

const WebSocket = require('ws');
const http = require('http');
const ChatRoom = require('./room');
const Player = require('./player');


class ChatServer {
    constructor(port) {
        this.port = port;
        this.serial = 0;
        this.room = new ChatRoom();
    }
    
    start() {
        let self = this;
        this.ws = new WebSocket.Server({ port: this.port, path: '/chat' });
        this.ws.on('connection', function (ws) {
            console.log('ws session connected');
            let serial = self.nextSerial();
            let player = new Player(ws, serial, self.room);
            player.start();
        });

        this.ws.on('close', function() {
            console.log('server closed');
        });
    }
    
    nextSerial() {
        this.serial += 1;
        return this.serial;
    }
}


module.exports = ChatServer;
