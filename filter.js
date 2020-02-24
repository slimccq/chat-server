'use strict';

const fs = require('fs');

// build a trie to insert word and do search
class ProfanityFilter {
    constructor() {
        this.reset();
    }

    reset() {
        this.size = 0;
        this.root = {
            'children': {}, 
            'isEnd': false
        };
    }

    loadWordsFromFile(filename) {
        let buf = fs.readFileSync(filename);
        let content = buf.toString();
        let lines = content.split('\n');
        this.reset();
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            this.insertWord(line);
        }
    }

    insertWord(text) {
        let node = this.root;
        text = text.toLowerCase();
        let word = Array.from(text);
        for (let i = 0; i < word.length; i++) {
            let char = word[i];
            if (!(char in node['children'])) {
                node['children'][char] = {'children': {}, 'isEnd': false};
            } 
            node = node['children'][char];
        }
        node['isEnd'] = true;
        this.size += 1;
    }

    matchAt(sentence, pos) {
        let node = this.root;
        while (pos >= 0 && pos < sentence.length) {
            let char = sentence[pos];
            if (char in node['children']) {
                let child = node['children'][char];
                if (child['isEnd']) {
                    return pos;
                } 
                node = child;
            } else {
                return -1;
            }
            pos++;
        }
        return -1;
    }

    matchString(sentence) {
        for (let i = 0; i < sentence.length; i++) {
            let idx = this.matchAt(sentence, i);
            if (idx >= 0) {
                return [i, idx];
            }
        }
    }

    filterText(text) {
        text = text.toLowerCase();
        let sentence = Array.from(text);
        let range = this.matchString(sentence);
        if (range == undefined) {
            return text;
        }
        let start = range[0];
        let end = range[1];
        for (let i = start; i <= end; i++) {
            sentence[i] = '*';
        }
        return sentence.join('');
    }
}

module.exports.ProfanityFilter = ProfanityFilter

let filter = new ProfanityFilter();
filter.loadWordsFromFile('list.txt');