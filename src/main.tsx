import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./index.css"
import { DataContextProvider } from './context/DataContext.tsx'
import { CanvasContextProvider } from './context/CanvasContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataContextProvider>
      <CanvasContextProvider>
        <App />
      </CanvasContextProvider>
    </DataContextProvider>
  </StrictMode>,
)
