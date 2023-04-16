import { popupInit } from "./popup.js";
import { getRandomNum } from "./functions.js";

const arrowLeft = document.querySelector('.arrow--l');
const arrowLeftMobile = document.querySelector('.arrow--l--mobile');
const arrowRight = document.querySelector('.arrow--r');
const arrowRightMobile = document.querySelector('.arrow--r--mobile');
const slider = document.querySelector(".slider__wrapper");

let columnLeft = document.querySelector('.column-left');
let columnActive = document.querySelector('.column-active');
let columnRight = document.querySelector('.column-right');

let pastArray = [];
let currentArray = [];
let nextArray = [];

let activeNames = [];
let prevActiveNames = [];

let index;

let leftClickCount = 0;
let rightClickCount = 0;

async function createCard(i, card, index) {
	const file = 'files/pets.json';
	const result = await fetch(file);
	const petsInfo = await result.json();

	card.classList.add('pets__column');
	card.classList.add(`column--${++i}`);
	card.innerHTML = `
							<div class="pets__card card popup-link">
								<div class="card__image"><img src="${petsInfo[index]['img']}" alt="pet"></div>
								<div class="card__name">${petsInfo[index]['name']}</div>
								<a href="#" class="card__button btn btn--w"><span>Learn more</span></a>
							</div>
							`;

	let popupLinks = document.querySelectorAll('.popup-link');
	popupInit(popupLinks);
}

function generateSliderColumn(column) {
	let array = [];

	for (let i = 0; i < 3; i++) {
		do {
			index = getRandomNum(0, 7);
		} while (activeNames.includes(index) || prevActiveNames.includes(index));

		const card = document.createElement('div');
		createCard(i, card, index);
		array.push(card);
		activeNames.push(index);
	}
	prevActiveNames = [].concat(activeNames)
	activeNames = [];

	return array;
}

export function sliderInit() {
	activeNames = [];
	prevActiveNames = [].concat(activeNames);

	nextArray = generateSliderColumn();
	currentArray = [].concat(nextArray);

	nextArray = generateSliderColumn();
	pastArray = [].concat(currentArray);
	currentArray = [].concat(nextArray);

	nextArray = generateSliderColumn();

	columnLeft.innerHTML = columnActive.innerHTML = columnRight.innerHTML = '';
	pastArray.forEach(column => columnLeft.append(column));
	currentArray.forEach(column => columnActive.append(column));
	nextArray.forEach(column => columnRight.append(column));
}

function forward() {
	pastArray = [].concat(currentArray);
	currentArray = [].concat(nextArray);
	nextArray = generateSliderColumn();
}

function changeToBackward() {
	for (let i = 0; i < 3; i++) {
		let temp = pastArray[i];
		pastArray[i] = currentArray[i];
		currentArray[i] = temp;
	}

	nextArray = generateSliderColumn();
}

function backward() {
	nextArray = [].concat(currentArray);
	currentArray = [].concat(pastArray);
	pastArray = generateSliderColumn();
}

function changeToForward() {
	for (let i = 0; i < 3; i++) {
		let temp = nextArray[i];
		nextArray[i] = currentArray[i];
		currentArray[i] = temp;
	}

	pastArray = generateSliderColumn();
}

function moveLeft() {
	slider.classList.add('move-left');
	arrowLeft.removeEventListener("click", moveLeft);
	arrowLeftMobile.removeEventListener("click", moveLeft);
	arrowRight.removeEventListener("click", moveRight);
	arrowRightMobile.removeEventListener("click", moveRight);

	if (!leftClickCount && rightClickCount > 1) {
		changeToBackward();
	} else {
		backward();
	}

	leftClickCount++; rightClickCount = 0;
}

function moveRight() {
	slider.classList.add('move-right');
	arrowLeft.removeEventListener("click", moveLeft);
	arrowLeftMobile.removeEventListener("click", moveLeft);
	arrowRight.removeEventListener("click", moveRight);
	arrowRightMobile.removeEventListener("click", moveRight);

	if (!rightClickCount && leftClickCount) {
		changeToForward();
	} else {
		forward();
	}

	rightClickCount++; leftClickCount = 0;
}

arrowLeft.addEventListener('click', moveLeft);
arrowLeftMobile.addEventListener('click', moveLeft);
arrowRight.addEventListener('click', moveRight);
arrowRightMobile.addEventListener('click', moveRight);

slider.addEventListener("animationend", (animationEvent) => {
	if (animationEvent.animationName === "move-left") {
		slider.classList.remove("move-left");
	} else {
		slider.classList.remove("move-right");
	}

	arrowLeft.addEventListener("click", moveLeft);
	arrowLeftMobile.addEventListener("click", moveLeft);
	arrowRight.addEventListener("click", moveRight);
	arrowRightMobile.addEventListener("click", moveRight);

	columnLeft.innerHTML = columnActive.innerHTML = columnRight.innerHTML = '';
	pastArray.forEach(column => columnLeft.append(column));
	currentArray.forEach(column => columnActive.append(column));
	nextArray.forEach(column => columnRight.append(column));
});

// export function sliderInit() {
	
// }

// const arrowLeft = document.querySelector('.arrow--l');
// const arrowLeftMobile = document.querySelector('.arrow--l--mobile');
// const arrowRight = document.querySelector('.arrow--r');
// const arrowRightMobile = document.querySelector('.arrow--r--mobile');
// const slider = document.querySelector(".slider__wrapper");
// const sliderColumns = document.querySelectorAll('.slider__column');

// let pastArray = [];
// let currentArray = [];
// let nextArray = [];
// let resultArray = [];

// let index;

// function getMaxCardsValue() {
// 	if (document.documentElement.clientWidth > 1230) return 3;
// 	if (document.documentElement.clientWidth > 767) return 2;
// 	return 1;
// }

// function getGenerationStep() {
// 	if (document.documentElement.clientWidth > 1230) return 1;
// 	if (document.documentElement.clientWidth > 767) return 2;
// 	return 3;
// }

// async function createCard(card, index) {
// 	const file = 'files/pets.json';
// 	const result = await fetch(file);
// 	const petsInfo = await result.json();

// 	const cardImage = card.children[0].children[0].children[0];
// 	cardImage.setAttribute('src', petsInfo[index]['img']);

// 	const cardName = card.children[0].children[1];
// 	cardName.textContent = petsInfo[index]['name'];

// 	let popupLinks = document.querySelectorAll('.popup-link');
// 	popupInit(popupLinks);
// }

// function fillColumns() {
// 	const maxCardsValue = getMaxCardsValue();

// 	resultArray = [].concat(pastArray, currentArray, nextArray);
// 	for (let i = 0; i < 3; i++) {
// 		for (let j = 0; j < maxCardsValue; j++) {
// 			createCard(sliderColumns[i].children[j], resultArray[j]);
// 		}
// 	}
// }

// function init() {
// 	const maxCardsValue = getMaxCardsValue();
// 	const generationStep = getGenerationStep();
	
// 	for (let i = 0; i < maxCardsValue; i++) {
// 		do {
// 			index = getRandomNum(0, 7);
// 		} while (nextArray.includes(index));
// 		nextArray.push(i);
// 	}
// 	currentArray = [].concat(nextArray);
// 	nextArray = [];

// 	for (let i = 0; i < maxCardsValue; i++) {
// 		do {
// 			index = getRandomNum(0, 7);
// 		} while (nextArray.includes(index) || currentArray.includes(index));
// 		nextArray.push(index);
// 	}
// 	pastArray = [].concat(currentArray);
// 	currentArray = [].concat(nextArray);
// 	nextArray = [];

// 	for (let i = 0; i < maxCardsValue; i++) {
// 		do {
// 			index = getRandomNum(0, 7);
// 		} while (nextArray.includes(index) || currentArray.includes(index));
// 		nextArray.push(index);
// 	}

// 	fillColumns();
// }

// init();

// function forward() {
// 	const maxCardsValue = getMaxCardsValue();

// 	pastArray = [].concat(currentArray);
// 	currentArray = [].concat(nextArray);
// 	nextArray = [];

// 	for (let i = 0; i < maxCardsValue; i++) {
// 		do {
// 			index = getRandomNum(0, 7);
// 		} while (nextArray.includes(index) || currentArray.includes(index));
// 		nextArray.push(index);
// 	}

// 	fillColumns();
// }

// function changeToBackward() {
// 	const maxCardsValue = getMaxCardsValue();

// 	for (let i = 0; i < maxCardsValue; i++) {
// 		let temp = pastArray[i];
// 		pastArray[i] = currentArray[i];
// 		currentArray[i] = temp;
// 	}

// 	nextArray = [];
// 	for (let i = 0; i < maxCardsValue; i++) {
// 		do {
// 			index = getRandomNum(0, 7);
// 		} while (nextArray.includes(index) || currentArray.includes(index));
// 		nextArray.push(index);
// 	}

// 	fillColumns();
// }

// function backward() {
// 	const maxCardsValue = getMaxCardsValue();

// 	nextArray = [].concat(currentArray);
// 	currentArray = [].concat(pastArray);
// 	pastArray = [];

// 	for (let i = 0; i < maxCardsValue; i++) {
// 		do {
// 			index = getRandomNum(0, 7);
// 		} while (pastArray.includes(index) || currentArray.includes(index));
// 		pastArray.push(index);
// 	}

// 	fillColumns();
// }

// function changeToForward() {
// 	const maxCardsValue = getMaxCardsValue();

// 	for (let i = 0; i < maxCardsValue; i++) {
// 		let temp = nextArray[i];
// 		nextArray[i] = currentArray[i];
// 		currentArray[i] = temp;
// 	}

// 	pastArray = [];
// 	for (let i = 0; i < maxCardsValue; i++) {
// 		do {
// 			index = getRandomNum(0, 7);
// 		} while (pastArray.includes(index) || currentArray.includes(index));
// 		pastArray.push(index);
// 	}

// 	fillColumns();
// }

// function moveLeft() {
// 	slider.classList.add('move-left');
// 	arrowLeft.removeEventListener("click", moveLeft);
// 	arrowLeftMobile.removeEventListener("click", moveLeft);
// 	arrowRight.removeEventListener("click", moveRight);
// 	arrowRightMobile.removeEventListener("click", moveRight);

// 	backward();

// 	console.log(pastArray);
// 	console.log(currentArray);
// 	console.log(nextArray);
// }

// function moveRight() {
// 	slider.classList.add('move-right');
// 	arrowLeft.removeEventListener("click", moveLeft);
// 	arrowLeftMobile.removeEventListener("click", moveLeft);
// 	arrowRight.removeEventListener("click", moveRight);
// 	arrowRightMobile.removeEventListener("click", moveRight);

// 	forward();
// }

// arrowLeft.addEventListener('click', moveLeft);
// arrowLeftMobile.addEventListener('click', moveLeft);
// arrowRight.addEventListener('click', moveRight);
// arrowRightMobile.addEventListener('click', moveRight);

// slider.addEventListener("animationend", (animationEvent) => {
// 	if (animationEvent.animationName === "move-left") {
// 		slider.classList.remove("move-left");
// 	} else {
// 		slider.classList.remove("move-right");
// 	} 

// 	arrowLeft.addEventListener("click", moveLeft);
// 	arrowLeftMobile.addEventListener("click", moveLeft);
// 	arrowRight.addEventListener("click", moveRight);
// 	arrowRightMobile.addEventListener("click", moveRight);
// });

// window.addEventListener('resize', function (event) {
	
// });