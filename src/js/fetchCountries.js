const BASE_URL = 'https://restcountries.com/v3.1/name/';

const searchFields = new URLSearchParams({
  fields: 'name,capital,population,flags,languages,', //рядок параметрів запиту
});

//Функція fetchCountries за параметром name
export const fetchCountries = name => {
  return fetch(`${BASE_URL}${name}?${searchFields}`).then(response => {
    //у випадку коли немає відповіді або користувач ввів назву країни, якої не існує:
    //fetch не вважає 404 помилкою, тому необхідно явно відхилити проміс і мати можливість зловити і обробити помилку.
    if (response.status === 404) {
      throw new Error(response.status);
    }
    return response.json(); //повернення списку країн у форматі .json
  });
};
