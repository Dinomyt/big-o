// src/App.jsx
import { useState } from 'react'
import BigOTeacher from './big-o-study.jsx'
import InterviewPrep from './interview-practice.jsx'

export default function App() {
  const [view, setView] = useState('bigo')
  
  if (view === 'interview') return <InterviewPrep onNavigate={() => setView('bigo')} />
  return <BigOTeacher onNavigate={() => setView('interview')} />
}