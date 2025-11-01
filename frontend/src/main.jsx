import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'; 
import Header from './components/common/Header/Header.jsx'
import Footer from './components/common/Footer/Footer.jsx'
import Home from './pages/Home/Home.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Home/>
      <Footer/>
    </BrowserRouter>
  </StrictMode>,
)
