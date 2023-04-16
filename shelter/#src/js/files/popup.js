import { bodyLockStatus, bodyLock, bodyUnlock } from "./functions.js";

const popupLinks = document.querySelectorAll('.popup-link');
const closeIcon = document.querySelector('.popup__close');
const popupImage = document.querySelector('.popup__image');
const popupTitle = document.querySelector('.popup__title');
const popupSubtitle = document.querySelector('.popup__subtitle');
const popupText = document.querySelector('.popup__text');
const popupList = document.querySelectorAll('.popup__list--item');
const popupInfo = [popupImage, popupTitle, popupSubtitle, popupText, popupList];

export function popupInit(popupLinks) {
	if (popupLinks.length > 0) {
		popupLinks.forEach(link => {
			link.addEventListener('click', function (event) {
				const popup = document.querySelector('.popup');
				const petName = link.children[1].textContent;
				popupFill(popup, petName);	
				popupOpen(popup);
				event.preventDefault();
			});
		})
	}

	if (closeIcon) {
		closeIcon.addEventListener('click', function (event) {
			popupClose(event.target.closest('.popup'));
			popupClear();
		});
	}
}

function popupOpen(popup) {
	if (popup && bodyLockStatus) {
		bodyLock();
		popup.classList.add('popup-open');
		popup.addEventListener('click', function (event) {
			if (!event.target.closest('.popup__content')) {
				popupClose(event.target.closest('.popup'));
			}
		});
	}
}

function popupClose(popup) {
	if (bodyLockStatus) {
		bodyUnlock();
		popup.classList.remove('popup-open');
	}
}

function popupClear() {
	popupImage.innerHTML = '';
	popupTitle.textContent = '';
	popupSubtitle.textContent = '';
	popupText.textContent = '';
	popupList[0].lastChild.textContent = '';
	popupList[1].lastChild.textContent = '';
	popupList[2].lastChild.textContent = '';
	popupList[3].lastChild.textContent = '';
}

async function popupFill(popup, petName) {
	const file = 'files/pets.json';
	const result = await fetch(file);
	const petsInfo = await result.json();
	const length = petsInfo.length;
	let infoIndex;

	for (infoIndex = 0; infoIndex < length; infoIndex++) {
		if (petsInfo[infoIndex]['name'] === petName) {
			break; 
		}
	}

	popupImage.innerHTML = `<img src="${petsInfo[infoIndex]['img']}" alt="pet">`;
	popupTitle.textContent = petsInfo[infoIndex]['name'];
	popupSubtitle.textContent = petsInfo[infoIndex]['type'] + ' - ' + petsInfo[infoIndex]['breed'];
	popupText.textContent = petsInfo[infoIndex]['description'];
	popupList[0].lastChild.textContent = petsInfo[infoIndex]['age'];
	popupList[1].lastChild.textContent = petsInfo[infoIndex]['inoculations'].join(', ');
	popupList[2].lastChild.textContent = petsInfo[infoIndex]['diseases'].join(', ');
	popupList[3].lastChild.textContent = petsInfo[infoIndex]['parasites'].join(', ');
}