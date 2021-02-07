function Laso(dictionary) {
    let self = this;
    this.imagesPath = 'assets/images/';
    this.dictionary = dictionary;

    this.wordElement = document.getElementById('word');

    this.words = null;

    this.getRandomWord = function() {
        if (!this.words) {
            this.fetchRandomWord();
        }
        else {
            let i = self.getRandomInt(0, this.words.length -1);
            let word = this.words[i];

            if (word.word.includes(' ')) {
                word = null;
                this.getRandomWord();
            }
            self.drawWord(word);
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
            image.innerHTML = `<img src="${wordImage}">`;

            let anagram = document.getElementById('anagram');
            anagram.dataset.word = wordText;
            anagram.dataset.anagram = anagramText;


            anagram.innerHTML = null;
            this.wordElement.innerHTML = null;
            this.wordElement.dataset.word = '';

            let i = 0;
            for (let letter of anagramText) {
                this.wordElement.innerHTML += `<button class="btn m-1 btn-outline-primary" id="w-${i}" onclick="laso.putLetterBack(this)">&nbsp;</button>`;
                anagram.innerHTML += `<button class="btn m-1 btn-outline-primary" id="a-${i}" onclick="laso.putLetter(this)">${letter}</button>`;
                i++;
            }
        }

    };

    this.putLetter = function(element) {
        let letter = element.innerText;
        this.wordElement.dataset.word += letter;

        let letterElement = document.getElementById('w-'+(this.wordElement.dataset.word.length-1));
        letterElement.textContent = letter;
        letterElement.dataset.target = element.id;
        element.classList.add('invisible');

    };

    this.putLetterBack = function(element) {
        element.textContent = '\u00a0'; //no brake space &nbsp;
        //this.wordElement.dataset.word += letter;
        let anagramElement = document.getElementById(element.dataset.target);
        anagramElement.classList.remove('invisible');

    };

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
