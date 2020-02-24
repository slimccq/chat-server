'use strict';

const MAX_CHAT_HISTORY = 50;

class ChatRoom {
    constructor() {
        this.players = {};
        this.names = {};
        this.message_history = [];
    }

    putToHistory(content) {
        this.message_history.push(content);
        if (this.message_history.length > MAX_CHAT_HISTORY) {
            this.message_history.shift();
        }
    }

    sendHistory(player) {
        for(let message in this.message_history) {
            player.sendMessage(message);
        }
    }

    join(player) {
        self.players[player.serial] = player;
        self.names[player.name] = player.serial;
        content = `${player.name} joined`; 
        this.sendHistory(player);
        this.putToHistory(content);
        self.broadcast(content);
    }

    chat(player, message) {
        content = `${player.name}: ${message}`;
        this.putToHistory(content);
        self.broadcast(content);
    }

    leave(player) {
        message = `${player.name} leaved`; 
        this.putToHistory(content);
        delete this.players[player.serial];
    }

    broadcast(message) {
        for(let player in self.players) {
            player.sendMessage(message);
        } 
    }

    popularWords() {

    }

    onMessage(player, message) {
        try {
            if (player.isNameEmpty()) {
                player.setName(message);    // first message should be nickname of the player
                return;
            }
            if (message.startsWith('/')) {
                let command = message.substr(1);
                switch (command) {
                    case 'popular':
                        words = self.popularWords();
                        break;
                    case 'stats':
                        break;
                }
            } else {

            }

        }
        catch (ex) {
            console.log(ex);
        }
    }
}


module.exports = ChatRoom;
