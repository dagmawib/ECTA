"use client";
import {
  LayoutDashboard,
  Package,
  Ship,
  DollarSign,
  Users,
  FileText,
  LogOut,
  Menu,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

export default function Layout({
  children,
  currentUser,
  currentView,
  onNavigate,
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      view: "dashboard",
      roles: ["sales", "logistics", "finance", "management"],
    },
    {
      name: "Customers",
      icon: Users,
      view: "customers",
      roles: ["sales", "management"],
    },
    {
      name: "Quotes",
      icon: FileText,
      view: "quotes",
      roles: ["sales", "management"],
    },
    {
      name: "Sales Orders",
      icon: FileText,
      view: "sales-orders",
      roles: ["sales", "logistics", "management"],
    },
    {
      name: "Shipments",
      icon: Ship,
      view: "shipments",
      roles: ["logistics", "sales", "finance", "management"],
    },
    {
      name: "Inventory",
      icon: Package,
      view: "inventory",
      roles: ["logistics", "sales", "management"],
    },
    {
      name: "Finance",
      icon: DollarSign,
      view: "finance",
      roles: ["finance", "management"],
    },
  ];

  const visibleNavigation = navigation.filter((item) =>
    item.roles.includes(currentUser.role),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full h-16 z-20">
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          {/* Left: Mobile menu */}
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 md:hidden"
            aria-label="Open sidebar"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Center: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <ImageWithFallback
              src="/images/ECTA-rem.png"
              width={150}
              height={150}
              alt="ECTA Logo"
            />
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Side Navigation */}
      <div
        className={`fixed left-0 w-64 bg-white border-r border-gray-200 z-30
    transform transition-transform duration-200 flex flex-col
    top-16 h-[calc(100vh-4rem)]
    md:translate-x-0
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    pt-0`}
        aria-hidden={!sidebarOpen}
      >
        {/* Navigation */}
        <nav className="px-4 py-6 space-y-1">
          {visibleNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;

            return (
              <button
                key={item.name}
                onClick={() => {
                  onNavigate(item.view);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`h-5 w-5 mr-3 ${
                    isActive ? "text-blue-700" : "text-gray-400"
                  }`}
                />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* User info & logout — pinned to bottom */}
        <div className="mt-auto px-4 py-4 border-t border-gray-200 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">
              {currentUser.name}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {currentUser.role}
            </div>
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

      {/* Main Content Area */}
      <div className="md:pl-64 pt-16">
        <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
