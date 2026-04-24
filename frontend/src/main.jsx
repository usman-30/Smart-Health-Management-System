// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AppContextProvider from './context/AppContext'; // Import the context provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppContextProvider> {/* Wrap the App component with the context provider */}
      <App />
    </AppContextProvider>
  </StrictMode>,
);
