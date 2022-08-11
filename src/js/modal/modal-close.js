import { onAddLibraryFilm } from '../modal/modal-library.js';
// added by Oleh ------------------------------------------
import { categoryRender } from '../pagination/libraryFilmsPagination';
// -----------------------------------------------------------
const backDrop = document.querySelector('.backdrop');
const btnClose = document.querySelector('.js-modal-btn');
const btnAddToWatch = document.querySelector('.button-modal');
const cardEl = document.querySelector('.gallery');
let modalContainer = document.querySelector('.modal__container');
const body = document.querySelector('body');

function removeListener() {
  backDrop.classList.add('visually-hidden');
  body.style.overflow = 'visible';
  cardEl.removeEventListener('click', onBackDropModalClose);
  document.removeEventListener('keydown', onEscapeModalClose);
  // btnAddToWatch.removeEventListener('click', onAddLibraryFilm);
  btnClose.removeEventListener('click', onBtnModalClose);

  // added by Oleh ------------------------------------------
  if (document.querySelector('.header__library')) {
    console.log('modal');
    const modalClose = true;
    categoryRender(modalClose);
  }
  // -----------------------------------------------------------
}
export function onBackDropModalClose(e) {
  if (e.target.className !== 'backdrop js-modal') {
    return;
  }
  removeListener();
  modalContainer.innerHTML = '';
}
export function onBtnModalClose(e) {
  removeListener();
  modalContainer.innerHTML = '';
}

export function onEscapeModalClose(e) {
  if (e.key !== 'Escape') {
    return;
  }
  removeListener();
  modalContainer.innerHTML = '';
}
