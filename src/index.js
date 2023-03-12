import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountryList } from './js/fetchCountries';

import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector(`#search-box`),
  list: document.querySelector(`.country-list`),
  info: document.querySelector(`.country-info`),
};

document.body.style.backgroundColor = `rgb(166, 201, 222)`;
refs.input.style.backgroundColor = `rgb(100, 201, 242)`;

refs.input.addEventListener(`input`, debounce(toHandleInput, 300));

function toHandleInput(e) {
  const inputValue = e.target.value.trim();

  if (!inputValue) {
    refs.list.innerHTML = ``;
    refs.info.innerHTML = ``;
  } else {
    finalMarkup(inputValue);
  }
}

function finalMarkup(inputValue) {
  fetchCountryList(inputValue).then(data => {
    if (data.length > 10) {
      refs.list.innerHTML = ``;
      refs.info.innerHTML = ``;
      onLenghtError(data.length);
    } else if (data.length > 1 && data.length <= 10) {
      refs.info.innerHTML = ``;
      MultipleCountriesMarkup(data);
    } else if (data.length === 1) {
      refs.list.innerHTML = ``;
      SingleCountryMarkup(data);
    }
  });
}

function onLenghtError(length) {
  if (length > 10) {
    Notiflix.Notify.info(
      `Too many matches found. Please enter a more specific name.`
    );
  }
}

function SingleCountryMarkup(data) {
  const singleCountry = data
    .map(({ flags, name, capital, population, languages }) => {
      const languageString = Object.values(languages).join(', ');
      return `<p class="country-main"><img src="${flags.svg}" alt="${flags.alt}" width="300" height="auto"/><span class="country-name">${name.official}</span></p>
      <p class="parameter-name">Capital: <span class="parameter-value">${capital}</span></p>
      <p class="parameter-name">Poplulation: <span class="parameter-value">${population}</span></p>
      <p class="parameter-name">Languages: <span class="parameter-value">${languageString}</span></p>`;
    })
    .join(``);

  refs.info.innerHTML = singleCountry;
  return singleCountry;
}

function MultipleCountriesMarkup(data) {
  const multipleCountries = data
    .map(({ flags, name }) => {
      return `<li class="country-list-item"> <img src="${flags.svg}" alt="${flags.alt}" width="150" height="auto"><span class="country-list-name">${name.official}</span> </li>`;
    })
    .join(``);
  refs.list.innerHTML = multipleCountries;
  return multipleCountries;
}
