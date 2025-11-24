import React from 'react'

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#1a242f',
      padding: '30px 0',
      textAlign: 'center',
      borderTop: '1px solid #2a3a4a',
      marginTop: '50px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ color: '#b0b0b0', fontSize: '14px' }}>
          © 2025 Valorant Reviews. Данный сайт не связан с Riot Games.
        </div>
      </div>
    </footer>
  )
}

export default Footer