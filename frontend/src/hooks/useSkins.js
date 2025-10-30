import { useState, useEffect } from 'react';
import { skinService } from '../services/api';

export const useSkins = () => {
  const [skins, setSkins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    weapon: 'all',
    rarity: 'all',
    sort: 'rating-desc'
  });

  useEffect(() => {
    loadSkins();
  }, [filters]);

  const loadSkins = async () => {
    setLoading(true);
    try {
      // В реальном приложении здесь был бы запрос к API
      const data = await skinService.getSkins(filters);
      setSkins(data);
    } catch (error) {
      console.error('Error loading skins:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      weapon: 'all',
      rarity: 'all',
      sort: 'rating-desc'
    });
  };

  return {
    skins,
    loading,
    filters,
    updateFilters,
    resetFilters
  };
};