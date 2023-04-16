import { getRandomNum, shuffleArray } from "./functions.js";
import { popupInit } from "./popup.js";

// ПОДГОТОВИТЕЛЬНАЯ ЧАСТЬ
const initialArray = [];
const resultArray = [];
let index;

// Генерация массива вида [[3, 1, 6], [7, 5, 2], [4, 0]]
(() => {
	let count = 0;
	const tempArray = [];
	for (let i = 0; i < 8; i++) {
		count++;
		do {
			index = getRandomNum(0, 7);
		} while (tempArray.includes(index));
		tempArray.push(index);

		if (count % 3 === 0) {
			initialArray.push(tempArray.slice(count - 3, count));
		}
	}
	initialArray.push(tempArray.slice(-2));
})();

// Генерация восьми перемешанных массивов на основе сгенерированного ранее
(() => {
	for (let i = 0; i < 6; i++) {
		initialArray.forEach(subArray => {
			resultArray.push(...shuffleArray(subArray));
		});
	}
})();
// ----------------------------------------------------------------------
const leftDoubleArrow = document.querySelector('.arrow--l--double');
const leftArrow = document.querySelector('.arrow--l--pets');
const rightArrow = document.querySelector('.arrow--r--pets');
const rightDoubleArrow = document.querySelector('.arrow--r--double');
const currentPage = document.querySelector('.pagination__current');
const pets = document.querySelectorAll('.pets__column');

function getMaxPageValue() {
	if (document.documentElement.clientWidth > 1269) return 6;
	if (document.documentElement.clientWidth > 767) return 8;
	return 16;
}

function getMaxCardsValue() {
	if (document.documentElement.clientWidth > 1269) return 8;
	if (document.documentElement.clientWidth > 767) return 6;
	return 3;
}

async function createCard(card, index) {
	const file = 'files/pets.json';
	const result = await fetch(file);
	const petsInfo = await result.json();

	const cardImage = card.children[0].children[0].children[0];
	cardImage.setAttribute('src', petsInfo[index]['img']);

	const cardName = card.children[0].children[1];
	cardName.textContent = petsInfo[index]['name'];

	let popupLinks = document.querySelectorAll('.popup-link');
	popupInit(popupLinks);
}

export function paginationInit() {
	const maxCardsValue = getMaxCardsValue();

	for (let i = 0; i < maxCardsValue; i++) {
		createCard(pets[i], resultArray[i]);
	}
}

function firstPage() {
	const maxCardsValue = getMaxCardsValue();
	
	for (let i = 0; i < maxCardsValue; i++) {
		createCard(pets[i], resultArray[i]);
	}

	currentPage.textContent = 1;

	rightArrow.classList.remove('disabled');
	rightDoubleArrow.classList.remove('disabled');
	leftArrow.classList.add('disabled');
	leftDoubleArrow.classList.add('disabled');
}

function prevPage() {
	const maxPageValue = getMaxPageValue();
	const maxCardsValue = getMaxCardsValue();

	if (currentPage.textContent == maxPageValue) {
		rightArrow.classList.remove('disabled');
		rightDoubleArrow.classList.remove('disabled');
	}

	if (currentPage.textContent > 1) {
		currentPage.textContent -= 1;
	}

	if (currentPage.textContent == 1) {
		leftArrow.classList.add('disabled');
		leftDoubleArrow.classList.add('disabled');
	}

	for (let i = (currentPage.textContent - 1) * maxCardsValue, j = 0; j < maxCardsValue; i++, j++) {
		createCard(pets[j], resultArray[i]);
	}
}

function nextPage() {
	const maxPageValue = getMaxPageValue();
	const maxCardsValue = getMaxCardsValue();

	if (currentPage.textContent == 1) {
		leftArrow.classList.remove('disabled');
		leftDoubleArrow.classList.remove('disabled');
	}

	if (currentPage.textContent < maxPageValue) {
		currentPage.textContent = Number(currentPage.textContent) + 1;
	}

	if (currentPage.textContent == maxPageValue) {
		rightArrow.classList.add('disabled');
		rightDoubleArrow.classList.add('disabled');
	}

	for (let i = (currentPage.textContent - 1) * maxCardsValue, j = 0; j < maxCardsValue; i++, j++) {
		createCard(pets[j], resultArray[i]);
	}
}

function lastPage() {
	const maxCardsValue = getMaxCardsValue();
	currentPage.textContent = getMaxPageValue();

	rightArrow.classList.add('disabled');
	rightDoubleArrow.classList.add('disabled');
	leftArrow.classList.remove('disabled');
	leftDoubleArrow.classList.remove('disabled');
	
	for (let i = 40, j = 0; j < maxCardsValue; i++, j++) {
		createCard(pets[j], resultArray[i]);
	}
}

leftDoubleArrow.addEventListener('click', firstPage);
leftArrow.addEventListener('click', prevPage);
rightArrow.addEventListener('click', nextPage);
rightDoubleArrow.addEventListener('click', lastPage);

window.addEventListener('resize', function (event) {
	const maxPageValue = getMaxPageValue();

	if (currentPage.textContent > maxPageValue) {
		lastPage();
	} else if (currentPage.textContent < maxPageValue) {
		rightArrow.classList.remove('disabled');
		rightDoubleArrow.classList.remove('disabled');
	} else if (currentPage.textContent == 1) {
		firstPage();
	}
});