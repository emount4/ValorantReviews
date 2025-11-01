import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';
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
      <header className={styles.header}>
        <div className={styles.conteiner}>
          <div className={styles.headerConten}>
            <div className={styles.logo}>
              <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                Valorant Reviews
              </NavLink>
            </div>
            <nav className={styles.nav}>
              <ul>
                <li>
                  <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                    Главная
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/collections" className={({ isActive }) => isActive ? 'active' : ''}>
                    Коллекции
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
                    О проекте
                  </NavLink>
                </li>

              </ul>
            </nav>
            <div className={styles.authButtons}>
              <button className={styles.loginBtn} onClick={this.openAuthModal}>Войти</button>
              <button className={styles.registerBtn} onClick={this.openRegistrationModal}>Регистрация</button>
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
