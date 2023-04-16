import "../scss/style.scss";
import * as myFunctions from "./files/functions.js";
import { sliderInit } from "./files/slider.js";

// Проверка поддержки webp, добавление класса webp или no-webp для HTML
myFunctions.isWebp();
// Модуль для работы с меню-бургер
myFunctions.menuInit();
// Модуль для работы со слайдером
sliderInit();