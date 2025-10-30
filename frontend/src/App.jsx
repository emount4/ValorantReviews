import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', color: 'white', backgroundColor: '#0f1923', minHeight: '100vh' }}>
      <h1>Valorant Skins Rating - Главная</h1>
      <p>Добро пожаловать на главную страницу!</p>
      <a href="/about" style={{ color: '#ff4655' }}>Перейти на страницу "О проекте"</a>
    </div>
  )
}

function About() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', color: 'white', backgroundColor: '#0f1923', minHeight: '100vh' }}>
      <h1>О проекте</h1>
      <p>Это страница "О проекте"</p>
      <a href="/" style={{ color: '#ff4655' }}>Вернуться на главную</a>
    </div>
  )
}

function NotFound() {
  return (
    <div style={{ padding: '20px', textAlign: 'center', color: 'white', backgroundColor: '#0f1923', minHeight: '100vh' }}>
      <h1>404 - Страница не найдена</h1>
      <p>Извините, запрашиваемая страница не существует.</p>
      <a href="/" style={{ color: '#ff4655' }}>Вернуться на главную</a>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App