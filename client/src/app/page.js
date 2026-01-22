"use client"
import { useState } from 'react';
import Login from '@/components/Login';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import Customers from '@/components/Customers';
import Quotes from '@/components/Quotes';
import SalesOrders from '@/components/SalesOrders';
import Shipments from '@/components/Shipments';
import Inventory from '@/components/Inventory';
import Finance from '@/components/Finance';

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  // Show login screen if not authenticated
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Render main application
  return (
    <Layout 
      currentUser={currentUser} 
      currentView={currentView} 
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {currentView === 'dashboard' && (
        <Dashboard currentUser={currentUser} onNavigate={handleNavigate} />
      )}
      {currentView === 'customers' && <Customers />}
      {currentView === 'quotes' && <Quotes />}
      {currentView === 'sales-orders' && <SalesOrders />}
      {currentView === 'shipments' && <Shipments />}
      {currentView === 'inventory' && <Inventory />}
      {currentView === 'finance' && <Finance />}
    </Layout>
  );
}
