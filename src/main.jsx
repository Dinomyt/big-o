import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BigOTeacher from './big-o-study.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BigOTeacher />
  </StrictMode>,
)
