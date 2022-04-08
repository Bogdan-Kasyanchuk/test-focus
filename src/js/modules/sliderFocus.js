import refs from '../refs.js';

const { sliderFocusEl } = refs;

addEventListener('DOMContentLoaded', () => {
  sliderFocusEl.addEventListener('pointerdown', handlerSlider);
  sliderFocusEl.addEventListener('pointerover', сhangeSlidesIntervalStop);
  addEventListener('unload', clearListener);
  сhangeSlidesIntervalStart();
});

const sliderList = sliderFocusEl.firstElementChild.firstElementChild;
const sliderItems = sliderList.children;
const widthSlide = 100;
let indexSlide = 1;
let clientWidth = null;
let x = null;
let swipeX = null;
let intervalId = null;

function сhangeSlidesIntervalStart() {
  intervalId = setInterval(() => {
    nextSlide();
  }, 5000);

  sliderFocusEl.removeEventListener('pointerout', сhangeSlidesIntervalStart);
}

function сhangeSlidesIntervalStop() {
  clearInterval(intervalId);
  sliderFocusEl.addEventListener('pointerout', сhangeSlidesIntervalStart);
}

const transitionSlide = transitionValue =>
  (sliderList.style.transition = transitionValue);

const transformSlide = (swipeValue = 0) =>
  (sliderList.style.transform = `translateX(${
    -(widthSlide * indexSlide) + swipeValue
  }%)`);

const swipeXPercent = () => (swipeX / clientWidth) * 100;

function handlerSlider(event) {
  if (event.target.nodeName === 'BUTTON') {
    if (event.target.attributes[2].value === 'Previous') {
      prevSlide();
    } else {
      nextSlide();
    }
    return;
  }

  startSwipe(event);
}

function startSwipe(event) {
  sliderFocusEl.ondragstart = () => false;
  clientWidth = event.currentTarget.clientWidth;
  x = event.pageX;
  sliderFocusEl.addEventListener('pointermove', swiping);
  sliderFocusEl.addEventListener('pointerup', stopSwipe);
  sliderFocusEl.addEventListener('pointercancel', stopSwipe);
}

function swiping(event) {
  swipeX = event.pageX - x;
  transitionSlide('none');
  transformSlide(swipeXPercent());
}

function stopSwipe() {
  if (swipeXPercent() >= widthSlide / 2) {
    prevSlide();
  } else if (swipeXPercent() <= -widthSlide / 2) {
    nextSlide();
  } else {
    transitionSlide('transform 250ms ease-in-out');
    transformSlide();
  }

  swipeX = null;
  sliderFocusEl.removeEventListener('pointermove', swiping);
  sliderFocusEl.removeEventListener('pointerup', stopSwipe);
  sliderFocusEl.removeEventListener('pointercancel', stopSwipe);
}

function prevSlide() {
  indexSlide -= 1;
  transitionSlide('transform 250ms ease-in-out');
  transformSlide();

  if (indexSlide === 0) {
    indexSlide = sliderItems.length - 2;
    sliderList.addEventListener('transitionend', firstLastSlideSwitching);
  }
}

function nextSlide() {
  if (indexSlide < sliderItems.length - 1) {
    indexSlide += 1;
    transitionSlide('transform 250ms ease-in-out');
    transformSlide();
  }

  if (indexSlide === sliderItems.length - 1) {
    indexSlide = 1;
    sliderList.addEventListener('transitionend', firstLastSlideSwitching);
  }
}

function firstLastSlideSwitching() {
  transitionSlide('none');
  transformSlide();
  sliderList.removeEventListener('transitionend', firstLastSlideSwitching);
}

function clearListener() {
  clearInterval(intervalId);
  sliderFocusEl.removeEventListener('pointerdown', handlerSlider);
  sliderFocusEl.removeEventListener('pointerover', сhangeSlidesIntervalStop);
}
