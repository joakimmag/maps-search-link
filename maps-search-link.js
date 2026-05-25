// ==UserScript==
// @name        Show Maps link
// @description Adds a Maps shortcut link to Google Search navigation
// @match       *://www.google.com/*
// ==/UserScript==

(function () {
    'use strict';

    // Change this to match the "All" tab label in your language
    // e.g. 'All' (English), 'Tous' (French), 'Todos' (Spanish), 'Alle' (German/Dutch)
    const ALL_TAB_LABEL = 'Alle';

    // Exit early if there's no search query
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    if (!searchQuery) return;

    // Guard against missing #main
    const main = document.querySelector('#main');
    if (!main) return;

    // Reusable helper: checks if a subtree contains an exact text node match
    function containsExactText(root, text) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            if (node.textContent.trim() === text) return true;
        }
        return false;
    }

    // Find the target list item — the one that:
    //   1. Has siblings with role="listitem" (i.e. it's inside a real list)
    //   2. Contains an exact text node matching ALL_TAB_LABEL
    const listItem = Array.from(main.querySelectorAll('[role="listitem"]'))
        .find(item => {
            const siblings = Array.from(item.parentElement.children);
            const hasListSiblings = siblings.filter(
                sib => sib.getAttribute('role') === 'listitem'
            ).length > 1;

            return hasListSiblings && containsExactText(item, ALL_TAB_LABEL);
        });

    if (!listItem) return;

    // Clone the list item and insert it after the original
    const copy = listItem.cloneNode(true);
    listItem.insertAdjacentElement('afterend', copy);

    // Remove the `selected` attribute from the clone so it doesn't appear active
    const selectedDescendant = copy.querySelector('[selected]');
    if (selectedDescendant) {
        selectedDescendant.removeAttribute('selected');
    }

    // Update the link href to point to Google Maps
    const link = copy.querySelector('a');
    if (link) {
        link.href = `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}`;
    }

    // Replace the exact ALL_TAB_LABEL text node with "Maps" using a TreeWalker
    const walker = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT);
    let textNode;
    while ((textNode = walker.nextNode())) {
        if (textNode.textContent.trim() === ALL_TAB_LABEL) {
            textNode.textContent = 'Maps';
            break;
        }
    }
})();
