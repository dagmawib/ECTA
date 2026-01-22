"use client";
import { useState } from 'react';
import { mockCustomers } from '../data/mockData';
import { Users, MapPin, Phone, Mail, CreditCard } from 'lucide-react';

export default function Customers() {
  const [customers] = useState(mockCustomers);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">Manage your customer database</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>
    </div>
  );
}

function CustomerCard({ customer }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{customer.name}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {customer.country}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center text-gray-600">
          <Mail className="h-4 w-4 mr-2 text-gray-400" />
          <span className="truncate">{customer.email}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
          <span>{customer.paymentTerms}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Credit Limit</span>
          <span className="font-semibold text-gray-900">
            ${customer.creditLimit.toLocaleString()}
          </span>
        </div>
      </div>

      <button className="mt-4 w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
        View Details
      </button>
    </div>
  );
}
