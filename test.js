const test = require('ava');
const util = require('./util')
const Trie = require('./trie');

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

// test('join_room', t => {
    
// });