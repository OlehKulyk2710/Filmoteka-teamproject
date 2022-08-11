import * as filmsAPI from '../api/fetchFilms';

import { genresModal } from '../modal/genresModal.js';
import { onBackDropModalClose } from '../modal/modal-close.js';
import { onBtnModalClose } from '../modal/modal-close.js';
import { onEscapeModalClose } from '../modal/modal-close.js';
import { renderModal } from '../modal/renderModalHome';
import { addFilmsToLocal } from '../local-storage/addDataToLocalStorage';
import { darkModalTheme } from '../modal/modal-dark.js';
import { checkAuthUser } from '../auth-firebase/auth-userstate';
import { onAddBtn } from '../auth-firebase/auth-main';
import { manageBtnsState } from '../auth-firebase/modal-btns-state';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

let movieId = '';

const backDrop = document.querySelector('.backdrop');
let modalContainer = document.querySelector('.modal__container');
const btnClose = document.querySelector('.js-modal-btn');
const cardEl = document.querySelector('.gallery');
cardEl.addEventListener('click', onClickCard);
const body = document.querySelector('body');
const headerEl = document.querySelector('.header__library');

//object from localStorage
let localStorageFilmCard = {
  id: '',
  poster_path: '',
  original_title: '',
  vote_average: '',
  vote_count: '',
  popularity: '',
  original_title: '',
  genres: '',
  overview: '',
  release_date: '',
};

export async function onClickCard(e) {
  if (!headerEl) {
    return;
  }
  if (
    e.target.className !== 'gallery__item' &&
    e.target.className !== 'gallery__image' &&
    e.target.className !== 'gallery__title' &&
    e.target.className !== 'gallery__genres' &&
    e.target.className !== 'gallery__date' &&
    e.target.className !== 'gallery__vote'
  ) {
    return;
  }

  body.style.overflow = 'hidden';
  backDrop.classList.remove('visually-hidden');

  const id = document.querySelector('.gallery__item');
  if (e.target.className !== 'gallery__item') {
    movieId = e.target.parentElement.dataset.id;
  } else {
    movieId = e.target.dataset.id;
  }

  //film on id
  const filmsData = await filmsAPI.getOneMovieDetails(movieId);
  genresModal(filmsData);

  const cardModal = renderModal(filmsData);

  modalContainer.insertAdjacentHTML('afterbegin', cardModal);
  darkModalTheme();

  localStorageFilmCard.id = movieId;
  localStorageFilmCard.poster_path = `https://image.tmdb.org/t/p/original${filmsData.poster_path}`;
  localStorageFilmCard.original_title = filmsData.original_title;
  localStorageFilmCard.vote_average = filmsData.vote_average;
  localStorageFilmCard.vote_count = filmsData.vote_count;
  localStorageFilmCard.popularity = filmsData.popularity;
  localStorageFilmCard.original_title = filmsData.original_title;
  localStorageFilmCard.genres = filmsData.genres;
  localStorageFilmCard.overview = filmsData.overview;
  localStorageFilmCard.release_date = filmsData.release_date;

  const btnTrailer = document.querySelector('.trailerClick');
  btnTrailer.addEventListener('click', onClick);
  const btnList = document.querySelector('.button-modal');
  btnClose.addEventListener('click', onBtnModalClose);
  document.addEventListener('keydown', onEscapeModalClose);
  backDrop.addEventListener('click', onBackDropModalClose);
  btnList.addEventListener('click', onAddLibraryFilm);
  manageBtnsState(movieId);
}

// async function onAddLibraryFilm(e) {
//   const film = await localStorageFilmCard;
//   if (e.target.nodeName !== 'BUTTON') {
//     return;
//   }
//   if (e.target.dataset.action === 'add-to-watched') {
//     const localKey = 'watchedFilms';
//     addFilmsToLocal(film, localKey);
//   } else {
//     const localKey = 'queueFilms';
//     addFilmsToLocal(film, localKey);
//   }
// }

// ------Modified version onAddLibraryFilm by Oleh------
export async function onAddLibraryFilm(e) {
  const isUserAuthorised = checkAuthUser();
  if (!isUserAuthorised) {
    Notify.failure(
      '"You are not authorized. Please sign in to your account or register."'
    );
    return;
  }

  const movieDetails = await localStorageFilmCard;

  if (e.target.nodeName !== 'BUTTON') {
    return;
  }

  onAddBtn(e, movieDetails);
}

const YOUTUBE_URL = 'https://www.youtube.com/embed/';
const apiKey = '2ddded2d287329b6efbf335a6f8f3bd4';

async function onClick() {
  const btnTrailer = document.querySelector('.trailerClick');
  const box = document.querySelector('.video');
  if (box.classList.value === 'video aktive') {
    btnTrailer.textContent = 'TRAILER';
    box.classList.remove('aktive');
    box.innerHTML = '';
    return;
  }
  const videoId = localStorageFilmCard.id;
  await fetch(
    `https://api.themoviedb.org/3/movie/${videoId}/videos?api_key=${apiKey}`
  )
    .then(response => response.json())
    .then(data => {
      let key = '';
      // console.log(data.results);
      data.results.forEach(item => {
        if (item.name.includes('Official')) {
          key = item.key;
        }
      });
      box.innerHTML = `<iframe
        src="${YOUTUBE_URL}${key}?autoplay=0&mute=0&controls=1"
       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
         allowfullscreen>
        </iframe>
      `;
      box.classList.add('aktive');
      btnTrailer.textContent = 'CLOSE TRAILER';
    });
}
