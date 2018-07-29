import { storageUserId, fragmentPrefix } from './schedule'

const shareButton = document.querySelector('[data-share]')

// bindings
function bindClickEvents () {
  shareButton.addEventListener('click', share)
}

// actions
function share () {
  if (!navigator.share) return

  const localSelections = (window.localStorage) ? window.localStorage.getItem(storageUserId) || '' : ''
  const shareCode = window.btoa(localSelections)
  const sharePath = `https://arctangent.netlify.com/${fragmentPrefix}${shareCode}`

  navigator.share({
    title: 'ArcTanGent 2018',
    text: 'Check out my highlights at ArcTanGent 2018',
    url: sharePath
  })
}

function init () {
  bindClickEvents()
}

export default { init }