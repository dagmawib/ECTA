"use client";
import { useState } from 'react';
import { mockUsers } from '../data/mockData';
import { Package, LogIn } from 'lucide-react';

export default function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = () => {
    if (selectedRole) {
      const user = mockUsers.find(u => u.role === selectedRole);
      if (user) {
        setFormData({ email: user.email, password: '' });
        setShowForm(true);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = mockUsers.find(u => u.role === selectedRole);
    if (user) {
      onLogin(user);
    }
  };

  const roleDescriptions = {
    sales: {
      title: 'Sales',
      description: 'Create quotes, manage customers, and convert to sales orders',
      features: ['Create & manage quotes', 'Customer database', 'Pipeline tracking']
    },
    logistics: {
      title: 'Logistics',
      description: 'Track shipments, manage documents, and update delivery status',
      features: ['Shipment tracking', 'Document generation', 'Status updates']
    },
    finance: {
      title: 'Finance',
      description: 'Analyze costs, track profitability, and manage invoices',
      features: ['Cost analysis', 'Profit tracking', 'Variance reports']
    },
    management: {
      title: 'Management',
      description: 'View KPIs, dashboards, and comprehensive business reports',
      features: ['Executive dashboard', 'KPI monitoring', 'Business intelligence']
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-[1400px] w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Package className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ECTA Mini-ERP</h1>
          <p className="text-lg text-gray-600">
            Connecting Sales, Logistics, and Finance
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Demo System - Select your role to continue
          </p>
        </div>

        {!showForm && (
          <>
            {/* Role Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {Object.keys(roleDescriptions).map((role) => {
                const roleInfo = roleDescriptions[role];
                const user = mockUsers.find(u => u.role === role);
                const isSelected = selectedRole === role;

                return (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`text-left p-6 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{roleInfo.title}</h3>
                      {isSelected && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{roleInfo.description}</p>
                    <div className="space-y-1">
                      {roleInfo.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-500">
                          <span className="mr-2">•</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    {user && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-700">
                          Login as: <span className="font-medium">{user.name}</span>
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Login Button */}
            <div className="text-center">
              <button
                onClick={handleLogin}
                disabled={!selectedRole}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-all inline-flex items-center ${
                  selectedRole
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <LogIn className="h-5 w-5 mr-2" />
                {selectedRole ? `Login as ${roleDescriptions[selectedRole].title}` : 'Select a role to continue'}
              </button>
            </div>
          </>
        )}

        {showForm && (
          <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Complete Login</h3>
                <p className="text-sm text-gray-600">Role: {roleDescriptions[selectedRole]?.title}</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Change role
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Demo login: password not validated.</p>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Continue to Dashboard
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold text-gray-900 mb-2">About this Demo</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              This is a <strong>frontend prototype</strong> of a Mini-ERP system designed to replace Excel,
              WhatsApp, and email-based workflows.
            </p>
            <p>
              <strong>Key Features:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Sales: Create quotes with automatic landed cost calculations</li>
              <li>Logistics: Track shipments with real-time status updates</li>
              <li>Finance: Analyze actual vs. estimated costs and profitability</li>
              <li>Management: View executive dashboards and KPIs</li>
            </ul>
            <p className="pt-2 border-t border-gray-200 mt-4">
              <strong>Note:</strong> All data is mock data for demonstration purposes. 
              For production use with real persistence, this would need a backend database (e.g., Supabase).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
