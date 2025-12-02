import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Settings as SettingsIcon, Save, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Price {
  id: string;
  year: number;
  type: 'MEMBERSHIP' | 'LICENSE';
  code: string;
  amount: number;
}

export default function AdminSettings() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    checkAdmin();
    fetchPrices();
  }, [selectedYear]);

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.role !== 'admin') {
      navigate('/');
    }
  }

  async function fetchPrices() {
    try {
      const { data, error } = await supabase
        .from('prices')
        .select('*')
        .eq('year', selectedYear)
        .order('type', { ascending: true })
        .order('code', { ascending: true });

      if (error) throw error;

      setPrices(data || []);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setError('Erreur lors du chargement des prix');
    } finally {
      setLoading(false);
    }
  }

  const handlePriceChange = (id: string, amount: string) => {
    setPrices(prices.map(price => 
      price.id === id ? { ...price, amount: parseFloat(amount) || 0 } : price
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('prices')
        .upsert(
          prices.map(({ id, year, type, code, amount }) => ({
            id,
            year,
            type,
            code,
            amount,
            updated_at: new Date().toISOString()
          }))
        );

      if (error) throw error;

      setSuccess('Prix mis à jour avec succès');
      await fetchPrices();
    } catch (error) {
      console.error('Error saving prices:', error);
      setError('Erreur lors de la sauvegarde des prix');
    } finally {
      setSaving(false);
    }
  };

  const addNewYear = async () => {
    const newYear = selectedYear + 1;
    
    try {
      // Copier les prix de l'année actuelle vers la nouvelle année
      const newPrices = prices.map(price => ({
        year: newYear,
        type: price.type,
        code: price.code,
        amount: price.amount
      }));

      const { error } = await supabase
        .from('prices')
        .insert(newPrices);

      if (error) throw error;

      setSelectedYear(newYear);
      setSuccess(`Prix copiés vers l'année ${newYear}`);
    } catch (error) {
      console.error('Error copying prices:', error);
      setError('Erreur lors de la copie des prix');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Paramètres des prix</h1>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              {Array.from({ length: 5 }, (_, i) => selectedYear - 2 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <button
              onClick={addNewYear}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Copier vers {selectedYear + 1}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            {success}
          </div>
        )}

        <div className="space-y-8">
          {/* Adhésions */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Prix des adhésions</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              {prices
                .filter(price => price.type === 'MEMBERSHIP')
                .map(price => (
                  <div key={price.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {price.code === 'GOLF' ? 'GOLF' :
                         price.code === 'GOLF_LOISIR' ? 'GOLF LOISIR' :
                         'GOLF JEUNE'}
                      </label>
                    </div>
                    <div className="w-32">
                      <div className="relative">
                        <input
                          type="number"
                          value={price.amount}
                          onChange={(e) => handlePriceChange(price.id, e.target.value)}
                          className="block w-full rounded-md border-gray-300 pl-3 pr-8 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <span className="text-gray-500">€</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Licences */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Prix des licences</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              {prices
                .filter(price => price.type === 'LICENSE')
                .map(price => (
                  <div key={price.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {price.code === 'adult' ? 'Licence FFG Adulte' :
                         price.code === 'young-adult' ? 'Licence FFG Jeune adulte (19-25 ans)' :
                         price.code === 'teen' ? 'Licence FFG Jeune (13-18 ans)' :
                         'Licence FFG Enfant (moins de 13 ans)'}
                      </label>
                    </div>
                    <div className="w-32">
                      <div className="relative">
                        <input
                          type="number"
                          value={price.amount}
                          onChange={(e) => handlePriceChange(price.id, e.target.value)}
                          className="block w-full rounded-md border-gray-300 pl-3 pr-8 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <span className="text-gray-500">€</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}