import axios from 'axios';
import Loading from './loader';
const BASE_URL = 'https://api.themoviedb.org/3';
const KEY = '?api_key=2ddded2d287329b6efbf335a6f8f3bd4';

async function fetchFilms(url) {
  Loading.arrows();
  try {
    const response = await axios.get(url);
    Loading.remove();
    console.log(response.data);
    return response.data;
  } catch (error) {
    Loading.remove();
    console.log(error.message);
  }
}

// Посилання на документацію для запиту на список найпопулярніших фільмів на сьогодні для створення колекції на головній сторінці:
export function fetchTrending(pageNumber = 1) {
  return fetchFilms(`${BASE_URL}/trending/movie/day${KEY}&page=${pageNumber}`)
    .then(data => data.results)
    .catch(error => console.log(error));
}
// Посилання на документацію для запиту фільму за ключовим словом на головній сторінці:
export function searchMovies(movie, pageNumber) {
  return fetchFilms(
    `${BASE_URL}/search/movie${KEY}&query=${movie}&page=${pageNumber}`
  );
}
// Посилання на документацію для запиту повної інформації про кінофільм для сторінки кінофільму:
export function getOneMovieDetails(movieId) {
  return fetchFilms(`${BASE_URL}/movie/${movieId}${KEY}`);
}
