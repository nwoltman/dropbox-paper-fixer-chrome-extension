/* globals chrome */
'use strict';

// Colourize the icon when on paper.dropbox.com
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: 'paper.dropbox.com',
            },
          }),
        ],
        actions: [
          new chrome.declarativeContent.ShowPageAction(),
        ],
      },
    ]);
  });
});
