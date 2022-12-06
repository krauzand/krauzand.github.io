class Question {

	constructor() {
		this.question = document.getElementById('q-question');
		this.answer = document.getElementById('q-answer');
		this.funFact = document.getElementById('q-fun-fact');
		this.funFactValue = document.getElementById('q-fun-fact-value');
		this.showAnswerButton = document.getElementById('q-show-answer');
		this.id = document.getElementById('q-id');
		this.questions = null;
		this.usedIndices = [];
	}

	getRandomQuestion() {
		this.readQuestions().then(
			response => {
				if (!this.questions || this.questions.length === 0) {
					this.question.innerText = 'Jautājumi beigušies!';
					this.answer.innerText = '';
					this.id.innerText = '';
					this.answer.classList.add('d-none');
					this.showAnswerButton.setAttribute('disabled', '');
				} else {
					let randomIndex = Math.floor(Math.random()*this.questions.length);

					this.usedIndices.push(randomIndex);
					let question = this.questions[randomIndex];
					this.questions.splice(randomIndex,1); //remove from array

					this.question.innerText = question.question;
					this.answer.innerText = question.answer;
					this.funFactValue.innerText = question.fun_fact;

					this.id.innerText = question.id + '/'+this.questions.length;
					this.answer.classList.add('d-none');
					this.funFact.classList.add('d-none');
					this.showAnswerButton.removeAttribute('disabled');
				}

				
			}
		);
	}

	showAnswer() {
		this.answer.classList.remove('d-none');
		if (this.funFactValue.innerText) {
			this.funFact.classList.remove('d-none');
		}
		this.showAnswerButton.setAttribute('disabled', '');
	}

	readQuestions () {
		if (this.questions) {
			return new Promise((resolve, reject) => {
				resolve(true);
			});
		}

		return fetch('q.json')
			.then(response => {
				if (!response.ok) {
					throw new Error("HTTP error " + response.status);
				}
				return response.json();
			})
			.then(json => {
				this.questions = json;
			})
			.catch(function () {
				this.questions = null;
			})
	}
}

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

let question = new Question();
question.getRandomQuestion();
