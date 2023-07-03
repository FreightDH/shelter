(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 300) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 300) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 300) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".menu__icon")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".menu__icon")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
                document.querySelector(".menu__body").classList.toggle("menu-open");
                document.querySelector(".blackout").classList.toggle("active");
            }
            if (bodyLockStatus && e.target.closest(".menu__link")) {
                bodyUnlock();
                document.documentElement.classList.remove("menu-open");
                document.querySelector(".menu__body").classList.remove("menu-open");
                document.querySelector(".blackout").classList.remove("active");
            }
            if (bodyLockStatus && !e.target.closest(".menu__body")) {
                bodyUnlock();
                document.documentElement.classList.remove("menu-open");
                document.querySelector(".menu__body").classList.remove("menu-open");
                document.querySelector(".blackout").classList.remove("active");
            }
        }));
    }
    const getRandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    document.querySelectorAll(".popup-link");
    const closeIcon = document.querySelector(".popup__close");
    const popupImage = document.querySelector(".popup__image");
    const popupTitle = document.querySelector(".popup__title");
    const popupSubtitle = document.querySelector(".popup__subtitle");
    const popupText = document.querySelector(".popup__text");
    const popupList = document.querySelectorAll(".popup__list--item");
    function popupInit(popupLinks) {
        if (popupLinks.length > 0) popupLinks.forEach((link => {
            link.addEventListener("click", (function(event) {
                const popup = document.querySelector(".popup");
                const petName = link.children[1].textContent;
                popupFill(popup, petName);
                popupOpen(popup);
                event.preventDefault();
            }));
        }));
        if (closeIcon) closeIcon.addEventListener("click", (function(event) {
            popupClose(event.target.closest(".popup"));
            popupClear();
        }));
    }
    function popupOpen(popup) {
        if (popup && bodyLockStatus) {
            bodyLock();
            popup.classList.add("popup-open");
            popup.addEventListener("click", (function(event) {
                if (!event.target.closest(".popup__content")) popupClose(event.target.closest(".popup"));
            }));
        }
    }
    function popupClose(popup) {
        if (bodyLockStatus) {
            bodyUnlock();
            popup.classList.remove("popup-open");
        }
    }
    function popupClear() {
        popupImage.innerHTML = "";
        popupTitle.textContent = "";
        popupSubtitle.textContent = "";
        popupText.textContent = "";
        popupList[0].lastChild.textContent = "";
        popupList[1].lastChild.textContent = "";
        popupList[2].lastChild.textContent = "";
        popupList[3].lastChild.textContent = "";
    }
    async function popupFill(popup, petName) {
        const file = "files/pets.json";
        const result = await fetch(file);
        const petsInfo = await result.json();
        const length = petsInfo.length;
        let infoIndex;
        for (infoIndex = 0; infoIndex < length; infoIndex++) if (petsInfo[infoIndex]["name"] === petName) break;
        popupImage.innerHTML = `<img src="${petsInfo[infoIndex]["img"]}" alt="pet">`;
        popupTitle.textContent = petsInfo[infoIndex]["name"];
        popupSubtitle.textContent = petsInfo[infoIndex]["type"] + " - " + petsInfo[infoIndex]["breed"];
        popupText.textContent = petsInfo[infoIndex]["description"];
        popupList[0].lastChild.textContent = petsInfo[infoIndex]["age"];
        popupList[1].lastChild.textContent = petsInfo[infoIndex]["inoculations"].join(", ");
        popupList[2].lastChild.textContent = petsInfo[infoIndex]["diseases"].join(", ");
        popupList[3].lastChild.textContent = petsInfo[infoIndex]["parasites"].join(", ");
    }
    const arrowLeft = document.querySelector(".arrow--l");
    const arrowLeftMobile = document.querySelector(".arrow--l--mobile");
    const arrowRight = document.querySelector(".arrow--r");
    const arrowRightMobile = document.querySelector(".arrow--r--mobile");
    const slider = document.querySelector(".slider__wrapper");
    let columnLeft = document.querySelector(".column-left");
    let columnActive = document.querySelector(".column-active");
    let columnRight = document.querySelector(".column-right");
    let pastArray = [];
    let currentArray = [];
    let nextArray = [];
    let activeNames = [];
    let prevActiveNames = [];
    let index;
    let leftClickCount = 0;
    let rightClickCount = 0;
    async function createCard(i, card, index) {
        const file = "files/pets.json";
        const result = await fetch(file);
        const petsInfo = await result.json();
        card.classList.add("pets__column");
        card.classList.add(`column--${++i}`);
        card.innerHTML = `\n\t\t\t\t\t\t\t<div class="pets__card card popup-link">\n\t\t\t\t\t\t\t\t<div class="card__image"><img src="${petsInfo[index]["img"]}" alt="pet"></div>\n\t\t\t\t\t\t\t\t<div class="card__name">${petsInfo[index]["name"]}</div>\n\t\t\t\t\t\t\t\t<a href="#" class="card__button btn btn--w"><span>Learn more</span></a>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t`;
        let popupLinks = document.querySelectorAll(".popup-link");
        popupInit(popupLinks);
    }
    function generateSliderColumn(column) {
        let array = [];
        for (let i = 0; i < 3; i++) {
            do {
                index = getRandomNum(0, 7);
            } while (activeNames.includes(index) || prevActiveNames.includes(index));
            const card = document.createElement("div");
            createCard(i, card, index);
            array.push(card);
            activeNames.push(index);
        }
        prevActiveNames = [].concat(activeNames);
        activeNames = [];
        return array;
    }
    function sliderInit() {
        activeNames = [];
        prevActiveNames = [].concat(activeNames);
        nextArray = generateSliderColumn();
        currentArray = [].concat(nextArray);
        nextArray = generateSliderColumn();
        pastArray = [].concat(currentArray);
        currentArray = [].concat(nextArray);
        nextArray = generateSliderColumn();
        columnLeft.innerHTML = columnActive.innerHTML = columnRight.innerHTML = "";
        pastArray.forEach((column => columnLeft.append(column)));
        currentArray.forEach((column => columnActive.append(column)));
        nextArray.forEach((column => columnRight.append(column)));
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
        slider.classList.add("move-left");
        arrowLeft.removeEventListener("click", moveLeft);
        arrowLeftMobile.removeEventListener("click", moveLeft);
        arrowRight.removeEventListener("click", moveRight);
        arrowRightMobile.removeEventListener("click", moveRight);
        if (!leftClickCount && rightClickCount > 1) changeToBackward(); else backward();
        leftClickCount++;
        rightClickCount = 0;
    }
    function moveRight() {
        slider.classList.add("move-right");
        arrowLeft.removeEventListener("click", moveLeft);
        arrowLeftMobile.removeEventListener("click", moveLeft);
        arrowRight.removeEventListener("click", moveRight);
        arrowRightMobile.removeEventListener("click", moveRight);
        if (!rightClickCount && leftClickCount) changeToForward(); else forward();
        rightClickCount++;
        leftClickCount = 0;
    }
    arrowLeft.addEventListener("click", moveLeft);
    arrowLeftMobile.addEventListener("click", moveLeft);
    arrowRight.addEventListener("click", moveRight);
    arrowRightMobile.addEventListener("click", moveRight);
    slider.addEventListener("animationend", (animationEvent => {
        if ("move-left" === animationEvent.animationName) slider.classList.remove("move-left"); else slider.classList.remove("move-right");
        arrowLeft.addEventListener("click", moveLeft);
        arrowLeftMobile.addEventListener("click", moveLeft);
        arrowRight.addEventListener("click", moveRight);
        arrowRightMobile.addEventListener("click", moveRight);
        columnLeft.innerHTML = columnActive.innerHTML = columnRight.innerHTML = "";
        pastArray.forEach((column => columnLeft.append(column)));
        currentArray.forEach((column => columnActive.append(column)));
        nextArray.forEach((column => columnRight.append(column)));
    }));
    isWebp();
    menuInit();
    sliderInit();
})();