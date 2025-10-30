import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation()

  return (
    <header style={{
      backgroundColor: '#1a242f',
      padding: '20px 0',
      borderBottom: '2px solid #ff4655',
      marginBottom: '40px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            <Link to="/" style={{ color: '#ff4655', textDecoration: 'none' }}>
              Valorant Skins Rating
            </Link>
          </div>
          <nav>
            <ul style={{ display: 'flex', listStyle: 'none', gap: '20px' }}>
              <li>
                <Link
                  to="/"
                  style={{
                    color: location.pathname === '/' ? '#ff4655' : '#ece8e1',
                    textDecoration: 'none'
                  }}
                >
                  Главная
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  style={{
                    color: location.pathname === '/about' ? '#ff4655' : '#ece8e1',
                    textDecoration: 'none'
                  }}
                >
                  О проекте
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header