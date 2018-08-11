import Flickity from 'flickity'
import schedule from './schedule'
import share from './share'

const rAFSupported = window.requestAnimationFrame
let lastKnownScrollPos = 0
let ticking = false

const timetableEl = document.getElementById('timetable')
const timetableTop = timetableEl ? timetableEl.offsetTop : 0
let timetableHeaders

// CAROUSEL
const positionStickyHeader = scrollPos => {
  const headerCount = timetableHeaders.length
  if (scrollPos > timetableTop) {
    const offsetDistance = scrollPos - timetableTop
    for (let i = 0; i < headerCount; i++) {
      timetableHeaders[i].style.transform = `translate3d(0, ${offsetDistance}px, 0)`
    }
  } else {
    for (let j = 0; j < headerCount; j++) {
      timetableHeaders[j].removeAttribute('style')
    }
  }
}

const scrollToTimetable = () => {
  if (!timetableEl || timetableTop === window.scrollY) return
  window.scroll({ 
    top: timetableTop + 1, // fix subpixel
    left: 0
    // behavior: 'smooth'
  });
}

const flkty = new Flickity('[data-carousel]', {
  adaptiveHeight: true,
  prevNextButtons: false,
  pageDots: false,
  selectedAttraction: 0.2,
  friction: 0.8,
  on: {
    ready: () =>{
      timetableHeaders = document.querySelectorAll('.is-selected [data-timetable-header]')
    }
  }
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
  timetableHeaders = document.querySelectorAll('.is-selected [data-timetable-header]')
  window.requestAnimationFrame(scrollToTimetable)
})

if (rAFSupported) {
  window.addEventListener('scroll', (e) => {
    lastKnownScrollPos = window.scrollY
    if (!ticking) {
      window.requestAnimationFrame(() => {
        positionStickyHeader(lastKnownScrollPos)
        // positionStickyHeader(window.scrollY)
        ticking = false
      })
      ticking = true
    }
  })
}


// SCHEDULE
schedule.init()

// SHARE
share.init()