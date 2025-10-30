import React from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useSkins } from '../../hooks/useSkins';
import SkinGrid from '../../components/skins/SkinGrid/SkinGrid';
import SkinFilters from '../../components/skins/SkinFilters/SkinFilters';
import StatsHighlights from '../../components/common/StatsHighlights/StatsHighlights';
import RecentReviews from '../../components/reviews/RecentReviews/RecentReviews';
import CTASection from '../../components/common/CTASection/CTASection';
import styles from './Home.module.css';

const Home = () => {
  const { user } = useAuth();
  const { skins, loading, filters, updateFilters, resetFilters } = useSkins();

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1>Оценка скинов Valorant</h1>
        <p>
          Изучите коллекции скинов, оценивайте их по 5 критериям и делитесь
          развернутыми рецензиями с сообществом. Найдите лучшие скины для своего арсенала.
        </p>
      </section>

      <StatsHighlights />

      <SkinFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onReset={resetFilters}
      />

      <SkinGrid skins={skins} loading={loading} />

      <RecentReviews />

      <CTASection user={user} />
    </div>
  );
};

export default Home;