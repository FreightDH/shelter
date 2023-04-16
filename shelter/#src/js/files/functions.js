// ПРОВЕРКА ПОДДЕРЖКИ WEBP
export function isWebp() {
	// Проверка поддержки webp
	function testWebP(callback) {
		let webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2);
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}
	// Добавление класса _webp или _no-webp для HTML
	testWebP(function (support) {
		let className = support === true ? 'webp' : 'no-webp';
		document.documentElement.classList.add(className);
	});
}
//----------------------------------------------------------------------

// МОДУЛИ БЛОКИРОВКИ ПРОКРУТКИ
export let bodyLockStatus = true;

export let bodyLockToggle = (delay = 300) => {
	if (document.documentElement.classList.contains('lock')) {
		bodyUnlock(delay);
	} else {
		bodyLock(delay);
	}
}

export let bodyUnlock = (delay = 300) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = '0px';
			}
			body.style.paddingRight = '0px';
			document.documentElement.classList.remove("lock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
}

export let bodyLock = (delay = 300) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		}
		body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		document.documentElement.classList.add("lock");

		bodyLockStatus = false;
		setTimeout(function () {
			bodyLockStatus = true;
		}, delay);
	}
}
//----------------------------------------------------------------------

// МЕНЮ-БУРГЕР
export function menuInit() {
	if (document.querySelector(".menu__icon")) {
		document.addEventListener("click", function (e) {
			if (bodyLockStatus && e.target.closest('.menu__icon')) {
				bodyLockToggle();
				document.documentElement.classList.toggle("menu-open");
				document.querySelector(".menu__body").classList.toggle("menu-open");
				document.querySelector(".blackout").classList.toggle("active");
			}
			if (bodyLockStatus && e.target.closest('.menu__link')) {
				bodyUnlock();
				document.documentElement.classList.remove("menu-open");
				document.querySelector(".menu__body").classList.remove("menu-open");
				document.querySelector(".blackout").classList.remove("active");
			}
			if (bodyLockStatus && !e.target.closest('.menu__body')) {
				bodyUnlock();
				document.documentElement.classList.remove("menu-open");
				document.querySelector(".menu__body").classList.remove("menu-open");
				document.querySelector(".blackout").classList.remove("active");
			}
		});
	};
}

export function menuOpen() {
	bodyLock();
	document.documentElement.classList.add("menu-open");
	document.querySelector(".menu__body").classList.toggle("menu-open");
}

export function menuClose() {
	bodyUnlock();
	document.documentElement.classList.remove("menu-open");
	document.querySelector(".menu__body").classList.toggle("menu-open");
}
//----------------------------------------------------------------------

// ДРУГОЕ

// ГЕНЕРАЦИЯ СЛУЧАЙНОГО ЧИСЛА, ВКЛЮЧАЯ MIN и MAX
export const getRandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
//----------------------------------------------------------------------

// ПЕРЕМЕШИВАНИЕ МАССИВА
export const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
}
//----------------------------------------------------------------------

//----------------------------------------------------------------------