export const fragmentPrefix = '#u/?'
export const storageUserId = 'clapp-me'
let storageId = 'clapp-me'
const storageSharedId = 'clapp-u'

const itemAttr = 'data-item'
const itemToggleEls = document.querySelectorAll('[data-item-toggle]')
const selectedClass = '-is-selected'

const carouselEl = document.querySelector('[data-carousel]')
const carouselInactiveClass = 'carousel-container--inactive'

const dialogEl = document.querySelector('[data-dialog]')
const dialogVisibleClass= 'dialog--visible'
const dialogResetEl = dialogEl.querySelector('[data-dialog-reset]')
const dialogCopyEl = dialogEl.querySelector('[data-dialog-copy]')


// helpers
function getItemElementById (id) {
  return document.querySelector(`[${ itemAttr }="${ id }"]`)
}

function arrayFromSelectedString (selectedString = '') {
  return selectedString.split(',')
}

// localStorage helpers
function setStorageLocation () {
  if (!window.location.hash) return
  storageId = window.location.hash.indexOf(fragmentPrefix) === -1 ? storageUserId : storageSharedId
}

function mergeStoredItems (oldItems = '', newItem) {
  if (!newItem) return
  if (!oldItems) return newItem
  const itemsArray = arrayFromSelectedString(oldItems)
  itemsArray.push(newItem)
  return [ ...new Set(itemsArray) ].join()
}

function removeFromStoredItems (items, id) {
  const itemsArray = arrayFromSelectedString(items)
  return itemsArray.filter(item => item !== id).join()
}

// add/remove items
function addItem (id) {
  const itemEl = getItemElementById(id)
  const selectedItems = window.localStorage.getItem(storageId)
  const updatedItems = mergeStoredItems(selectedItems, id)

  if (itemEl) itemEl.classList.add(selectedClass)
  window.localStorage.setItem(storageId, updatedItems)
}

function removeItem (id) {
  const itemEl = getItemElementById(id)
  const selectedItems = window.localStorage.getItem(storageId)
  const updatedItems = removeFromStoredItems(selectedItems, id)

  if (itemEl) itemEl.classList.remove(selectedClass)
  window.localStorage.setItem(storageId, updatedItems)
}

function toggleItem (id) {
  const itemEl = getItemElementById(id)
  if (!itemEl.classList.contains(selectedClass)) {
    addItem(id)
  } else {
    removeItem(id)
  }
}

// bindings
function bindClickEvents () {
  if (!window.localStorage) return
  itemToggleEls.forEach(itemToggle => {
    itemToggle.addEventListener('click', () => {
      toggleItem(itemToggle.getAttribute('data-item-toggle'))
    })
  })
}

function bindDialogEvents () {
  dialogResetEl.addEventListener('click', returnToHome)
  dialogCopyEl.addEventListener('click', () => {
    const currentSelection = window.localStorage.getItem(storageSharedId)
    window.localStorage.setItem(storageUserId, currentSelection)
    returnToHome()
  })
}

// actions
function decodeSelection (selection) {
  return window.atob(selection)
}
function encodeSelection (selection) {
  return window.btoa(selection)
}

function returnToHome () {
  const currentUrl = window.location.origin
  window.location.href = currentUrl
}

function makeTimetableInactive () {
  carouselEl.classList.add(carouselInactiveClass)
}

function showDialog () {
  // update button text if user already has selection
  if (window.localStorage.getItem(storageUserId)) dialogResetEl.innerHTML = dialogResetEl.getAttribute('data-dialog-underway')
  dialogEl.classList.add(dialogVisibleClass)
}

function restoreSelection () {
  const hash = window.location.hash || ''
  const selectionFromUrl = hash.indexOf(fragmentPrefix) !== -1
  const selectedItems = selectionFromUrl ? decodeSelection(hash.substring(fragmentPrefix.length)) : window.localStorage.getItem(storageId)
  
  if (!selectedItems) return
  const selectedArray = arrayFromSelectedString(selectedItems)
  selectedArray.forEach(selectedId => {
    addItem(selectedId)
  })

  if (!selectionFromUrl) return
  showDialog()
  makeTimetableInactive()
  bindDialogEvents()
}

function init () {
  setStorageLocation()
  bindClickEvents()
  restoreSelection()
}

export default { init }