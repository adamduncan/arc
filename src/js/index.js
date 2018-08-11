import Flickity from 'flickity'
import schedule from './schedule'
import share from './share'

const timetableEl = document.getElementById('timetable')
const timetableTop = timetableEl ? timetableEl.offsetTop : 0
const rAFSupported = window.requestAnimationFrame

// CAROUSEL

const scrollToTimetable = () => {
  if (!timetableEl || timetableTop === window.scrollY) return
  window.scroll({ 
    top: timetableTop,
    left: 0
    // behavior: 'smooth'
  });
}

const flkty = new Flickity('[data-carousel]', {
  adaptiveHeight: true,
  prevNextButtons: false,
  pageDots: false,
  selectedAttraction: 0.2,
  friction: 0.8
})

const slideButtons = document.querySelectorAll('[data-carousel-button]');
slideButtons.forEach((slideButton, i) => {
  slideButton.addEventListener('click', event => {
    event.preventDefault()
    flkty.select(i)
  })
})

flkty.on('select', function() {
  const previousSelectedButton = document.querySelector('[data-carousel-button].is-selected')
  const selectedButton = slideButtons[flkty.selectedIndex]
  if (previousSelectedButton) previousSelectedButton.classList.remove('is-selected')
  if (selectedButton) selectedButton.classList.add('is-selected')
  if (!rAFSupported) return
  window.requestAnimationFrame(scrollToTimetable)
})

// SCHEDULE
schedule.init()

// SHARE
share.init()