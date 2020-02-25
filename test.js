const test = require('ava');
const {Trie} = require('./trie');

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