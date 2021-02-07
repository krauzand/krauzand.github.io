function Laso(dictionary) {
    let self = this;
    this.imagesPath = 'assets/images/';
    this.dictionary = dictionary;
    this.words = null;

    this.getRandomWord = function() {
        if (!this.words) {
            this.fetchRandomWord();
        }
        else {
            let i = self.getRandomInt(0, this.words.length -1);
            self.drawWord(this.words[i]);
        }
    };

    this.fetchRandomWord = function() {
        fetch(this.dictionary)
            .then(response => response.json())
            .then(function (words) {
                self.words = words;
                self.getRandomWord();
            });
    };

    this.getRandomInt = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    this.drawWord = function (word) {
        if (word) {
            let wordText = word.word.toUpperCase();
            let wordImage = this.imagesPath + word.path;
            let anagramText = self.makeAnagram(wordText);

            let image = document.getElementById('word-image');
            let anagram = document.getElementById('anagram');

            anagram.innerText = anagramText;
            anagram.dataset.word = wordText;
            anagram.dataset.anagram = anagramText;

            image.innerHTML = `<img src="${wordImage}">`;
        }

    }
    this.makeAnagram = function(word) {
        //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        /* Randomize array in-place using Durstenfeld shuffle algorithm */
        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }

            return array;
        }
        return shuffleArray(word.split('')).join('');
    }
}

let laso = new Laso('dict.json');

let word = laso.getRandomWord();
