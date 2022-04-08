import refs from '../refs.js';

const { sliderRatingsEl } = refs;

addEventListener('DOMContentLoaded', () => {
  sliderRatingsEl.addEventListener('pointerdown', handlerSlider);
  addEventListener('resize', update);
  addEventListener('unload', clearListener);
  setButtonState();
  progressDrag();
});

function update() {
  progressDrag();
  setButtonState();
}

const sliderList = sliderRatingsEl.firstElementChild.firstElementChild;
const sliderItems = sliderList.children;
let clientWidth = sliderRatingsEl.clientWidth;
let indexSlide = 0;
let x = null;
let swipeX = null;

const widthSlide = () => sliderItems[0].clientWidth + 24;

const numberVisibleSlides = () => Math.round(clientWidth / widthSlide());

function setButtonState() {
  if (indexSlide <= 0) {
    sliderRatingsEl.children[1].setAttribute('disabled', 'disabled');
  } else if (indexSlide >= sliderItems.length - numberVisibleSlides()) {
    sliderRatingsEl.children[2].setAttribute('disabled', 'disabled');
  } else {
    sliderRatingsEl.children[1].removeAttribute('disabled');
    sliderRatingsEl.children[2].removeAttribute('disabled');
  }
}

function progressDrag() {
  clientWidth = sliderRatingsEl.clientWidth;
  sliderRatingsEl.lastElementChild.lastElementChild.style.width = `${
    ((numberVisibleSlides() + indexSlide) / sliderItems.length) * 100
  }%`;
}

const transitionSlide = transitionValue =>
  (sliderList.style.transition = transitionValue);

const transformSlide = (swipeValue = 0) =>
  (sliderList.style.transform = `translateX(${
    -(widthSlide() * indexSlide) + swipeValue
  }px)`);

function handlerSlider(event) {
  clientWidth = event.currentTarget.clientWidth;

  if (event.target.nodeName === 'BUTTON') {
    if (event.target.attributes[2].value === 'Previous') {
      prevSlide(1);
    } else {
      nextSlide(1);
    }
    return;
  }

  startSwipe(event);
}

function startSwipe(event) {
  sliderRatingsEl.ondragstart = () => false;
  x = event.pageX;
  sliderRatingsEl.addEventListener('pointermove', swiping);
  sliderRatingsEl.addEventListener('pointerup', stopSwipe);
  sliderRatingsEl.addEventListener('pointerout', stopSwipe);
}

function swiping(event) {
  swipeX = event.pageX - x;
  transitionSlide('none');
  transformSlide(swipeX);

  if (
    parseInt(sliderList.style.transform.slice(11)) >= 100 ||
    Math.abs(parseInt(sliderList.style.transform.slice(11))) >=
      widthSlide() * (sliderItems.length - numberVisibleSlides()) + 100
  ) {
    stopSwipe();
  }
}

function stopSwipe() {
  const number = Math.round(Math.abs(swipeX) / widthSlide());

  if (swipeX >= widthSlide() / 2) {
    prevSlide(number);
  } else if (swipeX <= -widthSlide() / 2) {
    nextSlide(number);
  } else {
    transitionSlide('transform 250ms ease-in-out');
    transformSlide();
  }

  swipeX = null;
  sliderRatingsEl.removeEventListener('pointermove', swiping);
  sliderRatingsEl.removeEventListener('pointerup', stopSwipe);
  sliderRatingsEl.removeEventListener('pointerout', stopSwipe);
}

function prevSlide(index) {
  if (indexSlide <= 0) {
    return;
  }

  indexSlide -= index;
  transitionSlide('transform 250ms ease-in-out');
  transformSlide();
  setButtonState();
  progressDrag();
}

function nextSlide(index) {
  if (indexSlide < sliderItems.length - numberVisibleSlides()) {
    indexSlide += index;
    transitionSlide('transform 250ms ease-in-out');
    transformSlide();
  }

  setButtonState();
  progressDrag();
}

function clearListener() {
  clearInterval(intervalId);
  sliderRatingsEl.removeEventListener('pointerdown', handlerSlider);
  removeEventListener('resize', progressDrag);
}
