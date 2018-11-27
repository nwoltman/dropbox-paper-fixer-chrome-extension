/* eslint-env browser */
'use strict';

/* ======== Main ======== */

const folderURLPrefix = '/folder/show/';

// Group items when clicking the "Back" button
window.addEventListener('popstate', groupItemsWhenIdle);

// Group items after moving to a new folder
document.addEventListener('click', (e) => {
  if (e.target.matches(`a[href^="${folderURLPrefix}"], a[href^="${folderURLPrefix}"] *`)) {
    groupItemsWhenIdle();
  }
});

if (location.pathname.startsWith(folderURLPrefix)) {
  window.addEventListener('load', groupItemsWhenIdle);
}


/* ====== Functions ====== */

function groupItemsWhenIdle() {
  window.requestIdleCallback(() => waitForFolders(Date.now()));
}

const WAIT_LIMIT = 1500; // 1.5 seconds

function waitForFolders(startTime) {
  window.requestAnimationFrame(() => {
    if (hasFolders()) {
      groupFolderItems();
    } else if (Date.now() - startTime < WAIT_LIMIT) {
      waitForFolders(startTime);
    }
  });
}

function hasFolders() {
  return document.querySelector('.hp-doc-and-folder-list > .hp-list-item-folder') !== null;
}

function groupFolderItems() {
  if (!shouldGroupFolderItems()) {
    return;
  }

  const itemsContainer = document.querySelector('.hp-doc-and-folder-list');
  const files = itemsContainer.getElementsByClassName('hp-list-item-doc');
  const filesFragment = document.createDocumentFragment();

  while (files.length > 0) {
    filesFragment.appendChild(files[0]);
  }

  itemsContainer.appendChild(filesFragment);
}

function shouldGroupFolderItems() {
  if (!location.pathname.startsWith(folderURLPrefix)) {
    return false; // Not in a folder that can have its items grouped
  }

  const folderTabs = document.querySelector('.folder-tabs');

  if (folderTabs === null) {
    return false;
  }

  if (folderTabs.firstElementChild.classList.contains('hp-tab-selected')) {
    return true; // The "Alphabetical" tab is selected, so group the items
  }

  return false;
}
