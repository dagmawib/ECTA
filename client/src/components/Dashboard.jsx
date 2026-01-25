"use client";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Ship, 
  Users,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { getAllShipmentsWithDetails, mockQuotes, mockSalesOrders, mockCustomers } from '../data/mockData';

export default function Dashboard({ currentUser, onNavigate }) {
  const shipments = getAllShipmentsWithDetails();
  
  // Calculate KPIs
  const totalShipments = shipments.length;
  const activeShipments = shipments.filter(s => 
    ['in_transit', 'at_port', 'customs_clearance'].includes(s.status)
  ).length;
  const delayedShipments = shipments.filter(s => s.status === 'delayed').length;
  
  const totalQuotes = mockQuotes.length;
  const sentQuotes = mockQuotes.filter(q => q.status === 'sent').length;
  
  // Calculate monthly revenue and profit
  const completedShipments = shipments.filter(s => s.status === 'delivered');
  const monthlyRevenue = completedShipments.reduce((sum, s) => {
    return sum + (s.salesOrder?.totalValue || 0);
  }, 0);
  
  const monthlyProfit = completedShipments.reduce((sum, s) => {
    const revenue = s.salesOrder?.totalValue || 0;
    const cost = s.actualCosts?.total || s.estimatedCosts.total;
    return sum + (revenue - cost);
  }, 0);
  
  const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue * 100) : 0;

  // Role-specific content
  const renderSalesDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Active Quotes"
          value={sentQuotes}
          total={totalQuotes}
          icon={<DollarSign className="h-6 w-6" />}
          trend="neutral"
          bgColor="bg-blue-500"
        />
        <KPICard
          title="Sales Orders"
          value={mockSalesOrders.length}
          icon={<Package className="h-6 w-6" />}
          trend="up"
          change="+12%"
          bgColor="bg-green-500"
        />
        <KPICard
          title="Active Customers"
          value={mockCustomers.length}
          icon={<Users className="h-6 w-6" />}
          trend="neutral"
          bgColor="bg-purple-500"
        />
        <KPICard
          title="Avg. Margin"
          value={`${profitMargin.toFixed(1)}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          trend="up"
          change="+2.3%"
          bgColor="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Quotes</h3>
          <div className="space-y-3">
            {mockQuotes.slice(0, 5).map(quote => (
              <div key={quote.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{quote.quoteNumber}</div>
                  <div className="text-sm text-gray-500">
                    {mockCustomers.find(c => c.id === quote.customerId)?.name}
                  </div>
                </div>
                <div className="text-right sm:text-right mt-2 sm:mt-0">
                  <div className="font-semibold text-gray-900">
                    ${quote.sellingPrice.toLocaleString()}
                  </div>
                  <StatusBadge status={quote.status} />
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => onNavigate('quotes')}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all quotes →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Value</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Draft Quotes</span>
              <span className="font-semibold text-gray-900">
                ${mockQuotes.filter(q => q.status === 'draft').reduce((sum, q) => sum + q.sellingPrice, 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sent Quotes</span>
              <span className="font-semibold text-gray-900">
                ${mockQuotes.filter(q => q.status === 'sent').reduce((sum, q) => sum + q.sellingPrice, 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Approved (Not Yet SO)</span>
              <span className="font-semibold text-green-600">
                ${mockQuotes.filter(q => q.status === 'approved').reduce((sum, q) => sum + q.sellingPrice, 0).toLocaleString()}
              </span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Pipeline</span>
              <span className="text-xl font-bold text-blue-600">
                ${mockQuotes.reduce((sum, q) => sum + q.sellingPrice, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderLogisticsDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Active Shipments"
          value={activeShipments}
          total={totalShipments}
          icon={<Ship className="h-6 w-6" />}
          trend="neutral"
          bgColor="bg-blue-500"
        />
        <KPICard
          title="In Transit"
          value={shipments.filter(s => s.status === 'in_transit').length}
          icon={<Ship className="h-6 w-6" />}
          trend="neutral"
          bgColor="bg-indigo-500"
        />
        <KPICard
          title="Delayed"
          value={delayedShipments}
          icon={<AlertTriangle className="h-6 w-6" />}
          trend="down"
          bgColor="bg-red-500"
        />
        <KPICard
          title="Delivered (MTD)"
          value={shipments.filter(s => s.status === 'delivered').length}
          icon={<CheckCircle className="h-6 w-6" />}
          trend="up"
          change="+8%"
          bgColor="bg-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Shipments</h3>
          <div className="space-y-3">
            {shipments
              .filter(s => ['in_transit', 'at_port', 'customs_clearance', 'delayed'].includes(s.status))
              .slice(0, 5)
              .map(shipment => (
                <div key={shipment.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{shipment.shipmentNumber}</div>
                    <div className="text-sm text-gray-500">
                      {shipment.origin} → {shipment.destination}
                    </div>
                  </div>
                  <div className="text-right sm:text-right sm:ml-4 mt-2 sm:mt-0">
                    <div className="text-sm text-gray-600 mb-1">
                      ETA: {new Date(shipment.estimatedArrivalDate).toLocaleDateString()}
                    </div>
                    <ShipmentStatusBadge status={shipment.status} />
                  </div>
                </div>
              ))}
          </div>
          <button 
            onClick={() => onNavigate('shipments')}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all shipments →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment by Mode</h3>
          <div className="space-y-4">
            {['sea', 'air', 'land'].map(mode => {
              const count = shipments.filter(s => s.mode === mode).length;
              const percentage = (count / totalShipments * 100).toFixed(0);
              return (
                <div key={mode}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 capitalize">{mode}</span>
                    <span className="font-medium text-gray-900">{count} shipments ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );

  const renderFinanceDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Monthly Revenue"
          value={`$${(monthlyRevenue / 1000).toFixed(0)}K`}
          icon={<DollarSign className="h-6 w-6" />}
          trend="up"
          change="+15%"
          bgColor="bg-green-500"
        />
        <KPICard
          title="Monthly Profit"
          value={`$${(monthlyProfit / 1000).toFixed(0)}K`}
          icon={<TrendingUp className="h-6 w-6" />}
          trend="up"
          change="+8%"
          bgColor="bg-blue-500"
        />
        <KPICard
          title="Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          trend="neutral"
          bgColor="bg-purple-500"
        />
        <KPICard
          title="Pending Invoices"
          value={3}
          icon={<AlertTriangle className="h-6 w-6" />}
          trend="down"
          bgColor="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment Profitability</h3>
          <div className="space-y-3">
            {shipments.slice(0, 5).map(shipment => {
              const revenue = shipment.salesOrder?.totalValue || 0;
              const cost = shipment.actualCosts?.total || shipment.estimatedCosts.total;
              const profit = revenue - cost;
              const margin = revenue > 0 ? (profit / revenue * 100) : 0;
              
              return (
                <div key={shipment.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{shipment.shipmentNumber}</div>
                    <div className="text-sm text-gray-500">
                      {shipment.customer?.name}
                    </div>
                  </div>
                  <div className="text-right sm:text-right mt-2 sm:mt-0">
                    <div className="font-semibold text-gray-900">
                      ${profit.toLocaleString()}
                    </div>
                    <div className={`text-sm ${margin >= 10 ? 'text-green-600' : 'text-orange-600'}`}>
                      {margin.toFixed(1)}% margin
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button 
            onClick={() => onNavigate('finance')}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View detailed analysis →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Variance Analysis</h3>
          <div className="space-y-4">
            {shipments
              .filter(s => s.actualCosts)
              .slice(0, 4)
              .map(shipment => {
                const estimated = shipment.estimatedCosts.total;
                const actual = shipment.actualCosts?.total ?? shipment.estimatedCosts.total;
                const variance = actual - estimated;
                const variancePercent = (variance / estimated * 100);
                
                return (
                  <div key={shipment.id} className="border-b pb-3 last:border-b-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-1 mb-2">
                      <div className="font-medium text-gray-900">{shipment.shipmentNumber}</div>
                      <div className={`text-sm font-semibold ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {variance > 0 ? '+' : ''}{variancePercent.toFixed(1)}%
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                      <span className="text-gray-600">Estimated: ${estimated.toLocaleString()}</span>
                      <span className="text-gray-600">Actual: ${actual.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );

  const renderManagementDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Monthly Revenue"
          value={`$${(monthlyRevenue / 1000).toFixed(0)}K`}
          icon={<DollarSign className="h-6 w-6" />}
          trend="up"
          change="+15%"
          bgColor="bg-green-500"
        />
        <KPICard
          title="Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          trend="up"
          change="+2.3%"
          bgColor="bg-blue-500"
        />
        <KPICard
          title="Active Shipments"
          value={activeShipments}
          icon={<Ship className="h-6 w-6" />}
          trend="neutral"
          bgColor="bg-indigo-500"
        />
        <KPICard
          title="Delayed Issues"
          value={delayedShipments}
          icon={<AlertTriangle className="h-6 w-6" />}
          trend="down"
          bgColor="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Customers (by Revenue)</h3>
          <div className="space-y-3">
            {mockCustomers.slice(0, 5).map((customer, index) => {
              const customerShipments = shipments.filter(s => s.customerId === customer.id);
              const revenue = customerShipments.reduce((sum, s) => sum + (s.salesOrder?.totalValue || 0), 0);
              
              return (
                <div key={customer.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.country}</div>
                    </div>
                  </div>
                  <div className="text-right sm:text-right mt-2 sm:mt-0">
                    <div className="font-semibold text-gray-900">${revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{customerShipments.length} shipments</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics Overview</h3>
          <div className="space-y-4">
            <MetricRow 
              label="Total Customers"
              value={mockCustomers.length}
              trend="up"
            />
            <MetricRow 
              label="Active Quotes"
              value={mockQuotes.filter(q => q.status !== 'expired' && q.status !== 'rejected').length}
              trend="neutral"
            />
            <MetricRow 
              label="Sales Orders"
              value={mockSalesOrders.length}
              trend="up"
            />
            <MetricRow 
              label="Avg. Order Value"
              value={`$${(mockSalesOrders.reduce((sum, so) => sum + so.totalValue, 0) / mockSalesOrders.length).toLocaleString()}`}
              trend="up"
            />
            <MetricRow 
              label="On-time Delivery Rate"
              value="87%"
              trend="neutral"
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {currentUser.name} • {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {currentUser.role === 'sales' && renderSalesDashboard()}
      {currentUser.role === 'logistics' && renderLogisticsDashboard()}
      {currentUser.role === 'finance' && renderFinanceDashboard()}
      {currentUser.role === 'management' && renderManagementDashboard()}
    </div>
  );
}

function KPICard({ title, value, total, icon, trend, change, bgColor }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-start sm:items-center justify-between mb-4">
        <div className={`${bgColor} rounded-lg p-3 text-white`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : 
             trend === 'down' ? <TrendingDown className="h-4 w-4 mr-1" /> : null}
            {change}
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-baseline">
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
        {total && <p className="text-gray-500 ml-2">/ {total}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-600'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  );
}

function ShipmentStatusBadge({ status }) {
  const colors = {
    pending: 'bg-gray-100 text-gray-800',
    in_transit: 'bg-blue-100 text-blue-800',
    at_port: 'bg-indigo-100 text-indigo-800',
    customs_clearance: 'bg-purple-100 text-purple-800',
    cleared: 'bg-teal-100 text-teal-800',
    out_for_delivery: 'bg-green-100 text-green-800',
    delivered: 'bg-green-100 text-green-800',
    delayed: 'bg-red-100 text-red-800'
  };
  
  const labels = {
    pending: 'Pending',
    in_transit: 'In Transit',
    at_port: 'At Port',
    customs_clearance: 'Customs',
    cleared: 'Cleared',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    delayed: 'Delayed'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}

function MetricRow({ label, value, trend }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center">
        <span className="font-semibold text-gray-900 mr-2">{value}</span>
        {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
        {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
      </div>
    </div>
  );
}
