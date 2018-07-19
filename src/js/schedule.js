let storageId = 'clapp-me'
const storageUserId = 'clapp-me'
const storageSharedId = 'clapp-u'
const fragmentPrefix = '#u/?'
const itemAttr = 'data-item'
const itemToggleEls = document.querySelectorAll('[data-item-toggle]')
const selectedClass = '-is-selected'

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

// actions
function decodeSelection (selection) {
  return window.atob(selection)
}
function encodeSelection (selection) {
  return window.btoa(selection)
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
}

function init () {
  setStorageLocation()
  bindClickEvents()
  restoreSelection()
}

export default { init }