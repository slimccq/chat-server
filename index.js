'use strict';

const {ChatServer} = require('./chat_server');

function main() {
    let server = new ChatServer(8008);
    server.start();
    console.log('chat server started');
}

main()
