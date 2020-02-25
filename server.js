'use strict';

const fs = require('fs');
const WebSocket = require('ws');
const {ChatRoom} = require('room');
const {Player} = require('player');


class ChatServer {
    constructor(port) {
        this.port = port;
        this.serial = 0;
        this.room = new ChatRoom();
    }

    loadWordsFromFile(filename) {
        let buf = fs.readFileSync(filename);
        let content = buf.toString();
        let lines = content.split('\n');
        this.reset();
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            this.insertWord(line);
        }
    }
    
    start() {
        let self = this;
        this.ws = new WebSocket.Server({ port: this.port });
        this.ws.on('connection', function (ws) {
            let serial = self.nextSerial();
            player = new Player(self.serial, ws, this.room);
            self.player[self.serial] = connection;
            player.start();
        });
    }
    
    nextSerial() {
        this.serial += 1;
        return this.serial;
    }
}


module.exports = ChatServer;
