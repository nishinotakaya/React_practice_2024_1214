// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Board from './components/Board'
import BoardDetail from './components/BoardDetail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/boards" element={<Board />} />
        <Route path="/boards/:id" element={<BoardDetail />} />
      </Routes>
    </Router>
  )
}

export default App