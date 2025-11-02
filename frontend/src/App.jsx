import styles from './App.module.css';
import Home from './pages/Home/Home.jsx';
import Footer from './components/common/Footer/Footer.jsx';
import Header from './components/common/Header/Header.jsx';
import Collections from './pages/Collections/Collections.jsx';
import About from './pages/About/About.jsx';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routers/ProtectedRoute.jsx';
import AccountPage from './pages/Account/Account.jsx';
import { AuthProvider, useAuth } from './context/AuthContext/AuthContext.jsx';

function AppContent() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/collections" element={<Collections />} />

          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/account" element={<AccountPage user={user} />} />
            {/* Другие защищённые маршруты здесь */}
          </Route>

          {/* Можно добавить страницу 404 */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
