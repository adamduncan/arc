import Frtabs from './tabs'
import schedule from './schedule'
import share from './share'

const timetableEl = document.getElementById('timetable')
const timetableTop = timetableEl ? timetableEl.offsetTop : 0
const rAFSupported = window.requestAnimationFrame

// TABS
const scrollToTimetable = () => {
  if (!timetableEl || timetableTop === window.scrollY) return
  window.scroll({ 
    top: timetableTop,
    left: 0,
    behavior: 'smooth'
  });
}

const eventTabs = Frtabs({
  onShowTab: () => {
    if (!rAFSupported) return
    window.requestAnimationFrame(scrollToTimetable)
  }
})

// SCHEDULE
schedule.init()

// SHARE
share.init()