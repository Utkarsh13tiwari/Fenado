import React from 'react';
import ReactDOM from 'react-dom/client';  // Use 'react-dom/client' in React 18
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create a root for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component using root.render()
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Measure performance if needed
reportWebVitals();
