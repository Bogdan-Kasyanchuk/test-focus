import refs from '../refs.js';

const { sliderFocusEl } = refs;

const sliderList = sliderFocusEl.firstElementChild.firstElementChild;
const sliderItems = sliderList.children;
const widthSlide = 100;
let indexSlide = 1;
let isSwipe = false;
let clientWidth = null;
let x = null;
let swipeX = null;
let intervalId = null;
let link = null;

export function сhangeSlidesIntervalStartFocus() {
  intervalId = setInterval(() => {
    nextSlide();
  }, 5000);

  sliderFocusEl.removeEventListener(
    'pointerout',
    сhangeSlidesIntervalStartFocus,
  );
}

export function сhangeSlidesIntervalStopFocus() {
  clearInterval(intervalId);
  sliderFocusEl.addEventListener('pointerout', handlerPointerOut);
}

function handlerPointerOut() {
  сhangeSlidesIntervalStartFocus();
  if (Math.abs(swipeX)) {
    stopSwipe();
  }
}

const transitionSlide = transitionValue =>
  (sliderList.style.transition = transitionValue);

const transformSlide = (swipeValue = 0) =>
  (sliderList.style.transform = `translateX(${
    -(widthSlide * indexSlide) + swipeValue
  }%)`);

const swipeXPercent = () => (swipeX / clientWidth) * 100;

export function handlerSliderFocus(event) {
  if (event.target.nodeName === 'BUTTON') {
    if (event.target.attributes[2].value === 'Previous') {
      prevSlide();
    } else {
      nextSlide();
    }
    return;
  }

  clientWidth = event.currentTarget.clientWidth;
  x = event.pageX;
  sliderFocusEl.ondragstart = () => false;
  sliderFocusEl.addEventListener('pointermove', swiping);
  sliderFocusEl.addEventListener('pointerup', stopSwipe);
}

function swiping(event) {
  swipeX = event.pageX - x;
  transitionSlide('none');
  transformSlide(swipeXPercent());

  if (Math.abs(swipeX) > 1 && !isSwipe) {
    if (event.target.nodeName === 'A') {
      link = event.target;
    }
    link.addEventListener('click', preventDefaultLink, {
      once: true,
    });
    isSwipe = true;
  }
}

function preventDefaultLink(event) {
  event.preventDefault();
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
  isSwipe = false;
  sliderFocusEl.removeEventListener('pointermove', swiping);
  sliderFocusEl.removeEventListener('pointerup', stopSwipe);
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
