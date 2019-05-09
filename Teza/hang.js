let maxAttempts = 11;
let attempts = 0;


function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function newWord() {
	attempts = 0;
	fetch("nouns-10.json")
		.then(response => response.json())
		.then(function (json) {

			let wordLen = getRandomInt(4,6);
			let i = Math.trunc(Math.random() * json[wordLen].length);

			let word = json[wordLen][i].word;
			word = word.toUpperCase();

			document.getElementById('word').value = word;
			let board = document.querySelector('#board');
			board.removeAttribute('hidden');

			//init board
			board.innerHTML = '';
			for (let index = 0; index < wordLen; index++) {
				board.innerHTML += "<div id='c"+(index+1)+"' class='cell'></div>";
			}

			//init keyboard
			let letters = ['A', 'Ā', 'B', 'C', 'Č', 'D', 'E', 'Ē', 'F', 'G', 'Ģ', 'H', 'I', 'Ī', 'J', 'K', 'Ķ', 'L', 'Ļ', 'M', 'N', 'Ņ', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'Ū', 'V', 'Z', 'Ž'];
			let keyboard = document.getElementById('keyboard');
			keyboard.innerHTML = "";
			letters.forEach(function(letter, index){
				keyboard.innerHTML += "<button class='btn btn-outline-secondary m-1' onclick='checkLetter(this)'>"+letter+"</button>"
			});
			keyboard.innerHTML += "<button id='new-word' class='btn btn-primary' onclick='newWord()'>Minēt citu vārdu</button>";

			//init attempts
			let attempts = document.getElementById('attempts');
			attempts.innerHTML = '';
			for (let index = 0; index < maxAttempts; index++) {
				attempts.innerHTML += "<span id='attempt-"+(index+1)+"' class='badge badge-pill badge-success m-1'>&nbsp;</span>";
			}

			//init info
			document.getElementById('word-info').innerHTML = '';

			return json;
		});
}

function getCell(index) {
	let cellId = 'c'+(index+1);
	return document.getElementById(cellId);
}

function changeLetter(index, letter) {
	getCell(index).innerHTML = letter;
	
	anime({
	  targets: '#'+getCell(index).id,
	  scale: 1.25,
	  direction: 'alternate',
	  delay: 10,
	});
}

function getWordLetters() {
	let word = document.querySelector('#word').value;
	let wordLetters = word.split('');
	return wordLetters;
}

function isComplete(){
	
	let complete = true;
	getWordLetters().forEach(function(item, index){
		if (getCell(index).innerText === '') {
			complete = false;
		}
	});
	return complete;
}

function checkLetter(element) {
	let correctGuess = false;
	let letter = element.innerHTML;
	
	getWordLetters().forEach(function(item, index){
		if (item === letter) {
			correctGuess = true;
			changeLetter(index,letter)
		}
		element.className = element.className + " disabled";
		element.disabled = true;
	});

	let complete = isComplete();

	if (!correctGuess) {
		attempts++;
		element.className = element.className.replace('btn-outline-secondary', 'btn-outline-danger');

		if (attempts <= maxAttempts) {
			document.getElementById('attempt-' + attempts).className = 'badge badge-pill badge-danger m-1';
		}
	}

	if (!complete && attempts >= maxAttempts) {
		reveal()
	}

	if (complete) {
		celebrate();
	}

}

function reveal() {
	let word = document.querySelector('#word').value;
	let wordLetters = word.split('');

	wordLetters.forEach(function(item, index){
		changeLetter(index,item)
	});
	showInfo();

	anime({
	  targets: '.attempts .badge',
	  translateY: document.getElementById('footer-info').getBoundingClientRect().top,
	  delay: anime.stagger(200),
	  //direction: 'alternate'
	});	
}

function celebrate() {
	if (!isComplete()) {
		return false;
	}
	else {
		showInfo();
		// anime({
		// 	targets: '.attempts .badge',
		// 	scale: 1.5,
		// 	translateX: 30,
		// 	direction: 'alternate',
		// 	delay: anime.stagger(50, {start: 500})
		// }
		// );
		anime({
			targets: '.trophy',
			scale: 150,
			delay: 1000,
		});
	}
}


function showInfo() {
	document.getElementById('word-info').innerHTML = "<a target='_blank' href='http://tezaurs.lv/#/sv/"+document.querySelector('#word').value.toLowerCase() +"'>Uzzināt, kas ir " + document.querySelector('#word').value +"?</a>"
}

newWord();
