"use client";
import { 
  LayoutDashboard, 
  Package, 
  Ship, 
  DollarSign, 
  Users, 
  FileText,
  LogOut,
  Menu
} from 'lucide-react';

export default function Layout({ 
  children, 
  currentUser, 
  currentView, 
  onNavigate,
  onLogout 
}) {
  const navigation = [
    { 
      name: 'Dashboard', 
      icon: LayoutDashboard, 
      view: 'dashboard',
      roles: ['sales', 'logistics', 'finance', 'management']
    },
    { 
      name: 'Customers', 
      icon: Users, 
      view: 'customers',
      roles: ['sales', 'management']
    },
    { 
      name: 'Quotes', 
      icon: FileText, 
      view: 'quotes',
      roles: ['sales', 'management']
    },
    { 
      name: 'Sales Orders', 
      icon: FileText, 
      view: 'sales-orders',
      roles: ['sales', 'logistics', 'management']
    },
    { 
      name: 'Shipments', 
      icon: Ship, 
      view: 'shipments',
      roles: ['logistics', 'sales', 'finance', 'management']
    },
    { 
      name: 'Inventory', 
      icon: Package, 
      view: 'inventory',
      roles: ['logistics', 'sales', 'management']
    },
    { 
      name: 'Finance', 
      icon: DollarSign, 
      view: 'finance',
      roles: ['finance', 'management']
    },
  ];

  const visibleNavigation = navigation.filter(item => 
    item.roles.includes(currentUser.role)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">ECTA Mini-ERP</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                <div className="text-xs text-gray-500 capitalize">{currentUser.role}</div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Side Navigation */}
      <div className="fixed inset-y-0 left-0 pt-16 w-64 bg-white border-r border-gray-200">
        <nav className="px-4 py-6 space-y-1">
          {visibleNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            
            return (
              <button
                key={item.name}
                onClick={() => onNavigate(item.view)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="pl-64 pt-16">
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
