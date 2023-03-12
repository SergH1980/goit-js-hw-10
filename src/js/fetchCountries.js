import Notiflix from 'notiflix';

const URL = `https://restcountries.com/v3.1/name/`;

export function fetchCountryList(inputValue) {
  return fetch(
    `${URL}${inputValue}?fields=name,capital,population,flags,languages`
  )
    .then(res => {
      if (res.status === 404) {
        Notiflix.Notify.failure(`Oops, there is no country with that name`);
      }
      return res.json();
    })
    .catch(error => {
      console.log(error);
    });
}
