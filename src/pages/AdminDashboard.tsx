import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { MembershipApplication, PaymentStatus } from '../types';
import { SearchBar } from '../components/admin/SearchBar';
import { ApplicationsTable } from '../components/admin/ApplicationsTable';
import { ExportButtons } from '../components/admin/ExportButtons';
import { Loader2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<Record<string, PaymentStatus[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ 
    key: 'lastname' as keyof MembershipApplication, 
    direction: 'asc' 
  });
  const [filters, setFilters] = useState({
    status: 'all',
    membershipType: 'all',
    dateRange: 'default'
  });
  const [loading, setLoading] = useState(true);
  
  const currentYear = new Date().getFullYear();
  const lastFiveYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const nextYear = currentYear + 1;

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);

      // Récupérer les données utilisateurs via get_users
      const { data: userData, error: userError } = await supabase.rpc('get_users');
      if (userError) throw userError;

      // Récupérer les données d'adhésion
      const { data: appData, error: appError } = await supabase
        .from('membership_applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (appError) throw appError;

      // Récupérer les statuts de paiement
      const { data: paymentData, error: paymentError } = await supabase
        .from('payment_history')
        .select('*')
        .order('year', { ascending: false });
      if (paymentError) throw paymentError;

      // Organiser les données utilisateurs pour un accès rapide
      const userMap = new Map(userData.map(user => [user.id, user]));

      // Organiser les statuts de paiement par utilisateur
      const paymentsByUser = paymentData.reduce((acc, payment) => {
        if (!acc[payment.profile_id]) {
          acc[payment.profile_id] = [];
        }
        acc[payment.profile_id].push(payment);
        return acc;
      }, {} as Record<string, PaymentStatus[]>);

      // Fusionner les données
      const mergedData = appData.map(app => {
        const user = userMap.get(app.user_id);
        if (!user) return app;

        return {
          ...app,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
          birthdate: user.birthdate,
          phone: user.phone,
          address: user.address,
          postalcode: user.postalcode,
          city: user.city,
          ffglicense: user.ffglicense,
          emergencycontact: user.emergencycontact,
          emergencyphone: user.emergencyphone,
          golfindex: user.golfindex,
          birthplace: user.birthplace,
        };
      });

      setPaymentStatuses(paymentsByUser);
      setApplications(mergedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSort = (key: keyof MembershipApplication) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filterApplications = (apps: MembershipApplication[]) => {
    return apps.filter(app => {
      // Filtre de recherche
      const searchLower = searchTerm.toLowerCase();
      const searchFields = [
        app.email,
        app.firstname,
        app.lastname,
        app.phone,
        app.ffglicense,
        app.city,
        app.birthplace,
      ];
      const matchesSearch = searchFields.some(field => 
        field && field.toString().toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;

      // Filtre par type d'adhésion
      if (filters.membershipType !== 'all' && app.membershiptype !== filters.membershipType) {
        return false;
      }

      // Filtre par date
      const appDate = new Date(app.created_at);
      if (filters.dateRange === 'currentYear') {
        return appDate >= new Date(currentYear, 0, 1);
      } else if (filters.dateRange === 'default') {
        const defaultStartDate = new Date(currentYear - 1, 8, 1);
        return appDate >= defaultStartDate;
      } else if (filters.dateRange === 'currentSeptember') {
        const currentSeptemberDate = new Date(currentYear, 8, 1);
        return appDate >= currentSeptemberDate;
      } else if (filters.dateRange.startsWith('year_')) {
        const year = parseInt(filters.dateRange.split('_')[1]);
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31);
        return appDate >= startOfYear && appDate <= endOfYear;
      }

      return true;
    });
  };

  const sortedAndFilteredApplications = filterApplications([...applications]).sort((a, b) => {
    if (sortConfig.key === 'created_at') {
      return sortConfig.direction === 'asc' 
        ? new Date(a[sortConfig.key]).getTime() - new Date(b[sortConfig.key]).getTime()
        : new Date(b[sortConfig.key]).getTime() - new Date(a[sortConfig.key]).getTime();
    }
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Calculer les statistiques
  const totalApplications = sortedAndFilteredApplications.length;
  const membershipStats = {
    GOLF: sortedAndFilteredApplications.filter(app => app.membershiptype === 'GOLF').length,
    GOLF_LOISIR: sortedAndFilteredApplications.filter(app => app.membershiptype === 'GOLF_LOISIR').length,
    GOLF_JEUNE: sortedAndFilteredApplications.filter(app => app.membershiptype === 'GOLF_JEUNE').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-700">Tableau de bord administrateur</h2>
        <div className="flex gap-4">
          <Link
            to="/users"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Users className="h-5 w-5" />
            Gestion des adhérents
          </Link>
          <ExportButtons 
            applications={sortedAndFilteredApplications} 
            paymentStatuses={paymentStatuses}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Statistiques des adhésions</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{totalApplications}</div>
            <div className="text-sm text-green-600">Total des adhésions</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{membershipStats.GOLF}</div>
            <div className="text-sm text-blue-600">GOLF</div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-indigo-700">{membershipStats.GOLF_LOISIR}</div>
            <div className="text-sm text-indigo-600">GOLF LOISIR</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">{membershipStats.GOLF_JEUNE}</div>
            <div className="text-sm text-purple-600">GOLF JEUNE</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="complete">Complet</option>
              <option value="pending">En attente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type d'adhésion</label>
            <select
              value={filters.membershipType}
              onChange={(e) => handleFilterChange('membershipType', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="all">Tous les types</option>
              <option value="GOLF">GOLF</option>
              <option value="GOLF_LOISIR">GOLF LOISIR</option>
              <option value="GOLF_JEUNE">GOLF JEUNE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="default">Depuis septembre {currentYear - 1}</option>
              <option value="currentSeptember">Depuis septembre {currentYear}</option>
              <option value={`year_${nextYear}`}>Année {nextYear}</option>
              {lastFiveYears.map(year => (
                <option key={year} value={`year_${year}`}>Année {year}</option>
              ))}
              <option value="all">Toutes les demandes</option>
            </select>
          </div>
        </div>

        <SearchBar 
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
        />
      </div>

      <ApplicationsTable 
        applications={sortedAndFilteredApplications}
        paymentStatuses={paymentStatuses}
        onSort={handleSort}
        checkFFGLicense={(licenseNumber) => {
          if (licenseNumber) {
            navigator.clipboard.writeText(licenseNumber);
            window.open('https://xnet.ffgolf.org/', '_blank');
          }
        }}
      />
    </div>
  );
}