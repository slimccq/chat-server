'use strict';

class Player {
    constructor(ws, serial, room) {
        this.ws = ws;
        this.serial = serial;
        this.room = room;
        this.name = '';
        this.loggin_time = new Date();
    }

    /**
     * @method start read message from current connection
     */
    start() {
        let self = this;
        this.ws.on('message', function (data) {
            self.room.onMessage(self, data);
        });
        this.ws.on('close', function (code, reason) {
            self.room.leave(self);
        });
    }

    /**
     * @method 
     * @return {Bool} true if player name is empty
     */
    isNameEmpty() {
        return this.name.length == 0;
    }

    /**
     * @method 
     * @param {String} [name] player name to set
     */
    setName(name) {
        this.name = name;
    }

    /**
     * @method 
     * @param {String} [message] string to send
     */
    sendMessage(message) {
        this.ws.send(message);
    }
}

module.exports = Player;