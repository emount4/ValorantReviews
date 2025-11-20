import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import AuthModal from "../Modals/AuthModal/AuthModal";
import RegistrationModal from "../Modals/AuthModal/RegistrationModal";
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] =
    React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
    closeMobileMenu();
  };

  const openRegistrationModal = () => {
    setIsRegistrationModalOpen(true);
    closeMobileMenu();
  };

  const closeAllModals = () => {
    setIsAuthModalOpen(false);
    setIsRegistrationModalOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  // Функция для получения инициалов пользователя
  const getUserInitials = () => {
    if (!user?.username && !user?.email) return "U";

    const name = user.username || user.email.split("@")[0];
    return name.charAt(0).toUpperCase();
  };

  // Функция для получения цвета аватарки на основе имени пользователя
  const getAvatarColor = () => {
    const name = user?.username || user?.email || "user";
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <header className={styles.header}>
      <div className={styles.conteiner}>
        <div className={styles.headerConten}>
          <div className={styles.logo}>
            <NavLink to="/" onClick={closeMobileMenu}>
              Valorant Reviews
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            <ul>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                >
                  Главная
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/collections"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                >
                  Коллекции
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                >
                  О проекте
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className={styles.authButtons}>
            {isAuthenticated ? (
              <div className={styles.userMenu}>
                <span className={styles.userWelcome}>
                  Привет, {user?.username || user?.email?.split("@")[0]}
                </span>
                <div className={styles.profileDropdown}>
                  <NavLink
                    to="/account"
                    className={styles.profileButton}
                    title="Профиль"
                  >
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt="Profile"
                        className={styles.profileImage}
                      />
                    ) : (
                      <div
                        className={styles.profilePlaceholder}
                        style={{ backgroundColor: getAvatarColor() }}
                      >
                        {getUserInitials()}
                      </div>
                    )}
                  </NavLink>
                  <div className={styles.dropdownMenu}>
                    <NavLink
                      to="/account"
                      className={styles.dropdownItem}
                      onClick={closeMobileMenu}
                    >
                      📱 Профиль
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className={styles.dropdownItem}
                    >
                      🚪 Выйти
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <button className={styles.loginBtn} onClick={openAuthModal}>
                  Войти
                </button>
                <button
                  className={styles.registerBtn}
                  onClick={openRegistrationModal}
                >
                  Регистрация
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button and Single Auth Button */}
          <div className={styles.mobileHeaderControls}>
            {isAuthenticated ? (
              <div className={styles.mobileUserInfo}>
                <span className={styles.mobileUserName}>
                  {user?.username || user?.email?.split("@")[0]}
                </span>
              </div>
            ) : (
              <button className={styles.mobileAuthBtn} onClick={openAuthModal}>
                Войти
              </button>
            )}
            <button
              className={`${styles.burgerButton} ${
                isMobileMenuOpen ? styles.active : ""
              }`}
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            >
              <span className={styles.burgerLine}></span>
              <span className={styles.burgerLine}></span>
              <span className={styles.burgerLine}></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`${styles.mobileMenu} ${
            isMobileMenuOpen ? styles.mobileMenuOpen : ""
          }`}
        >
          <nav className={styles.mobileNav}>
            <ul>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                  onClick={closeMobileMenu}
                >
                  Главная
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/collections"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                  onClick={closeMobileMenu}
                >
                  Коллекции
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                  onClick={closeMobileMenu}
                >
                  О проекте
                </NavLink>
              </li>
              {isAuthenticated && (
                <>
                  <li>
                    <NavLink
                      to="/account"
                      className={({ isActive }) =>
                        isActive ? styles.active : ""
                      }
                      onClick={closeMobileMenu}
                    >
                      Профиль
                    </NavLink>
                  </li>
                  <li className={styles.mobileLogoutItem}>
                    <button
                      className={styles.mobileLogoutBtn}
                      onClick={handleLogout}
                    >
                      Выйти
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Mobile Registration Link */}
          {!isAuthenticated && (
            <div className={styles.mobileRegistration}>
              <p>Нет аккаунта?</p>
              <button
                className={styles.mobileRegisterLink}
                onClick={openRegistrationModal}
              >
                Зарегистрироваться
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className={styles.overlay} onClick={closeMobileMenu}></div>
        )}
      </div>

      {/* Модалки */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAllModals}
        onSwitchToRegister={() => {
          closeAllModals();
          openRegistrationModal();
        }}
      />
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={closeAllModals}
        onSwitchToLogin={() => {
          closeAllModals();
          openAuthModal();
        }}
      />
    </header>
  );
};

export default Header;
