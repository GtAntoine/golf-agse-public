import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface Price {
  year: number;
  type: 'MEMBERSHIP' | 'LICENSE';
  code: string;
  amount: number;
}

export function useMembershipPrices() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      // Si on est en septembre ou après, on prend les prix de l'année suivante
      const targetYear = currentMonth >= 8 ? currentYear + 1 : currentYear;

      const { data, error } = await supabase
        .from('prices')
        .select('*')
        .eq('year', targetYear);

      if (error) throw error;

      setPrices(data);
    } catch (err) {
      console.error('Error fetching prices:', err);
      setError('Erreur lors du chargement des prix');
    } finally {
      setLoading(false);
    }
  };

  const getMembershipPrice = (code: string) => {
    return prices.find(p => p.type === 'MEMBERSHIP' && p.code === code)?.amount || 0;
  };

  const getLicensePrice = (code: string) => {
    return prices.find(p => p.type === 'LICENSE' && p.code === code)?.amount || 0;
  };

  const getCurrentYear = () => {
    const currentDate = new Date();
    return currentDate.getMonth() >= 8 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
  };

  return {
    prices,
    loading,
    error,
    getMembershipPrice,
    getLicensePrice,
    getCurrentYear
  };
}