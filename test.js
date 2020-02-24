const test = require('ava');
const {ProfanityFilter} = require('./filter');

test('filter_text', t => {
    let words = ['dick', 'fuck', 'bitch', 'bastard'];
    let filter = new ProfanityFilter();
    for (let word in words) {
        filter.insertWord(word);
    }
    let output = {
        'dickies': '****ies',
        'brainfuck': 'brain****',
        'sandbitchg': 'sand*****g',
        'bastar': 'bastar',
    };
    for (let k in output) {
        t.true(filter.filterText(k), output[k]);
    }
    
});