'use strict';


class Trie {
    constructor() {
        this.size = 0;
        this.root = {'children': {}};
        this.frequency = {'freq': 0, 'word': ''};
    }

    /**
     * @method
     * @param {String} [word] a word of string
     * @param {Bool} [use_freqency=false] whether calculate word freqency
     */
    insertWord(word, use_freqency) {
        let node = this.root;
        let text = word.toLowerCase();
        let arr = Array.from(text);
        for (let i = 0; i < arr.length; i++) {
            let char = arr[i];
            if (!(char in node['children'])) {
                node['children'][char] = {'children': {}};
            } 
            node = node['children'][char];
        }
        node['isEnd'] = true;
        this.size += 1;
        if (use_freqency) {
            this.addFrequency(text, node);
        }
    }

    /**
     * @method
     * @return {String} return most frequent word
     */
    addFrequency(word, node) {
        if (node['freq']) {
            node['freq'] += 1
        } else {
            node['freq'] = 1
        }
        if (node['freq'] > this.frequency['freq']) {
            this.frequency['freq'] = node['freq'];
            this.frequency['word'] = word;
        }
    }

    popularWord() {
        return this.frequency['word'];
    }

    /**
     * @method
     * @param {Array} [sentence] array of char 
     * @param {Number} [pos] start position of array to find profinity word
     * @return {Number} return index if profinity word found, otherwise return -1
     */
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

    /**
     * @method
     * @param {Array} [sentence] array of char 
     * @return {Array} array contains a start and end index, point a profanity word
     *          otherwise return empty array
     */
    matchString(sentence) {
        for (let i = 0; i < sentence.length; i++) {
            let idx = this.matchAt(sentence, i);
            if (idx >= 0) {
                return [i, idx];
            }
        }
        return [];
    }

    /**
     * @method
     * @param {string} [text] text string to filter
     * @return {string} filtered text with * character replaced
     */
    filterText(text) {
        text = text.toLowerCase();
        let sentence = Array.from(text);
        let range = this.matchString(sentence);
        if (range.length == 0) {
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

module.exports = Trie
