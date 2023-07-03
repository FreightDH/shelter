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
    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [ array[j], array[i] ];
        }
        return array;
    };
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
    const initialArray = [];
    const resultArray = [];
    let index;
    (() => {
        let count = 0;
        const tempArray = [];
        for (let i = 0; i < 8; i++) {
            count++;
            do {
                index = getRandomNum(0, 7);
            } while (tempArray.includes(index));
            tempArray.push(index);
            if (count % 3 === 0) initialArray.push(tempArray.slice(count - 3, count));
        }
        initialArray.push(tempArray.slice(-2));
    })();
    (() => {
        for (let i = 0; i < 6; i++) initialArray.forEach((subArray => {
            resultArray.push(...shuffleArray(subArray));
        }));
    })();
    const leftDoubleArrow = document.querySelector(".arrow--l--double");
    const leftArrow = document.querySelector(".arrow--l--pets");
    const rightArrow = document.querySelector(".arrow--r--pets");
    const rightDoubleArrow = document.querySelector(".arrow--r--double");
    const currentPage = document.querySelector(".pagination__current");
    const pets = document.querySelectorAll(".pets__column");
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
        const file = "files/pets.json";
        const result = await fetch(file);
        const petsInfo = await result.json();
        const cardImage = card.children[0].children[0].children[0];
        cardImage.setAttribute("src", petsInfo[index]["img"]);
        const cardName = card.children[0].children[1];
        cardName.textContent = petsInfo[index]["name"];
        let popupLinks = document.querySelectorAll(".popup-link");
        popupInit(popupLinks);
    }
    function paginationInit() {
        const maxCardsValue = getMaxCardsValue();
        for (let i = 0; i < maxCardsValue; i++) createCard(pets[i], resultArray[i]);
    }
    function firstPage() {
        const maxCardsValue = getMaxCardsValue();
        for (let i = 0; i < maxCardsValue; i++) createCard(pets[i], resultArray[i]);
        currentPage.textContent = 1;
        rightArrow.classList.remove("disabled");
        rightDoubleArrow.classList.remove("disabled");
        leftArrow.classList.add("disabled");
        leftDoubleArrow.classList.add("disabled");
    }
    function prevPage() {
        const maxPageValue = getMaxPageValue();
        const maxCardsValue = getMaxCardsValue();
        if (currentPage.textContent == maxPageValue) {
            rightArrow.classList.remove("disabled");
            rightDoubleArrow.classList.remove("disabled");
        }
        if (currentPage.textContent > 1) currentPage.textContent -= 1;
        if (1 == currentPage.textContent) {
            leftArrow.classList.add("disabled");
            leftDoubleArrow.classList.add("disabled");
        }
        for (let i = (currentPage.textContent - 1) * maxCardsValue, j = 0; j < maxCardsValue; i++, 
        j++) createCard(pets[j], resultArray[i]);
    }
    function nextPage() {
        const maxPageValue = getMaxPageValue();
        const maxCardsValue = getMaxCardsValue();
        if (1 == currentPage.textContent) {
            leftArrow.classList.remove("disabled");
            leftDoubleArrow.classList.remove("disabled");
        }
        if (currentPage.textContent < maxPageValue) currentPage.textContent = Number(currentPage.textContent) + 1;
        if (currentPage.textContent == maxPageValue) {
            rightArrow.classList.add("disabled");
            rightDoubleArrow.classList.add("disabled");
        }
        for (let i = (currentPage.textContent - 1) * maxCardsValue, j = 0; j < maxCardsValue; i++, 
        j++) createCard(pets[j], resultArray[i]);
    }
    function lastPage() {
        const maxCardsValue = getMaxCardsValue();
        currentPage.textContent = getMaxPageValue();
        rightArrow.classList.add("disabled");
        rightDoubleArrow.classList.add("disabled");
        leftArrow.classList.remove("disabled");
        leftDoubleArrow.classList.remove("disabled");
        for (let i = 40, j = 0; j < maxCardsValue; i++, j++) createCard(pets[j], resultArray[i]);
    }
    leftDoubleArrow.addEventListener("click", firstPage);
    leftArrow.addEventListener("click", prevPage);
    rightArrow.addEventListener("click", nextPage);
    rightDoubleArrow.addEventListener("click", lastPage);
    window.addEventListener("resize", (function(event) {
        const maxPageValue = getMaxPageValue();
        if (currentPage.textContent > maxPageValue) lastPage(); else if (currentPage.textContent < maxPageValue) {
            rightArrow.classList.remove("disabled");
            rightDoubleArrow.classList.remove("disabled");
        } else if (1 == currentPage.textContent) firstPage();
    }));
    isWebp();
    menuInit();
    paginationInit();
})();