import './index.css';
import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { Spinner } from 'react-bootstrap';
const App = lazy(() => import('./App.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={
      <div className="spinner-container">
        <Spinner animation="border" />
      </div>}>
      <App />
    </Suspense>
  </StrictMode>,
)
