import styles from './App.module.css';
import Home from './pages/Home/Home.jsx';
import Footer from './components/common/Footer/Footer.jsx';
import Header from './components/common/Header/Header.jsx';
import Collections from './pages/Collections/Collections.jsx';
import About from './pages/About/About.jsx';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/collections" element={<Collections />} />
          {/* <Route path="/review/:collectionId" element={<Review />} /> */}
          {/* <Route path="/profile" element={<UserProfile />} /> */}
          {/* <Route path="/moderator" element={<Moderator />} /> */}
          {/* Можно добавить страницу 404 */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;