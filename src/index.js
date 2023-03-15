import { fetchCountries } from './js/fetchCountries.js';
import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};
refs.input.addEventListener('input', debounce(onFormInput, DEBOUNCE_DELAY));

function onFormInput(event) {
  resetInput();
  event.preventDefault();

  const form = event.target;
  const name = form.value.trim();
  if (name === '') {
    return;
  }
  fetchCountries(name)
    .then(response => {
      if (response.length === 1) {
        oneCountry(response);
      } else if (response.length > 1 && response.length <= 10) {
        listCountries(response);
      } else {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => {
      console.log(3);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function resetInput() {
  refs.info.innerHTML = '';
  refs.list.innerHTML = '';
}

function oneCountry(response) {
  const fullInfo = response
    .map(({ name, flags, capital, population, languages }) => {
      return `<img
      src="${flags.svg}"
      alt="${name.official}" width = "25" height = "15" />
      <h1>${name.official}</h1>
          <p>Capital: ${capital}</p>
          <p>Population: ${population}</p>
          <p>Languages: ${languages.map(el => el.value).join(', ')}</p>`;
    })
    .join('');
  console.log(oneCountry);
  refs.info.insertAdjacentHTML('beforeend', fullInfo);
}

function listCountries(response) {
  const shortInfo = response
    .map(({ name, flags }) => {
      return `<li>
    <img src="${flags.svg}"
    alt="${name.official}"
    width = "25"
    height = "15" />
  <p>${name.official}</p>
</li>`;
    })
    .join('');
  console.log(shortInfo);
  refs.list.insertAdjacentHTML('beforeend', shortInfo);
}
