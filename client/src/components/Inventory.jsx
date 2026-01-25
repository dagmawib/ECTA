"use client";
import { useState } from "react";
import { mockProducts, mockInventoryTransactions } from "../data/mockData";
import { Package, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

export default function Inventory() {
  const [products] = useState(mockProducts);
  const [transactions] = useState(mockInventoryTransactions);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Inventory</h1>
        <p className="text-gray-600 mt-1">
          Track products and inventory movements
        </p>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 text-base sm:text-lg">
            Product Master
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[900px] sm:min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Product Code
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Category
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Unit Cost
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Unit
                </th>
                <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  HS Code
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-3 whitespace-nowrap font-medium text-gray-900">
                    {product.code}
                  </td>

                  <td className="px-3 sm:px-6 py-3">
                    <div className="text-gray-900">{product.name}</div>
                    <div className="text-[11px] sm:text-sm text-gray-500">
                      {product.description}
                    </div>
                  </td>

                  <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-[11px] font-medium rounded">
                      {product.category}
                    </span>
                  </td>

                  <td className="px-3 sm:px-6 py-3 whitespace-nowrap font-semibold text-gray-900">
                    ${product.unitCost.toLocaleString()}
                  </td>

                  <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-600">
                    {product.unit}
                  </td>

                  <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-gray-600 font-mono text-[11px] sm:text-sm">
                    {product.hsCode}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Transactions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 text-base sm:text-lg">
            Inventory Movements
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Track goods across the supply chain
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {transactions.map((transaction) => {
            const product = products.find(
              (p) => p.id === transaction.productId,
            );

            return (
              <div key={transaction.id} className="p-4 sm:p-6 hover:bg-gray-50">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left section */}
                  <div className="flex items-start">
                    <div className="p-3 bg-blue-50 rounded-lg shrink-0">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>

                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">
                        {product?.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {transaction.quantity} {product?.unit} • {product?.code}
                      </p>

                      <div className="flex flex-wrap items-center mt-2 text-sm text-gray-600 gap-x-2">
                        <span>{transaction.location || "N/A"}</span>
                        {transaction.notes && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span>{transaction.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right section */}
                  <div className="flex sm:flex-col sm:items-end sm:text-right justify-between">
                    <StockStatusBadge status={transaction.status} />
                    <div className="text-sm text-gray-500 mt-0 sm:mt-2">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <StockSummaryCard
          title="On Order"
          count={transactions.filter((t) => t.status === "on_order").length}
          icon={<AlertCircle className="h-6 w-6" />}
          bgColor="bg-orange-500"
        />
        <StockSummaryCard
          title="In Transit"
          count={transactions.filter((t) => t.status === "in_transit").length}
          icon={<TrendingUp className="h-6 w-6" />}
          bgColor="bg-blue-500"
        />
        <StockSummaryCard
          title="At Warehouse"
          count={transactions.filter((t) => t.status === "at_warehouse").length}
          icon={<CheckCircle className="h-6 w-6" />}
          bgColor="bg-green-500"
        />
        <StockSummaryCard
          title="Total Products"
          count={products.length}
          icon={<Package className="h-6 w-6" />}
          bgColor="bg-purple-500"
        />
      </div>
    </div>
  );
}

function StockStatusBadge({ status }) {
  const configs = {
    on_order: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      label: "On Order",
    },
    in_transit: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      label: "In Transit",
    },
    at_warehouse: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "At Warehouse",
    },
    allocated: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      label: "Allocated",
    },
    sold: { bg: "bg-gray-100", text: "text-gray-800", label: "Sold" },
  };

  const config = configs[status] || configs.on_order;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}

function StockSummaryCard({ title, count, icon, bgColor }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`${bgColor} rounded-lg p-3 text-white`}>{icon}</div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-semibold text-gray-900">{count}</p>
    </div>
  );
}
