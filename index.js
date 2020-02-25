'use strict';

const ChatServer = require('./server');


function main() {
    let port = 8008;
    if (process.argv.length >= 3) {
        port = parseInt(process.argv[2]);
    }
    let server = new ChatServer(port);
    server.start();
    console.log('server listen on port', port);
}

main()
