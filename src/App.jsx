import React, { useState, useEffect } from 'react';
import { CountdownProvider } from './context/CountdownContext';
import CountdownPage from './components/CountdownPage';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Determine route based on pathname or hash
  const getIsAdminRoute = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return (
      path === '/admin' ||
      path === '/admin/' ||
      path.startsWith('/admin') ||
      hash === '#admin' ||
      hash === '#/admin'
    );
  };

  const [isAdmin, setIsAdmin] = useState(getIsAdminRoute);

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdmin(getIsAdminRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  return (
    <CountdownProvider>
      {isAdmin ? <AdminPanel /> : <CountdownPage />}
    </CountdownProvider>
  );
}
