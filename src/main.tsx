import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelectorAll('div[class="data-embed"]');
  // Check if the script element exists
  el.forEach(e => {
    const rootEmbed = ReactDOM.createRoot(e);
    rootEmbed.render(
      <React.StrictMode>
        <App typology={e.getAttribute('data-typology')} />
      </React.StrictMode>,
    );
  });
});
