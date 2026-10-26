// script.js - fetch items from backend and render them

async function loadItems() {
  try {
    const response = await fetch('http://localhost:3000/api/items');
    if (!response.ok) throw new Error('Network response was not ok');
    const items = await response.json();
    const container = document.getElementById('items');
    container.innerHTML = '';
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'item-card';
      // Assuming item has fields: title, description, price, imageUrl
      const title = document.createElement('h3');
      title.textContent = item.title || 'Untitled';
      const desc = document.createElement('p');
      desc.textContent = item.description || '';
      const price = document.createElement('p');
      price.textContent = item.price ? `Price: $${item.price}` : '';
      const img = document.createElement('img');
      img.src = item.imageUrl || '';
      img.alt = item.title || 'Item image';
      img.style.maxWidth = '100%';
      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(price);
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load items:', err);
    const container = document.getElementById('items');
    container.innerHTML = '<p style="color:red;">Failed to load items.</p>';
  }
}

// Load items on page load
window.addEventListener('DOMContentLoaded', loadItems);
