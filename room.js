'use strict';

const fs = require('fs');
const util = require('./util');
const Trie = require('./trie');


const MAX_CHAT_HISTORY = 50;
const MAX_CALC_POPULAR_SEC = 5;

class ChatRoom {
    constructor() {
        this.players = {};
        this.names = {};
        this.message_history = [];
        this.filter_trie = new Trie();
        this.loadProfanity();
    }

    /**
     * @method load profanity word list from file
     */
    loadProfanity() {
        let buf = fs.readFileSync('list.txt');
        let content = buf.toString();
        let lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            this.filter_trie.insertWord(line);
        }
    }

    /**
     * @method
     * @param {Array} [sentence] array of char 
     * @param {Number} [pos] start position of array to find profinity word
     * @return {Number} return index if profinity word found, otherwise return -1
     */
    putToHistory(name, words) {
        let now = new Date();
        this.message_history.push({'name': name, 'words': words, 'time': now});
        if (this.message_history.length > MAX_CHAT_HISTORY) {
            let head = this.message_history[0];
            if (now - head['time'] > MAX_CALC_POPULAR_SEC * 1000) {
                this.message_history.shift();
            }
        }
    }

    /**
     * @method send back a list of the last 50 chat messages
     * @param {Player} [player] 
     */
    sendHistory(player) {
        let start_pos = 0;
        if (this.message_history.length > MAX_CHAT_HISTORY) {
            start_pos = this.message_history.length - MAX_CHAT_HISTORY;
        }
        for(let i = start_pos; i < this.message_history.length; i++) {
            let message = this.message_history[i];
            let words = message['words'];
            let filtered = [];
            for (let i = 0; i < words.length; i++) {
                let word = words[i];
                let text = this.filter_trie.filterText(word);
                filtered[i] = text;
            }
            let content = filtered.join(' ');
            let text = `${message.name}: ${content}`;
            player.sendMessage(text);
        }
    }

    /**
     * @method handle player join chat room
     * @param {Player} [player] 
     */
    join(player) {
        this.players[player.serial] = player;
        this.names[player.name] = player;
        let content = `${player.name} joined`; 
        this.sendHistory(player);
        // this.broadcast(content);
        console.log(content);
    }

    /**
     * @method handle player leave chat room
     * @param {Player} [player] 
     */
    leave(player) {
        let content = `${player.name} leaved`; 
        delete this.names[player.name];
        delete this.players[player.serial];
        // this.broadcast(content);
        console.log(content);
    }

    broadcast(message) {
        for(let serial in this.players) {
            let player = this.players[serial];
            player.sendMessage(message);
        } 
    }

    /**
     * @method
     * @return {String} most popular word in the last 5 seconds
     */
    popularWord() {
        let now = new Date();
        let trie = new Trie();
        for(let i = this.message_history.length - 1; i >= 0; i--) {
            let message = this.message_history[i];
            if (now - message['time'] <= 1000 * MAX_CALC_POPULAR_SEC) {
                let words = message['words'];
                for (let j = 0; j < words.length; j++) {
                    trie.insertWord(words[j], true);
                }
            } else {
                break;
            }
        }
        return trie.popularWord();
    }

    /**
     * @method
     * @param {String} [name] player name
     * @return {String} how long the user has been logged in
     */
    stats(name) {
        let player = this.names[name];
        if (player) {
            let now = new Date();
            return util.formatElapsedTime(now, player.loggin_time);
        }
        return '';
    }

    /**
     * @method
     * @param {Player} [player] player object
     * @param {Array} [words] array of words player chat
     */
    handleChat(player, words) {
        let filtered = [];
        for (let i = 0; i < words.length; i++) {
            let word = words[i];
            let text = this.filter_trie.filterText(word);
            filtered[i] = text;
        }
        this.putToHistory(player.name, words);
        let content = filtered.join(' ');
        let text = `${player.name}: ${content}`;
        this.broadcast(text);
    }

    /**
     * @method
     * @param {Player} [player] player object
     * @param {Array} [words] array of words, contains command and its parameters
     */
    handleCommand(player, words) {
        let command = words[0];
        switch (command) {
            case '/popular':
                let word = this.popularWord();
                player.sendMessage(word);
                break;
            case '/stats':
                if (words.length >= 1) {
                    let text = this.stats(words[1]);
                    player.sendMessage(text);
                }
                break;
            default:
                // unrecognized command
                break;
        }
    }

    /**
     * @method
     * @param {Player} [player] player object
     * @param {String} [message] message player sent to server
     */
    onMessage(player, message) {
        try {
            if (message.length == 0) {
                return ;
            }
            let words = message.split(' ');
            if (player.isNameEmpty()) {
                player.setName(words[0]);    // send name first 
                this.join(player);
                return;
            }
            if (words[0].startsWith('/')) {
                this.handleCommand(player, words);
            } else {
                this.handleChat(player, words);
            }

        }
        catch (err) {
            console.log(err.stack);
        }
    }
}


module.exports = ChatRoom;
