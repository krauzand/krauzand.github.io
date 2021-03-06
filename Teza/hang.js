let maxAttempts = 12;
let attempts = 0;


function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function newWord() {
	attempts = 0;
	fetch("nouns-10-1.json")
		.then(response => response.json())
		.then(function (json) {

			let wordLen = getRandomInt(4,6);
			let i = Math.trunc(Math.random() * json[wordLen].length);

			let word = json[wordLen][i].word;
			word = word.toUpperCase();

			document.getElementById('word').value = word;
			let board = document.querySelector('#board');
			board.removeAttribute('hidden');//todo: smooth transition new word

			//init board
			board.innerHTML = '';
			let animated = '';
			for (let index = 0; index < wordLen; index++) {
				if ((index+1) == wordLen) {
					animated = 'animated'
				}
				board.innerHTML += "<div id='c"+(index+1)+"' class='cell "+animated+"'></div>";
			}

			//init keyboard
			let letters = ['A', 'Ā', 'B', 'C', 'Č', 'D', 'E', 'Ē', 'F', 'G', 'Ģ', 'H', 'I', 'Ī', 'J', 'K', 'Ķ', 'L', 'Ļ', 'M', 'N', 'Ņ', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'Ū', 'V', 'Z', 'Ž'];
			let keyboard = document.getElementById('keyboard');
			keyboard.innerHTML = "";
			letters.forEach(function(letter){
				keyboard.innerHTML += "<button class='btn btn-outline-secondary m-1' onclick='checkLetter(this)'>"+letter+"</button>"
			});
			keyboard.innerHTML += "<button id='new-word' class='btn btn-primary' onclick='newWord()'>Citu vārdu</button>";

			//init attempts
			let attempts = document.getElementById('attempts');
			attempts.innerHTML = '';
			for (let index = 0; index < maxAttempts; index++) {
				attempts.innerHTML += 
				"<span id='attempt-"+(index+1)+"' class='badge badge-pill mr-1 badge-success'>"+(index+1)+"</span>";
			}

			//init info
			document.getElementById('word-info').innerHTML = '';

			//reset trophy
			document.getElementById('trophy').removeAttribute('style');
			document.getElementById('trophy').hidden = true;

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
	return word.split('');
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

	if (isComplete()) {
		return false;
	}
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
			document.getElementById('attempt-' + attempts).className = 'badge badge-pill mr-1 badge-danger';
		}

		if (!complete && attempts >= maxAttempts) {
			reveal();
			return false;
		}
		anime({
			targets: element,
			rotate: '180deg',
			duration: 2000,
		});
			
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
	});	
}

function celebrateReverse() {
	reverseAnimateTrophy();
}

function reverseAnimateTrophy() {
	//reverse trophy
	anime({
		targets: '.trophy',
		scale: [0, 1],
		rotate: 720,
		duration: 1000,
		direction: 'reverse',
		complete: function() {newWord() }
		}
	);
}

function animateTrophy() {
	anime({
		targets: '.trophy',
		scale: [0, 1],
		rotate: 360,
		delay: 200,
		duration: 2000,
		begin: function() { document.getElementById('trophy').removeAttribute('hidden'); },
		complete: function() { showInfo() }
	});
}

function celebrate() {
	if (!isComplete()) {
		return false;
	}
	else {
		animateTrophy();
	}
}


function showInfo() {
	document.getElementById('word-info').innerHTML = "<a target='_blank' href='http://tezaurs.lv/#/sv/"+document.querySelector('#word').value.toLowerCase() +"'>Kas ir " + document.querySelector('#word').value +"?</a>"
}

newWord();
