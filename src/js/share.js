import Frdialogmodal from 'fr-dialogmodal';
import ClipboardJS from 'clipboard';
import { storageUserId, fragmentPrefix } from './schedule'

const siteUrl = 'https://arctangent.netlify.com'
const isNativeShare = navigator.share !== undefined

const shareButton = document.querySelector('[data-share]')
const shareModal = !isNativeShare ?
  Frdialogmodal({
    openSelector: '[data-share]',
    readyClass: 'modal--is-ready',
    activeClass: 'modal--is-active'
  }) : null
const shareLinkAttr = 'data-share-link'
const shareLinks = document.querySelectorAll(`[${shareLinkAttr}]`)

const copyButton = document.querySelector('[data-copy-link]')
const copyHiddenInput = document.getElementById('copy-link')

// bindings
function bindClickEvents () {
  shareButton.addEventListener('click', share)
  if (isNativeShare) return

  const clipboard = new ClipboardJS(copyButton)
  clipboard.on('success', e => {
    copiedToClipboard(e.trigger)
  })
  clipboard.on('error', e => {
    console.error('Could not copy to clipboard');
  });
}

// actions
function share () {
  const localSelections = window.localStorage ? window.localStorage.getItem(storageUserId) || '' : ''
  const shareCode = window.btoa(localSelections)
  const sharePath = `${siteUrl}/${fragmentPrefix}${shareCode}`

  if (navigator.share !== undefined) {
    shareNative(sharePath)
  } else {
    shareCustom(sharePath)
  }
}

function shareNative (sharePath) {
  navigator.share({
    title: 'ArcTanGent 2018',
    text: '',
    url: sharePath
  })
}

function shareCustom (sharePath) {
  // update copy URL
  copyHiddenInput.setAttribute('value', sharePath)

  // bind share link attributes
  shareLinks.forEach(shareLink => {
    const type = shareLink.getAttribute(shareLinkAttr)
    const encodedMsg = encodeURIComponent('Check out my ArcTanGent highlights: ')
    const encodedUrl = encodeURIComponent(sharePath)

    switch (type) {
      case 'whatsapp': {
        shareLink.setAttribute('href', `https://wa.me/?text=${encodedMsg}${encodedUrl}`)
        break;
      }
      case 'facebook': {
        shareLink.setAttribute('href', `https://www.facebook.com/dialog/share?app_id=2128585337353055&href=${encodedUrl}`)
        break;
      }
      case 'messenger': {
        shareLink.setAttribute('href', `https://www.facebook.com/dialog/send?app_id=2128585337353055&link=${encodedUrl}&redirect_uri=${encodeURIComponent(siteUrl)}`)
        break;
      }
      case 'twitter': {
        shareLink.setAttribute('href', `https://twitter.com/intent/tweet?text=${encodedMsg}&url=${encodedUrl}`)
        break;
      }
      default:
        console.error(`Could not add link for share type: ${ type }`)
    }
  })
}

function copiedToClipboard (triggerEl) {
  const copiedTextAttr = 'data-copied-text'
  const copiedTextEl = triggerEl.querySelector(`[${copiedTextAttr}]`)
  const originalText = copiedTextEl.innerHTML
  copiedTextEl.innerHTML = copiedTextEl.getAttribute(copiedTextAttr)

  const copiedTimeout = setTimeout(() => {
    copiedTextEl.innerHTML = originalText
    clearTimeout(copiedTimeout)
  }, 1200)
}

function init () {
  bindClickEvents()
}

export default { init }