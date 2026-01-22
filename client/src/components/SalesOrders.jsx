"use client";
import { useState } from 'react';
import { mockSalesOrders, mockCustomers } from '../data/mockData';
import { FileText, Calendar, DollarSign, Package } from 'lucide-react';

export default function SalesOrders() {
  const [salesOrders] = useState(mockSalesOrders);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Sales Orders</h1>
        <p className="text-gray-600 mt-1">Manage confirmed sales orders</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected Delivery
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salesOrders.map((order) => {
              const customer = mockCustomers.find(c => c.id === order.customerId);
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="font-medium text-gray-900">{order.orderNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{customer?.name}</div>
                    <div className="text-sm text-gray-500">{customer?.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                    ${order.totalValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Order Value"
          value={`$${salesOrders.reduce((sum, o) => sum + o.totalValue, 0).toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6" />}
          bgColor="bg-green-500"
        />
        <SummaryCard
          title="Active Orders"
          value={salesOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}
          icon={<Package className="h-6 w-6" />}
          bgColor="bg-blue-500"
        />
        <SummaryCard
          title="Awaiting Payment"
          value={salesOrders.filter(o => o.paymentStatus === 'pending').length}
          icon={<Calendar className="h-6 w-6" />}
          bgColor="bg-orange-500"
        />
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }) {
  const colors = {
    pending: 'bg-gray-100 text-gray-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_production: 'bg-purple-100 text-purple-800',
    ready_to_ship: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const labels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_production: 'In Production',
    ready_to_ship: 'Ready to Ship',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}

function PaymentStatusBadge({ status }) {
  const colors = {
    pending: 'bg-red-100 text-red-800',
    partial: 'bg-orange-100 text-orange-800',
    paid: 'bg-green-100 text-green-800'
  };

  const labels = {
    pending: 'Pending',
    partial: 'Partial',
    paid: 'Paid'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}

function SummaryCard({ 
  title, 
  value, 
  icon, 
  bgColor 
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`${bgColor} rounded-lg p-3 text-white`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
