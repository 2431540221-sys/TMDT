// script.js – optional UI interactions (search placeholder)

// Currently the search button just logs the query.
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.search-btn');
  const input = document.querySelector('.search-input');
  if (btn && input) {
    btn.addEventListener('click', () => {
      console.log('Search query:', input.value);
      // Future: send request to backend API to fetch products
    });
  }
});
