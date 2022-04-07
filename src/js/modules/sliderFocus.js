import refs from '../refs.js';

const { sliderFocusEl } = refs;

addEventListener('DOMContentLoaded', () => {
  sliderFocusEl.addEventListener('pointerdown', handlerSliderFocus);
  sliderFocusEl.addEventListener('pointerover', сhangeSlidesIntervalStop);
  addEventListener('unload', clearListener);
  сhangeSlidesIntervalStart();
});

const sliderFocusList = sliderFocusEl.firstElementChild.firstElementChild;
const sliderFocusItems = sliderFocusList.children;
const widthSlide = 100;
let index = 1;
let x1 = null;
let clientWidth = null;
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

const swipeXPercent = () => (swipeX / clientWidth) * 100;

const transitionSlide = transitionValue =>
  (sliderFocusList.style.transition = transitionValue);

const transformSlide = (swipeValue = 0) =>
  (sliderFocusList.style.transform = `translateX(${
    -(widthSlide * index) + swipeValue
  }%)`);

function handlerSliderFocus(event) {
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
  x1 = event.pageX;
  clientWidth = event.currentTarget.clientWidth;
  sliderFocusEl.addEventListener('pointermove', swiping);
  sliderFocusEl.addEventListener('pointerup', stopSwipe);
  sliderFocusEl.addEventListener('pointercancel', stopSwipe);
}

function swiping(event) {
  swipeX = event.pageX - x1;
  transitionSlide('none');
  transformSlide(swipeXPercent());
}

function stopSwipe() {
  if (swipeXPercent() >= 50) {
    prevSlide();
  } else if (swipeXPercent() <= -50) {
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
  index -= 1;
  transitionSlide('transform 250ms ease-in-out');
  transformSlide();

  if (index === 0) {
    index = sliderFocusItems.length - 2;
    sliderFocusList.addEventListener('transitionend', firstLastSlideSwitching);
  }
}

function nextSlide() {
  transitionSlide('transform 250ms ease-in-out');

  if (index < sliderFocusItems.length - 1) {
    index += 1;
    transformSlide();
  }

  if (index === sliderFocusItems.length - 1) {
    index = 1;
    sliderFocusList.addEventListener('transitionend', firstLastSlideSwitching);
  }
}

function firstLastSlideSwitching() {
  transitionSlide('none');
  transformSlide();
  sliderFocusList.removeEventListener('transitionend', firstLastSlideSwitching);
}

function clearListener() {
  clearInterval(intervalId);
  sliderFocusEl.removeEventListener('pointerdown', handlerSliderFocus);
  sliderFocusEl.removeEventListener('pointerover', сhangeSlidesIntervalStop);
}
