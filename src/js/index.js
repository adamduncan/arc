import Flickity from 'flickity'
import schedule from './schedule'
import share from './share'

const rAFSupported = window.requestAnimationFrame
let lastKnownScrollPos = 0
let ticking = false

const timetableEl = document.getElementById('timetable')
const timetableTop = timetableEl ? timetableEl.offsetTop : 0
const tabsEl = document.querySelector('.tabs__tablist')
const tabsHeight = tabsEl ? tabsEl.offsetHeight : 0
const timetableHeaders = document.querySelectorAll('[data-timetable-header]')

// CAROUSEL
const positionStickyHeader = scrollPos => {
  if (scrollPos > timetableTop) {
    const offsetDistance = scrollPos - timetableTop
    timetableHeaders.forEach(timetableHeader => timetableHeader.style.transform = `translateY(${offsetDistance}px)`)
  } else {
    timetableHeaders.forEach(timetableHeader => timetableHeader.style.transform = 'none')
  }
}

const scrollToTimetable = () => {
  if (!timetableEl || timetableTop === window.scrollY) return
  window.scroll({ 
    top: timetableTop + 1, // subpixel fix
    left: 0,
    behavior: 'smooth'
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
    if (flkty.selectedIndex === i) return
    flkty.select(i)
  })
})

flkty.on('select', function() {
  const previousSelectedButton = document.querySelector('[data-carousel-button].is-selected')
  const selectedButton = slideButtons[flkty.selectedIndex]
  if (previousSelectedButton) previousSelectedButton.classList.remove('is-selected')
  if (selectedButton) selectedButton.classList.add('is-selected')
})

flkty.on('change', function() {
  if (!rAFSupported) return
  window.requestAnimationFrame(scrollToTimetable)
})

if (rAFSupported) {
  window.addEventListener('scroll', () => {
    lastKnownScrollPos = window.scrollY
    if (!ticking) {
      window.requestAnimationFrame(() => {
        positionStickyHeader(lastKnownScrollPos);
        ticking = false
      });
      ticking = true
    }
  })
}


// SCHEDULE
schedule.init()

// SHARE
share.init()