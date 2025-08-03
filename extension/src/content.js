// Content script for Terms Analyzer extension
console.log('Terms Analyzer extension loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzePage') {
    // Legacy method - extract text from current page
    const pageText = document.body.innerText;
    sendResponse({ text: pageText });
  }
  
  if (request.action === 'extractPageContent') {
    // Enhanced method - extract and clean page content
    try {
      // Get the full body text
      let pageText = document.body.innerText;
      
      // Remove common noise elements
      const noiseSelectors = [
        'script', 'style', 'noscript', 'iframe', 'embed', 'object',
        'nav', 'header', 'footer', 'aside', 'menu', 'menuitem'
      ];
      
      // Create a temporary div to clean the content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = document.body.innerHTML;
      
      // Remove noise elements
      noiseSelectors.forEach(selector => {
        const elements = tempDiv.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });
      
      // Get cleaned text
      pageText = tempDiv.innerText;
      
      // Basic cleaning
      pageText = pageText
        .replace(/\s+/g, ' ') // Compress multiple spaces
        .replace(/\t+/g, ' ') // Replace tabs with spaces
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .trim();
      
      // Limit length to prevent overwhelming the API
      if (pageText.length > 20000) {
        pageText = pageText.substring(0, 20000) + '...';
      }
      
      sendResponse({ 
        text: pageText,
        length: pageText.length,
        url: window.location.href,
        title: document.title
      });
    } catch (error) {
      console.error('Error extracting page content:', error);
      // Fallback to simple extraction
      const fallbackText = document.body.innerText.substring(0, 20000);
      sendResponse({ 
        text: fallbackText,
        length: fallbackText.length,
        url: window.location.href,
        title: document.title,
        error: 'Used fallback extraction method'
      });
    }
  }
}); 