import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import AuthModal from '../Modals/AuthModal/AuthModal';
import RegistrationModal from '../Modals/AuthModal/RegistrationModal';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthModalOpen: false,
      isRegistrationModalOpen: false,
    };
  }

  openAuthModal = () => {
    this.setState({ isAuthModalOpen: true });
  };

  openRegistrationModal = () => {
    this.setState({ isRegistrationModalOpen: true });
  };

  closeAllModals = () => {
    this.setState({ 
      isAuthModalOpen: false, 
      isRegistrationModalOpen: false 
    });
  };

  render() {
    return (
      <header className="header">
        <div className="container">
          <div className="headerContent">
            <div className="logo">
              <Link to="/">Valorant Reviews</Link>
            </div>
            <nav className="nav">
              <ul>
                <li><Link to="/">Главная</Link></li>
                <li><Link to="/about">О проекте</Link></li>
              </ul>
            </nav>
            <div className="authButtons">
              <button className="loginBtn" onClick={this.openAuthModal}>Войти</button>
              <button className="registerBtn" onClick={this.openRegistrationModal}>Регистрация</button>
            </div>
          </div>
        </div>

        {/* Модалки */}
        <AuthModal 
          isOpen={this.state.isAuthModalOpen} 
          onClose={this.closeAllModals} 
        />
        <RegistrationModal 
          isOpen={this.state.isRegistrationModalOpen} 
          onClose={this.closeAllModals} 
        />
      </header>
    );
  }
}

export default Header;