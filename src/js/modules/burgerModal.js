import refs from '../refs.js';

const { bodyEl, backdropBurgerModalEl, buttonBurgerEl, burgerModalEl } = refs;

addEventListener('DOMContentLoaded', () => {
  buttonBurgerEl.addEventListener('click', burgerModal);
  addEventListener('unload', clearListener);
});

export function burgerModal(event) {
  if (
    !event.target.classList.contains('c-backdrop') &&
    !event.target.classList.contains('c-button-burger') &&
    !event.target.classList.contains('c-button-search') &&
    event.target.nodeName !== 'A'
  ) {
    return;
  }

  bodyEl.classList.toggle('overflow-hidden');
  backdropBurgerModalEl.classList.toggle('c-backdrop--hidden');
  burgerModalEl.classList.toggle('c-burger-modal--hidden');
  buttonBurgerEl.classList.toggle('c-button-burger--active');

  if (!backdropBurgerModalEl.classList.contains('c-backdrop--hidden')) {
    backdropBurgerModalEl.addEventListener('click', burgerModal);
  } else {
    backdropBurgerModalEl.removeEventListener('click', burgerModal);
  }
}

function clearListener() {
  buttonBurgerEl.removeEventListener('click', burgerModal);
}
