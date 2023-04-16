import "../scss/style.scss";
import * as myFunctions from "./files/functions.js";
import { paginationInit } from "./files/pagination.js";

// Проверка поддержки webp, добавление класса webp или no-webp для HTML
myFunctions.isWebp();
// Модуль для работы с меню-бургер
myFunctions.menuInit();
// Модуль для работы с пагинацией
paginationInit();