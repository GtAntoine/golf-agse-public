import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { UserPlus, ClipboardList, UserCircle, Settings, Settings2, Users } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        
        if (!profileError && profile) {
          setIsAdmin(profile.role === 'admin');
        } else {
          setIsAdmin(false);
        }
      }
    } catch (error) {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }

  const renderAuthLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? 'bg-green-800 text-white'
                  : 'text-green-100 hover:bg-green-600'
              }`
            }
          >
            <UserPlus className="h-5 w-5" />
            <span className="hidden md:inline">S'inscrire</span>
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? 'bg-green-800 text-white'
                  : 'text-green-100 hover:bg-green-600'
              }`
            }
          >
            <Settings className="h-5 w-5" />
            <span className="hidden md:inline">Se connecter</span>
          </NavLink>
        </>
      );
    }

    return (
      <>
        <NavLink
          to="/adhesion"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
              isActive
                ? 'bg-green-800 text-white'
                : 'text-green-100 hover:bg-green-600'
            }`
          }
        >
          <UserPlus className="h-5 w-5" />
          <span className="hidden md:inline">Adhésion</span>
        </NavLink>
        
        {isAdmin && (
          <>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-green-800 text-white'
                    : 'text-green-100 hover:bg-green-600'
                }`
              }
            >
              <ClipboardList className="h-5 w-5" />
              <span className="hidden md:inline">Tableau de bord</span>
            </NavLink>

            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-green-800 text-white'
                    : 'text-green-100 hover:bg-green-600'
                }`
              }
            >
              <Users className="h-5 w-5" />
              <span className="hidden md:inline">Gestion des adhérents</span>
            </NavLink>

            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-green-800 text-white'
                    : 'text-green-100 hover:bg-green-600'
                }`
              }
            >
              <Settings2 className="h-5 w-5" />
              <span className="hidden md:inline">Paramètres admins</span>
            </NavLink>
          </>
        )}

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
              isActive
                ? 'bg-green-800 text-white'
                : 'text-green-100 hover:bg-green-600'
            }`
          }
        >
          <UserCircle className="h-5 w-5" />
          <span className="hidden md:inline">Mon profil</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
              isActive
                ? 'bg-green-800 text-white'
                : 'text-green-100 hover:bg-green-600'
            }`
          }
        >
          <Settings className="h-5 w-5" />
          <span className="hidden md:inline">Paramètres</span>
        </NavLink>
      </>
    );
  };

  return (
    <nav className="bg-green-700 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2">
            <img 
              src="/images/logoAGSE.png" 
              alt="AGSE Golf" 
              className="h-10 w-auto"
            />
            <h1 className="text-2xl font-bold">AGSE Golf</h1>
          </NavLink>
          
          <div className="flex items-center space-x-4">
            {renderAuthLinks()}
          </div>
        </div>
      </div>
    </nav>
  );
}