'use strict';

class Player {
    constructor(ws, serial, room) {
        this.ws = ws;
        this.serial = serial;
        this.room = room;
        this.name = '';
        this.loggin_time = new Date();
    }

    start() {
        let self = this;
        this.ws.on('message', function (data) {
            self.room.onMessage(self, data);
        });
        this.ws.on('close', function (code, reason) {
            self.room.leave(self);
        });
    }

    isNameEmpty() {
        return this.name.length == 0;
    }

    setName(name) {
        this.name = name;
    }

    sendMessage(message) {
        this.ws.send(message);
    }
}

module.exports = Player;