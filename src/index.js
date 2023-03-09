//Завдання - пошук країн
//Створи фронтенд частину програми пошуку даних про країну за її частковою або повною назвою.
//Напиши функцію fetchCountries(name), яка робить HTTP - запит на ресурс name і повертає проміс з масивом країн - результатом запиту.
// Винеси її в окремий файл fetchCountries.js і зроби іменований експорт.
//
import { Notify } from 'notiflix/build/notiflix-notify-aio'; // Імпорт бібліотеки notiflix для спливаючих повідомлень 'alert'
import debounce from 'lodash.debounce'; //Додали до проекту бібліотеку lodash.debounce
// для обробки події після того, як користувач перестав вводити текст
import { fetchCountries } from './js/fetchCountries'; // отримання результату запиту функції fetchCountries
import './css/styles.css'; //імпорт файлу стилів

const DEBOUNCE_DELAY = 300; // на обробнику подій затримка 300мс після того, як користувач перестав вводити текст в input

// Тобі потрібні тільки наступні властивості:

// name.official - повна назва країни
// capital - столиця
// population - населення
// flags.svg - посилання на зображення прапора
// languages - масив мов

const refs = {
  input: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.countryList.classList.add('visually-hidden');
refs.countryInfo.classList.add('visually-hidden');

// Додаємо слухача (обробку подій) на input
refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

// отримання списку знайдених країн або знайденої однієї країни
function onSearch(e) {
  // очистка пробілів перед значенням та після (санітизацію введеного рядка методом trim())
  const trimmedInputValue = refs.input.value.trim();

  cleanHtml(); // очистка розмітки
  // Якщо користувач повністю очищає поле пошуку, то HTTP-запит не виконується.
  if (!trimmedInputValue) {
    return;
  }

  fetchCountries(trimmedInputValue)
    .then(searchData => {
      if (searchData.length > 10) {
        notifyManyMatches();
        return;
      }
      renderResult(searchData);
    })
    .catch(error => {
      cleanHtml(); // очистка розмітки
      notifyNoContries();
    });
}

function notifyManyMatches() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function notifyNoContries() {
  Notify.failure('Oops, there is no country with that name');
}

function renderResult(searchData) {
  if (searchData.length === 1) {
    refs.countryList.innerHTML = '';
    refs.countryList.classList.add('visually-hidden');
    refs.countryInfo.classList.remove('visually-hidden');
    renderCountryInfo(searchData);
  }

  if (searchData.length >= 2 && searchData.length <= 10) {
    refs.countryList.classList.remove('visually-hidden');
    refs.countryInfo.classList.add('visually-hidden');
    renderCountryList(searchData);
  }
}

function renderCountryList(countries) {
  const markupCountryList = countries
    .map(({ name, flags }) => {
      return /*html*/ `<li>
            <img src="${flags.svg}" alt="Flag of ${name}" width="40">
            <span class="name-span">${name.official}</span>
        </li>`;
    })
    .join(''); // з'єднати рядки, щоб не було між ними ком

  refs.countryList.innerHTML = markupCountryList;
}

function renderCountryInfo(countries) {
  const markupCountryInfo = countries
    .map(({ flags, name, capital, population, languages }) => {
      return /*html*/ `
            <img src="${flags.svg}" alt="Flag of ${name.official}" width="240">
            <p class="country-name">${name.official}</p>
            <p><b>Capital</b>: ${capital}</p>
            <p><b>Population</b>: ${population}</p>
            <p><b>Languages</b>: ${Object.values(languages).join(', ')}</p>`;
    })
    .join(''); // з'єднати рядки, щоб не було між ними ком

  refs.countryInfo.innerHTML = markupCountryInfo;
}

// очистка розмітки списку знайдених країн та інформації про знайдену країну
function cleanHtml() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
