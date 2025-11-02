import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// DEBUG: Override localStorage methods to track who's removing authToken
const originalRemoveItem = localStorage.removeItem.bind(localStorage);
localStorage.removeItem = function(key: string) {
  if (key === 'authToken') {
    console.error('🚨🚨🚨 SOMEONE IS REMOVING authToken!');
    console.trace('🚨 Stack trace:');
  }
  return originalRemoveItem(key);
};

const originalClear = localStorage.clear.bind(localStorage);
localStorage.clear = function() {
  console.error('🚨🚨🚨 SOMEONE IS CLEARING localStorage!');
  console.trace('🚨 Stack trace:');
  return originalClear();
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
