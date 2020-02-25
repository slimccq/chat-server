'use strict';

const test = require('ava');
const WebSocket = require('ws');
const util = require('./util')
const Trie = require('./trie');
const ChatServer = require('./server');


test('format_time', t => {
    let input = [
        [new Date(2020, 2, 24, 0, 0, 0), new Date(2020, 2, 24, 0, 0, 0), '00d 00h 00m 00s'],
        [new Date(2020, 2, 24, 0, 0, 0), new Date(2020, 2, 25, 1, 1, 1), '01d 01h 01m 01s'],
        [new Date(2019, 12, 1, 0, 0, 0), new Date(2020, 2, 1, 1, 1, 1), '60d 01h 01m 01s'],
    ];
    for (let i = 0; i < input.length; i++) {
        let test_case = input[i];
        let output = util.formatElapsedTime(test_case[0], test_case[1]);
        // console.log(output, test_case[2]);
        t.true(output == test_case[2]);
    }
});

test('filter_text', t => {
    let words = ['dick', 'fuck', 'bitch', 'bastard'];
    let trie = new Trie();
    for (let i = 0; i < words.length; i++) {
        trie.insertWord(words[i]);
    }
    let output = {
        'dickies': '****ies',
        'brainfuck': 'brain****',
        'sandbitchg': 'sand*****g',
        'bastar': 'bastar',
    };
    for (let k in output) {
        let result = trie.filterText(k);
        // console.log(result, output[k]);
        t.true(result == output[k]);
    }
});

test('frequent_word', t => {
    let input = [
        ['hello', 'hello'],
        ['hello word', 'word'],
        ["how do u do", 'do'],
    ];
    for (let i = 0; i < input.length; i++) {
        let test_case = input[i];
        let trie = new Trie();
        let words = test_case[0].split(' ');
        for (let j = 0; j < words.length; j++) {
            trie.insertWord(words[j], true);
        }
        let output = trie.popularWord();
        // console.log(output, test_case[1]);
        t.true(output == test_case[1]);
    }
});

async function createWSClient(port, arr) {
    var promise = new Promise(function(resolve, reject) {
        const ws = new WebSocket(`ws://127.0.0.1:${port}/chat`);
        ws.on('open', function() {
            arr.push(ws);
            resolve();
        });
        ws.on('error', function(err) {
            // console.log(err);
        });
    });
    return promise;
}

async function waitForSec(sec) {
    var promise = new Promise(function(resolve, reject) {
        setTimeout(function(){
            resolve();
        }, sec);
    });
    return promise;
}

async function readMessage(ws, count, message_queue) {
    var promise = new Promise(function(resolve, reject) {
        ws.on('message', function(message) {
            message_queue.push(message);
            // console.log(message);
            if (message_queue.length >= count) {
                resolve();
            }
        });
    });
    return promise;
}

test('join_room', async t => {
    let port = 8008;
    let server = new ChatServer(port);
    server.start();
    
    await waitForSec(2);

    let to_send = [
        "a quick brown fox",
        "jumps over",
        "the lazy dog",
    ];

    let ws_list = [];
    await createWSClient(port, ws_list);
    await createWSClient(port, ws_list);

    let ws1 = ws_list[0];
    let ws2 = ws_list[1];

    ws1.send('tom');
    for (let i = 0; i < to_send; i++) {
        ws1.send(to_send[i]);
    }

    ws2.send('jerry');
    
    let to_recv = []; 
    await readMessage(ws2, to_send.length, to_recv);
    // console.log(to_recv);
    for (let i = 0; i < to_recv.length; i++) {
        t.true(to_send[i] == to_recv[i]);
    }
});

test('command_popular', async t => {
    let port = 8009;
    let server = new ChatServer(port);
    server.start();

    await waitForSec(1);

    let ws_list = [];
    await createWSClient(port, ws_list);
    let ws1 = ws_list[0];

    ws1.send('tom');
    ws1.send('how do u do');
    ws1.send('/popular');
   
    to_recv = [];
    await readMessage(ws2, to_send.length, to_recv);
    t.true(messages[0] == 'how do u do');
    t.true(messages[1], 'do');

    server.close();
});

test('command_stats', async t => {
    let server = new ChatServer(8010);
    server.start();

    await waitForSec(1);

    let ws_list = [];
    await createWSClient(port, ws_list);
    let ws1 = ws_list[0];

    ws1.send('tom');
    ws1.send('/stats tom');

    to_recv = [];
    await readMessage(ws2, 1, to_recv);

    t.true(to_recv.length > 0);
    
    server.close();
});
