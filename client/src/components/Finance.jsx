"use client";
import { useState } from 'react';
import { getAllShipmentsWithDetails } from '../data/mockData';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Finance() {
  const shipments = getAllShipmentsWithDetails();
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);

  // Calculate overall financial metrics
  const shipmentsWithActualCosts = shipments.filter(s => s.actualCosts && s.salesOrder);
  const totalRevenue = shipmentsWithActualCosts.reduce((sum, s) => sum + (s.salesOrder?.totalValue || 0), 0);
  const totalCosts = shipmentsWithActualCosts.reduce((sum, s) => sum + (s.actualCosts?.total || 0), 0);
  const totalProfit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0;

  // Calculate variances
  const totalEstimatedCosts = shipmentsWithActualCosts.reduce((sum, s) => sum + s.estimatedCosts.total, 0);
  const totalVariance = totalCosts - totalEstimatedCosts;
  const variancePercentage = totalEstimatedCosts > 0 ? (totalVariance / totalEstimatedCosts * 100) : 0;

  // Prepare profitability data for each shipment
  const profitabilityData = shipmentsWithActualCosts.map(shipment => {
    const revenue = shipment.salesOrder?.totalValue || 0;
    const cost = shipment.actualCosts?.total || shipment.estimatedCosts.total;
    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue * 100) : 0;

    return {
      shipment,
      revenue,
      cost,
      profit,
      margin,
      estimatedCost: shipment.estimatedCosts.total,
      actualCost: shipment.actualCosts?.total || 0,
      variance: (shipment.actualCosts?.total || 0) - shipment.estimatedCosts.total
    };
  });

  // Chart data
  const chartData = profitabilityData.slice(0, 5).map(d => ({
    name: d.shipment.shipmentNumber,
    Revenue: d.revenue,
    Cost: d.cost,
    Profit: d.profit
  }));

  const costBreakdownData = shipmentsWithActualCosts.length > 0 ? [
    { name: 'Freight', value: shipmentsWithActualCosts.reduce((sum, s) => sum + (s.actualCosts?.freight || 0), 0) },
    { name: 'Duty', value: shipmentsWithActualCosts.reduce((sum, s) => sum + (s.actualCosts?.duty || 0), 0) },
    { name: 'Insurance', value: shipmentsWithActualCosts.reduce((sum, s) => sum + (s.actualCosts?.insurance || 0), 0) },
    { name: 'Local Transport', value: shipmentsWithActualCosts.reduce((sum, s) => sum + (s.actualCosts?.localTransport || 0), 0) },
    { name: 'Handling', value: shipmentsWithActualCosts.reduce((sum, s) => sum + (s.actualCosts?.handling || 0), 0) },
    { name: 'Other', value: shipmentsWithActualCosts.reduce((sum, s) => sum + (s.actualCosts?.other || 0), 0) }
  ] : [];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Finance & Profitability</h1>
        <p className="text-gray-600 mt-1">Track costs, revenue, and profit margins</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Revenue"
          value={`$${(totalRevenue / 1000).toFixed(0)}K`}
          subtitle="From completed shipments"
          icon={<DollarSign className="h-6 w-6" />}
          bgColor="bg-green-500"
        />
        <KPICard
          title="Total Profit"
          value={`$${(totalProfit / 1000).toFixed(0)}K`}
          subtitle={`${profitMargin.toFixed(1)}% margin`}
          icon={<TrendingUp className="h-6 w-6" />}
          bgColor="bg-blue-500"
        />
        <KPICard
          title="Cost Variance"
          value={totalVariance >= 0 ? `+$${(totalVariance / 1000).toFixed(0)}K` : `-$${Math.abs(totalVariance / 1000).toFixed(0)}K`}
          subtitle={`${variancePercentage >= 0 ? '+' : ''}${variancePercentage.toFixed(1)}% vs estimate`}
          icon={totalVariance > 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
          bgColor={totalVariance > 0 ? "bg-red-500" : "bg-green-500"}
        />
        <KPICard
          title="Analyzed Shipments"
          value={shipmentsWithActualCosts.length}
          subtitle="With actual costs"
          icon={<AlertCircle className="h-6 w-6" />}
          bgColor="bg-purple-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue vs Cost by Shipment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Legend />
              <Bar dataKey="Revenue" fill="#10B981" />
              <Bar dataKey="Cost" fill="#EF4444" />
              <Bar dataKey="Profit" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costBreakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {costBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profitability Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Shipment Profitability Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Shipment
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Customer
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Revenue
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Est. Cost
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Actual Cost
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Variance
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Profit
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Margin
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profitabilityData.map((data) => (
                <tr 
                  key={data.shipment.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedShipmentId(data.shipment.id)}
                >
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{data.shipment.shipmentNumber}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                    <div className="text-gray-900">{data.shipment.customer?.name}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-right font-semibold text-gray-900">
                    ${data.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-right text-gray-600">
                    ${data.estimatedCost.toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-right text-gray-900">
                    ${data.actualCost.toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-right">
                    <span className={`font-medium ${
                      data.variance > 0 ? 'text-red-600' : data.variance < 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {data.variance > 0 ? '+' : ''}{data.variance.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-right font-semibold text-green-600">
                    ${data.profit.toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-right">
                    <span className={`font-medium ${
                      data.margin >= 15 ? 'text-green-600' :
                      data.margin >= 10 ? 'text-blue-600' :
                      data.margin >= 5 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {data.margin.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed View Modal */}
      {selectedShipmentId && (
        <DetailedProfitModal
          data={profitabilityData.find(d => d.shipment.id === selectedShipmentId)}
          onClose={() => setSelectedShipmentId(null)}
        />
      )}
    </div>
  );
}

function KPICard({ 
  title, 
  value, 
  subtitle, 
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
      <div className="flex items-baseline">
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
      </div>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}

function DetailedProfitModal({ 
  data, 
  onClose 
}) {
  const { shipment } = data;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Detailed Profit Analysis</h2>
          <p className="text-gray-600 mt-1">{shipment.shipmentNumber} - {shipment.customer?.name}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Revenue Section */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Revenue</h3>
            <div className="text-3xl font-bold text-green-600">
              ${data.revenue.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Sales Order: {shipment.salesOrder?.orderNumber}
            </p>
          </div>

          {/* Cost Comparison */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Cost Analysis</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Estimated Cost</div>
                <div className="text-2xl font-semibold text-gray-900">
                  ${data.estimatedCost.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Actual Cost</div>
                <div className="text-2xl font-semibold text-gray-900">
                  ${data.actualCost.toLocaleString()}
                </div>
              </div>
            </div>
            <div className={`mt-4 p-4 rounded-lg ${
              data.variance > 0 ? 'bg-red-50' : data.variance < 0 ? 'bg-green-50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Variance:</span>
                <span className={`text-xl font-bold ${
                  data.variance > 0 ? 'text-red-600' : data.variance < 0 ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {data.variance > 0 ? '+' : ''}${data.variance.toLocaleString()}
                  <span className="text-sm ml-2">
                    ({((data.variance / data.estimatedCost) * 100).toFixed(1)}%)
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown Comparison</h3>
            <div className="space-y-2 text-sm">
              <CostComparisonRow 
                label="Freight" 
                estimated={shipment.estimatedCosts.freight} 
                actual={shipment.actualCosts?.freight || 0} 
              />
              <CostComparisonRow 
                label="Duty" 
                estimated={shipment.estimatedCosts.duty} 
                actual={shipment.actualCosts?.duty || 0} 
              />
              <CostComparisonRow 
                label="Insurance" 
                estimated={shipment.estimatedCosts.insurance} 
                actual={shipment.actualCosts?.insurance || 0} 
              />
              <CostComparisonRow 
                label="Local Transport" 
                estimated={shipment.estimatedCosts.localTransport} 
                actual={shipment.actualCosts?.localTransport || 0} 
              />
              <CostComparisonRow 
                label="Handling" 
                estimated={shipment.estimatedCosts.handling} 
                actual={shipment.actualCosts?.handling || 0} 
              />
              <CostComparisonRow 
                label="Other" 
                estimated={shipment.estimatedCosts.other} 
                actual={shipment.actualCosts?.other || 0} 
              />
            </div>
          </div>

          {/* Profit Summary */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Profit Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Selling Price:</span>
                <span className="font-semibold text-gray-900">${data.revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Actual Total Cost:</span>
                <span className="font-semibold text-gray-900">-${data.actualCost.toLocaleString()}</span>
              </div>
              <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Net Profit:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${data.profit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Profit Margin:</span>
                <span className={`text-xl font-bold ${
                  data.margin >= 15 ? 'text-green-600' :
                  data.margin >= 10 ? 'text-blue-600' :
                  data.margin >= 5 ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {data.margin.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function CostComparisonRow({ 
  label, 
  estimated, 
  actual 
}) {
  const variance = actual - estimated;
  const variancePercent = estimated > 0 ? (variance / estimated * 100) : 0;

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-200">
      <span className="text-gray-700 font-medium">{label}</span>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-xs text-gray-500">Estimated</div>
          <div className="text-gray-900">${estimated.toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Actual</div>
          <div className="text-gray-900">${actual.toLocaleString()}</div>
        </div>
        <div className="text-right min-w-[80px]">
          <div className="text-xs text-gray-500">Variance</div>
          <div className={`font-medium ${
            variance > 0 ? 'text-red-600' : variance < 0 ? 'text-green-600' : 'text-gray-600'
          }`}>
            {variance > 0 ? '+' : ''}{variance.toLocaleString()}
            {variancePercent !== 0 && (
              <span className="text-xs ml-1">
                ({variancePercent > 0 ? '+' : ''}{variancePercent.toFixed(0)}%)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
