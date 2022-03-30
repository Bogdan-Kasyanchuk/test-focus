import refs from '../refs.js';
import { burgerModal } from './burgerModal.js';

const { backdropFormSearchEl, formSearchEl, buttonSearchEl, burgerModalEl } =
  refs;

buttonSearchEl.addEventListener('click', formSearch);

function formSearch(event) {
  if (
    !event.target.classList.contains('c-backdrop') &&
    !event.target.classList.contains('c-button-search')
  ) {
    return;
  }

  if (!burgerModalEl.classList.contains('c-burger-modal--hidden')) {
    burgerModal(event);
  }

  backdropFormSearchEl.classList.toggle('c-backdrop--hidden');

  if (!backdropFormSearchEl.classList.contains('c-backdrop--hidden')) {
    formSearchEl.addEventListener('submit', form);
    backdropFormSearchEl.addEventListener('click', formSearch);
  } else {
    formSearchEl.removeEventListener('submit', form);
    backdropFormSearchEl.removeEventListener('click', formSearch);
  }
}

function form(event) {
  event.preventDefault();
  console.log(event.target[0].value);
}
