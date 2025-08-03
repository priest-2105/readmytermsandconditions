// Content script for Terms Analyzer extension
console.log('Terms Analyzer extension loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzePage') {
    // Extract text from current page
    const pageText = document.body.innerText;
    sendResponse({ text: pageText });
  }
}); 